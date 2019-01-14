<template>
  <div id="box">
    <Form id="loginFrom" ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="email">
              <Input type="email" v-model="formInline.email" placeholder="邮箱">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formInline.password" placeholder="密码">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <Row type="flex" justify="center">
              <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
              <Button type="primary" to='/register/' id="register">注册</Button>
              </Row>
            </FormItem>
          </Form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import dataHelper from './DataHelper.js'
export default {
  data () {
    return {
      formInline: {
        email: '',
        password: ''
      },
      ruleInline: {
        email: [
          { required: true, message: 'Please fill in the email', trigger: 'blur' },
          { type: "email", message: "Incorrect email format", trigger: "blur" }
        ],
        password: [
          { required: true, message: 'Please fill in the password.', trigger: 'blur' },
          { type: 'string', min: 1, max: 20, message: 'The password length cannot be less than 1 bits and more than 20 bits', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions('user',[
      'handleLogin'
    ]),
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          dataHelper.postData(this,'api/auth/login', {email:this.formInline.email,password:this.formInline.password}, (result) => {
            console.log(result)
            if(result.id) {
              this.$Message.success('Success!');
              var email = {email:result.user_email}
              var id = {id:result.id}
              var avatar = {avatar:result.avatar}
              var username = {username:result.user_name}
              var token = {token:''}

              // 存入state
              this.handleLogin({username,email,id,avatar,token})
              console.log(this.$store.state.user)
              //this.formInline.email = ''
              this.formInline.password = ''
              this.$router.push({ path: '/main/' })
            }
          })
        } else {
          this.$Message.error('Fail!');
        }
      })
    }
  }
}
</script>

<style>
body{
  background-image: url(../assets/50a60e2442a7d933b712dac2ad4bd11372f001d9.jpg);
  background-size:100%;
}
#box{
  margin-top: 15%;
  margin-left: 40%;
  width: 25%;
  background-color: rgba(240, 248, 255, 0.801);
  border-radius: 20px;
}
#loginFrom{
  width:80%;
  padding-top: 40px;
  padding-left: 40px;
  padding-bottom: 20px;
}
#register{
  margin-left: 10px;
}
</style>
