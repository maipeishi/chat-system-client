<template>
  <Row style="margin-top:10%;">
    <Col offset="14">
    <div id="form_background">
      <Form ref="formValidate" :model="formValidate" id="form" :rules="ruleValidate" :label-width="80">
        <FormItem label="邮箱" prop="email">
          <Input class="input" v-model="formValidate.email" type="email" placeholder="输入邮箱"></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input class="input" v-model="formValidate.username" placeholder="输入用户名"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input class="input" v-model="formValidate.password" type="password" placeholder="输入密码"></Input>
        </FormItem>
        <FormItem label="重复密码" prop="rePassword">
          <Input
            class="input"
            v-model="formValidate.rePassword"
            type="password"
            placeholder="再次输入密码"
          ></Input>
        </FormItem>
        <FormItem style="margin-left:-30px;">
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button to="/login" style="margin-left: 8px">去登录</Button>
        </FormItem>
      </Form>
      </div>
    </Col>
  </Row>
</template>
<script>
import dataHelper from "./DataHelper.js";
export default {
  data() {
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.formValidate.password) {
        callback(new Error("The two input passwords do not match!"));
      } else {
        callback();
      }
    };
    return {
      formValidate: {
        email: "",
        username: "",
        password: "",
        rePassword: ""
      },
      ruleValidate: {
        email: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          },
          { type: "email", message: "Incorrect email format", trigger: "blur" }
        ],
        username: [
          { required: true, message: "Please select gender", trigger: "blur" },
          {
            type: "string",
            max: 20,
            message: "password no more than 20 words",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "Please select gender", trigger: "blur" },
          {
            type: "string",
            max: 20,
            message: "password no less than 20 words",
            trigger: "blur"
          }
        ],
        rePassword: [
          {
            required: true,
            message: "Please select gender",
            trigger: "change"
          },
          { validator: validatePassCheck, trigger: "change" }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          dataHelper.postData(
            this,
            "api/auth/register",
            {
              email: this.formValidate.email,
              username: this.formValidate.username,
              password: this.formValidate.password
            },
            result => {
              console.log(result);
              if (result) {
                //跳转，提示
                alert(result);
                this.$router.replace("/login");
              }
            }
          );
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>
<style>
.input {
  width: 300px;
}
#form_background{
  float: left;
  background-color:  rgba(240, 248, 255, 0.801);
  border-radius: 20px;
}
#form{
  width: 450px;
  padding-top: 30px;
  padding-left: 25px;
  padding-right: 30px;
}
</style>