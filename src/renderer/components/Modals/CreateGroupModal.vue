<template>
  <Modal :value="createGroupModalOpen" footer-hide title="创建群聊" :z-index="9990" @on-cancel="CancelCreateGroupModal">
    <!-- grouplist这里有问题 -->
    <h2 v-if="finishCreate">创建群成功，你的群号是{{creategroupformItem.group_id}}</h2>
    <Form
      v-else
      ref="creategroupformItem"
      :model="creategroupformItem"
      :label-width="80"
      :rules="creategroupformRules"
    >
      <FormItem label="群名称: " prop="name">
        <Input
          class="creategroupform_input"
          v-model="creategroupformItem.name"
          placeholder="为你们的群起个给力的名字吧!"
        ></Input>
      </FormItem>
      <FormItem label="加群验证: ">
        <RadioGroup v-model="creategroupformItem.verify">
          <Radio label="anybody">允许任何人</Radio>
          <Radio label="verify">需要身份验证</Radio>
          <Radio label="nobody">不允许任何人</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="群简介: ">
        <Input class="creategroupform_input" v-model="creategroupformItem.introduce" type="textarea" placeholder="介绍一下你们吧!"></Input>
      </FormItem>
      <FormItem id="btn_box">
        <Button type="primary" @click="CreateGroup('creategroupformItem')">创建</Button>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { mapState, mapActions } from "vuex";
import dataHelper from "../DataHelper.js";
export default {
  name: 'create-group-modal',
  props: {
    createGroupModalOpen: false,
    socket: {},
  },
  data() {
    return {
      creategroupformItem: {
        name: '',
        verify: 'verify',
        introduce: '',
        id: '',
      },
      creategroupformRules: {
        name: [
          { required: true, message: '群名称不能为空', trigger: 'blur' }
        ],
      },
      // 显示群号码
      finishCreate: false,
    }
  },
  methods: {
    ...mapActions('user',['handleAddGroup']),
    CancelCreateGroupModal() {
      this.$emit('CancelModal')
      this.finishCreate = false
    },
    CreateGroup(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 创建群
          dataHelper.postData(this,'api/group/create',{name:this.creategroupformItem.name,leader:this.$store.state.user.email},(result) => {
            console.log('创建群成功')
            console.log(result)
            this.handleAddGroup({group:result})
            // 发送socket进入房间
            this.socket.emit('createGroupJoin', {result})
            this.creategroupformItem = result[0]
            this.finishCreate = true
          })
          this.$Message.success('Success!');
        } else {
          this.$Message.error('Fail!');
        }
      })
    }
  }
}
</script>

<style>
</style>
