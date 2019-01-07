<template>
  <Modal
    :z-index="9990"
    :value="messageModelOpen"
    title="验证消息"
    @on-cancel="CancelMessageModal"
    @on-ok="CancelMessageModal"
  >
    <Scroll :height="modalHeight">
      <p style="text-align:center;" v-if="verifyMessage.length <= 0">暂无消息</p>
      <div v-for="(item,index) in verifyMessage" :key="index">
        <Divider v-if="index === 0 || item.date !== verifyMessage[index-1].date">
          <span class="massege_date">{{item.date}}</span>
        </Divider>
        <Divider v-else/>
        <p class="message_time">{{item.fromUser.email}} {{item.time}}</p>
        <div
          class="message_data"
          v-if="item.type === 1 || item.type === 3 || item.type === 2 || item.type === 4"
        >
          <p>{{item.fromUser.username}}({{item.fromUser.email}}){{item.type === 2 || item.type === 4 ? `请求加入群${item.group.group_name}(${item.group.group_id})` : '请求您添加为好友'}}</p>
          <Row>验证信息: {{item.data}}</Row>
          <Button class="message_btn" @click="AddFriend(index)" v-if="item.type === 1">
            <span>同意</span>
          </Button>
          <Button v-if="item.type === 3" class="message_btn" disabled>
            <span>已同意</span>
          </Button>
          <Button v-if="item.type === 2" class="message_btn" @click="AddGroup(index)">
            <span>同意</span>
          </Button>
          <Button v-if="item.type === 4" class="message_btn" disabled>
            <span>已同意</span>
          </Button>
          <Button class="message_btn">忽略</Button>
        </div>
        <div v-if="item.type === 0">
          <!-- fromUser是接受方 -->
          <p>{{item.fromUser.username}}({{item.fromUser.email}}){{item.data}}</p>
        </div>
        <div v-if="item.type === 7">
          <p>{{item.userB.user_name}}({{item.userB.friend_email}}){{item.data}}</p>
        </div>
        <div v-if="item.type === 5 || item.type === 6">
          <p v-if="user_email === item.group.leader">{{item.fromUser.username}}({{item.fromUser.email}})请求{{item.userB.user_name}}({{item.userB.friend_email}})加入群{{item.group.name}}({{item.group.id}})</p>
          <p v-else>您的好友{{item.fromUser.username}}({{item.fromUser.email}})请求您加入群{{item.group.name}}({{item.group.id}})</p>
          <Row>验证信息: {{item.data}}</Row>
          <Button class="message_btn" @click="JoinGroup(index)" v-if="item.type === 5">
            <span>同意</span>
          </Button>
          <Button v-if="item.type === 6" class="message_btn" disabled>
            <span>已同意</span>
          </Button>
          <Button class="message_btn">忽略</Button>
        </div>
      </div>
    </Scroll>
  </Modal>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: 'message-modal',
  props: {
    messageModelOpen: false,
    socket: {},
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      verifyMessage: state => state.socket.verifyMessage,
      user_email: state => state.user.email,
    }),
    modalHeight() {
      if (this.messageModelOpen) {
        if (this.verifyMessage.length <= 0)
          return 30
        else
          return 350
      }
    },
  },
  methods: {
    AddGroup(index) {
      // userA 申请方
      this.socket.emit('addGroup', { userA: this.verifyMessage[index].fromUser, userB: this.$store.state.user, group: this.verifyMessage[index].group, index: index })
    },
    AddFriend(index) {
      // userA 邀请方
      this.socket.emit('addFriend', { userA: this.verifyMessage[index].fromUser, userB: this.$store.state.user, index: index })
    },
    JoinGroup(index) {
      // userB 接受方 userA 邀请方
      if(this.$store.state.user.email === this.verifyMessage[index].group.leader)
        this.socket.emit('acceptInviteAddToGroupLeader', { userA: this.verifyMessage[index].fromUser, userB: this.verifyMessage[index].userB, index: index, group: this.verifyMessage[index].group })
      else
        this.socket.emit('acceptInviteAddToGroup', {userA: this.verifyMessage[index].fromUser, userB: this.verifyMessage[index].userB, index: index, group: this.verifyMessage[index].group})
      console.log(index)
    },
    CancelMessageModal() {
      this.$emit('CancelModal')
    },
  },
}
</script>

<style>
</style>
