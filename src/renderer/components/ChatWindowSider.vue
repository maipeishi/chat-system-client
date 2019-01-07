<template>
  <div id="group_member">
    <Table :height="clientHeinght-50" :columns="groupMembersCol" :data="groupMembersData"></Table>
    <SearchFriendModal
      :socket="socket"
      :modalOpen="modalOpen"
      @CancelModal="modalOpen=false"
      :groupSelected="groupSelected"
    ></SearchFriendModal>
  {{groupMembers}}
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import dataHelper from './DataHelper.js';
import SearchFriendModal from './Modals/SearchFriendModal.vue'
// import ChatWindowSider from './ChatWindowSider'
export default {
  name: 'chat-window-sider',
  components: {
    SearchFriendModal,
  },
  props: {
    clientHeinght: 0,
    groupSelected: {},
    socket: {},
  },
  watch: {

  },
  computed: {
    ...mapState({
      groupMembersData: state => state.socket.selectedGroupMembers,
    }),
    groupMembers: function () {
      this.getGroupMembers()
    },
  },
  data() {
    return {
      modalOpen: false,
      groupMembersCol: [
        {          title: '群成员', key: 'user_email', render: (h, params, vm) => {
            if (params.row.user_email === this.groupSelected.leader) {
              return h('div', [h('Tooltip', {
                props: {
                  content: '群主',
                  placement: 'top-start'
                }
              }, [
                  h('Icon', {
                    props: {
                      type: 'md-person'
                    }
                  })
                ]), h('span', {
                  props: {}
                }, `${params.row.user_name}(${params.row.user_email})`)
              ])
            } else {
              return h('span', {}, `${params.row.user_name}(${params.row.user_email})`)
            }
          }, renderHeader: (h, params, vm) => {
            const th = this;
            return h('div', {
              style: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }

            }, [h('div', {
              props: {},
              style: {
                width: '100%'
              }

            }, '群成员'), h('Tooltip', {
              props: {
                content: '邀请成员',
                placement: 'top',
              }
            }, [h('Button', {
              props: {
                shape: 'circle',
                icon: 'md-add',
              },
              on: {
                click() {
                  th.modalOpen = true
                }
              }
            })
              ])
              ])
          }        },
      ],
      // groupMembersData: []
    }
  },
  methods: {
    ...mapActions('socket', ['handleAddSelectedGroupMembers']),
    getGroupMembers() {
      dataHelper.postData(this, 'api/group/getGroupMembers', { group_id: this.groupSelected.id }, (result) => {
        console.log(result)
        const data = result
        const type = 'all'
        this.handleAddSelectedGroupMembers({ data , type })
      })
    }
  },
  created() {
    // 获取群成员
    // this.getGroupMembers()
    // dataHelper.postData(this, 'api/group/getGroupMembers', { group_id: this.groupSelected.id }, (result) => {
    //   console.log(result)
    //   // this.groupSelected.member.push(...result)
    //   this.handleAddSelectedGroupMembers({ data: result }, { type: undefined })
    //   // this.groupMembersData.push(...result)
    // })
  }
}

// 能获取，但是groupMembersData是空
// inviteResult().then((resolve) => {
//   console.log(ChatWindowSider.data().groupMembersData)
//   ChatWindowSider.data().groupMembersData.push({user_email:resolve.fromUser.email,user_name:resolve.fromUser.username})
// })
</script>

<style>
thead .ivu-table-cell{
  width: 100%;
}
#group_member {
  float: right;
  width: 20%;
}
</style>
