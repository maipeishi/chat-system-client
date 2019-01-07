<template>
  <div>
    <Row>
      <Col span="1">
      <Avatar v-if="Selected.avatar" :src="Selected.avatar"></Avatar>
      <!-- <Avatar v-if="Selected && Selected.avatar" icon="ios-person"></Avatar> -->
      </Col>
      <Col span="20">{{Selected.name}}</Col>
      <Button
        v-if="showChatWindow !== ''"
        @click="showRemove"
        shape="circle"
        icon="md-remove"
        :title="showChatWindow === 'friend' ? '移除该好友' : '退出该群'"
      ></Button>
      <Dropdown trigger="click" @on-click="SearchAdd($event)">
        <Button shape="circle" icon="md-add"></Button>
        <DropdownMenu slot="list">
          <DropdownItem name="friend">添加好友</DropdownItem>
          <DropdownItem name="group">添加群组</DropdownItem>
          <DropdownItem name="create">创建群聊</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Tooltip content="验证消息" placement="top-start">
        <Button shape="circle" @click="showVerifyMessage">
          <Badge dot v-if="this.$store.state.socket.verifyMessage.length > 0">
            <Icon type="ios-text" size="17"></Icon>
          </Badge>
          <Icon v-else type="ios-text" size="17"></Icon>
        </Button>
      </Tooltip>
      <Dropdown trigger="click" @on-click="Logout">
        <Button shape="circle" icon="md-settings"></Button>
        <DropdownMenu slot="list">
          <DropdownItem>退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Row>
    <Modal
      :z-index="9990"
      v-model="showSearchModal"
      :title="modalTitle"
      @on-ok="ok"
      @on-cancel="cancel"
      draggable
      width="900"
    >
      <Row>
        <Input search @on-search="Search($event)" enter-button="搜索" placeholder="输入账号或昵称搜索"/>
      </Row>
      <div id="find_results">
        <Card class="result_card" v-for="(item,index) in findResults" :key="item.id">
          <div class="box">
            <Avatar class="result_avatar" :src="item.avatar" v-if="item.avatar"/>
            <Avatar class="result_avatar" v-else>
              <Icon type="ios-person" size="60"/>
            </Avatar>
            <div class="result_name">
              <span>{{addModal === 'friend' ? item.user_name : `${item.group_name}(${item.group_id})`}}</span>
              <Button
                icon="md-add"
                class="addBtn"
                type="info"
                @click="AddVerify(index)"
                size="small"
              >{{addModal === 'friend' ? '好友' : '群组'}}</Button>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
    <VerifyModal
      :addModal="addModal"
      :verifyModalOpen="verifyModalOpen"
      :findResults="findResults"
      :socket="socket"
      :addIndex="addIndex"
      @CancelModal="verifyModalOpen=false"
    ></VerifyModal>
    <MessageModal
      :messageModelOpen="messageModelOpen"
      @CancelModal="messageModelOpen=false"
      :socket="socket"
    ></MessageModal>
    <CreateGroupModal
      :createGroupModalOpen="createGroupModalOpen"
      @CancelModal="createGroupModalOpen=false"
      :socket="socket"
    ></CreateGroupModal>
    <Modal :title="removeConfirm" v-model="removeConfirmModal" @on-ok="Remove">
      <p>确认{{removeConfirm}}?</p>
      <p v-if="Selected.leader && Selected.leader === user_email">群主退出将解散群</p>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import dataHelper from "./DataHelper.js";
