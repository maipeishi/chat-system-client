<template>
  <Modal :z-index="9991" :value="verifyModalOpen" title="发送验证信息" @on-cancel="CancelVerifyModal">
    <div v-if="addModal === 'friend'" id="add_verify">
      <Avatar id="avatar_person" v-if="findResults[addIndex]&&findResults[addIndex].avatar" :src="findResults[addIndex].avatar"></Avatar>
      <Avatar id="avatar_person" v-else :src="require('../../assets/_ionicons_svg_ios-person.svg')"></Avatar>
      <span id="name_person">{{findResults[addIndex]?findResults[addIndex].user_name:''}}</span>
      <span id="email_person">{{findResults[addIndex]?findResults[addIndex].user_email:''}}</span>
      <span id="verify_text">请输入验证信息:</span>
      <Input
        id="verify_textarea"
        v-model="verifyText"
        type="textarea"
        :rows="4"
        placeholder="我是..."
      />
    </div>
    <div v-if="addModal === 'group'" id="add_verify">
      <Avatar id="avatar_person" v-if="findResults[addIndex]&&findResults[addIndex].avatar" :src="findResults[addIndex].avatar"></Avatar>
      <Avatar id="avatar_person" v-else :src="require('../../assets/_ionicons_svg_ios-person.svg')"></Avatar>
      <span id="name_person">{{findResults[addIndex]?findResults[addIndex].group_name:''}}</span>
      <span id="email_person">{{findResults[addIndex]?findResults[addIndex].group_id:''}}</span>
      <span id="email_person">群主: {{findResults[addIndex]?findResults[addIndex].leader:''}}</span>
      <span id="verify_text">请输入验证信息:</span>
      <Input id="verify_textarea" v-model="verifyText" type="textarea" :rows="4" placeholder="..."/>
    </div>
    <div slot="footer">
      <Button type="info" @click="SendVerify(verifyText,addIndex)">发送</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'verify-modal',
  props: {
    verifyModalOpen: false,
    addModal: '',
    findResults: '',
    addIndex: 0,
    socket: {},
  },
  data() {
    return {
      verifyText: '',
    }
  },
  methods: {
    SendVerify(verifyText,addIndex) {
      const date = new Date()
      const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      const timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      const friendData = { data:verifyText, toEmail: this.findResults[addIndex].user_email, fromUser: this.$store.state.user, date: dateStr, time: timeStr, type: 1}
      const groupData = { data:verifyText, toEmail: this.findResults[addIndex].leader, fromUser: this.$store.state.user, group: this.findResults[this.addIndex], date: dateStr, time: timeStr, type: 2}
      const type = this.addModal === 'friend' ? this.socket.emit('addVerify', friendData) : this.socket.emit('addVerify', groupData)
      // 发送好友/群组验证 好友，toEmail对方email 群，管理员-暂时没有/群主email
      // this.socket.emit('addVerify', { data:value, toEmail: this.user_email, fromUser: this.$store.state.user, date: dateStr, time: timeStr, type: type})
      this.CancelVerifyModal()
      this.$Message.success('已发送验证信息');
    },
    CancelVerifyModal() {
      this.verifyText = ''
      this.$emit('CancelModal')
    }
  },
}
</script>

<style>
</style>
