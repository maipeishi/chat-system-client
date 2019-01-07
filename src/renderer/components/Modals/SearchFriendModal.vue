<template>
  <Modal
    title="邀请成员"
    v-bind:value="modalOpen"
    @on-cancel="CancelInviteModal"
    @on-ok="InviteToGroup"
    width="500"
    :z-index="9990"
  >
    <Row>
      <Input search @on-search="Search($event)" enter-button="搜索好友" placeholder="输入账号或昵称搜索"/>
    </Row>
    <div id="find_results">
      <Table
        :columns="friendCol"
        highlight-row
        :height="450"
        :width="450"
        :data="friendData"
        @on-current-change="SelectedChange($event)"
      ></Table>
    </div>
  </Modal>
</template>

<script>
import dataHelper from "../DataHelper.js";
export default {
  name: 'search-friend-modal',
  props: {
    modalOpen: false,
    socket: {},
    groupSelected: {},
  },
  watch: {
    modalOpen() {
      if (this.modalOpen)
        this.SearchFriends('')
    }
  },
  data() {
    return {
      currentSelectedRowObject: {},
      friendCol: [
        { title: '好友', render: (h, params, vm) => {
            if (params.row.avatar) {
              return h('div', [h('Avatar', {
                props: {
                  src: params.row.avatar
                }
              }), h('span', {}, `${params.row.user_name}(${params.row.friend_email})`)])
            }
            else {
              return h('div', [h('Avatar', {
                props: {
                  icon: 'ios-person',
                },
                style: {

                }
              }), h('span', {}, `${params.row.user_name}(${params.row.friend_email})`)])
            }
          }        }
      ],
      friendData: [],
    }
  },
  methods: {
    Search(searchValue) {
      console.log(`搜索 ${searchValue}`)
      this.friendData = []
      this.SearchFriends(searchValue)
    },
    SearchFriends(searchValue) {
      dataHelper.postData(this, 'api/search/Friend', { searchValue: searchValue, user_email: this.$store.state.user.email }, (result) => {
        console.log('搜索全部好友')
        console.log(result)
        this.friendData = result
      })
    },
    SelectedChange(currentRow, oldCurrentRow) {
      console.log(currentRow)
      this.currentSelectedRowObject = currentRow
    },
    InviteToGroup() {
      const date = new Date()
      const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      const timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      // userA、fromUser 发起邀请方 userB currentSelectedRowObject
      this.socket.emit('inviteToGroup', { fromUser: this.$store.state.user, userB:this.currentSelectedRowObject, group: this.groupSelected, date:dateStr, time:timeStr, type: 5})
      this.$Message.success('已发送邀请')
      this.$emit('CancelModal')
    },
    CancelInviteModal() {
      this.$emit('CancelModal')
    },
  },
}
</script>

<style>
#find_results {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.result_card {
  width: 250px;
}
.box {
  display: flex;
  flex-direction: row;
}
.result_avatar {
  width: 60px;
  height: 60px;
  border-radius: 60px;
}
.result_name {
  font-size: 20px;
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
</style>