import VerifyModal from './Modals/VerifyModal.vue'
import MessageModal from './Modals/MessageModal.vue'
import CreateGroupModal from './Modals/CreateGroupModal.vue'
export default {
  name: "Header",
  components: {
    VerifyModal,
    MessageModal,
    CreateGroupModal,
  },
  props: {
    Selected: {},
    socket: {},
    showChatWindow: '',
  },
  data() {
    return {
      // friend || group
      addModal: "",
      showSearchModal: false,
      modalTitle: "",
      findResults: [],

      verifyModalOpen: false,
      addIndex: 0,
      verifyText: '',

      messageModelOpen: false,
      createGroupModalOpen: false,

      removeConfirm: '',
      removeConfirmModal: false,
    };
  },
  watch: {
    addModal: function () {
      console.log(this.addModal);
    }
  },
  computed: {
    ...mapState({
      user_email: state => state.user.email,
      groupList: state => state.user.groupList
    }),
  },
  methods: {
    ...mapActions('user', ['handleRemoveFriend', 'handleLeaveGroup']),
    cancel() {
      this.showSearchModal = false
      this.findResults = []
    },
    ok() { },
    SearchAdd(value) {
      this.addModal = value;
      if (this.addModal === "friend") {
        this.modalTitle = "找人";
        this.showSearchModal = true;
      }
      if (this.addModal === "group") {
        this.modalTitle = "找群";
        this.showSearchModal = true;
      }
      if (this.addModal === 'create') {
        this.createGroupModalOpen = true
      }
    },
    AddVerify(index) {
      this.verifyModalOpen = true
      this.addIndex = index
    },
    Search(value) {
      if (value === "")
        return;
      this.findResults = []
      // 找人
      if (this.addModal === "friend") {
        console.log(`搜索人${value}`);
        dataHelper.postData(this, "api/search/User", { value: value }, result => {
          console.log(result);
          this.findResults = result
        });
      }
      // 找群
      if (this.addModal === 'group') {
        console.log(`搜索群${value}`);
        dataHelper.postData(this, "api/search/addGroupSearch", { value: value }, result => {
          console.log(result);
          this.findResults = result
        });
      }
    },
    showVerifyMessage() {
      this.messageModelOpen = true
    },
    showRemove() {
      if (this.showChatWindow === 'friend') {
        this.removeConfirm = '移除好友'
      }
      if (this.showChatWindow === 'group') {
        this.removeConfirm = '退出群'
      }
      this.removeConfirmModal = true
    },
    Remove() {
      if (this.showChatWindow === 'friend') {
        this.RemoveFriend()
      }
      if (this.showChatWindow === 'group') {
        if (this.Selected.leader === this.user_email) {
          this.removeGroup()
        }
        else {
          this.LeaveGroup()
        }
      }
    },
    RemoveFriend() {
      dataHelper.postData(this, 'api/remove/removeFriend', { user_email: this.user_email, friend_email: this.Selected.email }, (result) => {
        console.log(result)
        this.handleRemoveFriend({ friend: result })
        this.$Message.success('移除好友成功');
      })
    },
    LeaveGroup() {
      dataHelper.postData(this, 'api/remove/leaveGroup', { user_email: this.user_email, group_id: this.Selected.id }, (result) => {
        console.log(result)
        this.handleLeaveGroup({ group: result })
        this.socket.emit('leaveGroup', {group: this.Selected})
        this.$Message.success('离开群成功');
      })
    },
    removeGroup() {
      // 解散群
      this.socket.emit('removeGroup', { group: this.Selected, fromUser: this.$store.state.user })
    },
    Logout() {
      dataHelper.postData(this, 'api/auth/logout', { user_email: this.user_email }, (result) => {
        console.log('退出登录')
        this.$router.replace('/')
      })
    }
  }
};
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
.addBtn {
  width: 60px;
}
#add_verify {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#avatar_person {
  width: 80px;
  height: 80px;
  border-radius: 80px;
}
#name_person {
  font-size: 18px;
  font-weight: bold;
}
#email_person {
  font-size: 18px;
}
#verify_text {
  font-size: 15px;
  font-weight: bold;
  margin-top: 10px;
}
#verify_textarea {
  width: 300px;
}
.message_date {
  font-size: 13px;
}
.message_time {
  color: cornflowerblue;
  font-size: 15px;
}
.message_data {
  font-size: 15px;
}
.message_btn {
  margin-top: 10px;
}
.creategroupform_input {
  width: 80%;
}
#btn_box {
  margin-left: 120px;
}
</style>

