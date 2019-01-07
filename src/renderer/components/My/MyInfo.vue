<template>
  <div>
    <Form :model="userInfo" :label-width="80">
      <FormItem label="邮箱">{{userInfo.email}}</FormItem>
      <FormItem label="昵称">
        <Input v-model="username" id="userinfo_username"></Input>
      </FormItem>
      <FormItem label="头像">
        <div id="avatar_div">
          <mu-avatar v-if="avatarUrl" :size="100">
            <img :src="avatarUrl">
          </mu-avatar>
          <mu-avatar v-else :size="100">
            <img src="../../assets/_ionicons_svg_ios-person.svg">
          </mu-avatar>
          <!-- <img v-if="avatar" :src="avatar">
          <img v-else :src="require('../../assets/_ionicons_svg_ios-person.svg')">-->
          <div id="avater_cover">
            <!-- <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              action="//47.107.155.139:8360/api/upload/avatar"
              name="avatar"
            >
              <div>
                <Icon type="ios-camera" size="50" color="white"></Icon>
              </div>
            </Upload>-->
            <!-- <Button type="text"> -->
            <Icon type="ios-camera" size="50" color="white"></Icon>
            <input
              id="open_avatar"
              style="position:absolute;width:50px;height:50px;font-size:20px; opacity:0"
              accept="image/png, image/jpeg, image/gif, image/jpg"
              name="avatar"
              @change="OpenAvatar($event)"
              type="file"
            >
            <!-- </Button> -->
            <!-- <Button>
              <input
                type="file"
                id="uploads"
                style="position:absolute; clip:rect(0 0 0 0);"
                accept="image/png, image/jpeg, image/gif, image/jpg"
                @change="uploadImg($event, 1)"
              >
              <Icon type="ios-camera" size="50" color="white"></Icon>
            </Button>-->
          </div>
        </div>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="updateUserInfo">提交修改</Button>
      </FormItem>
    </Form>
    <Modal title="修改头像" scrollable v-model="avatarEditModal" @on-ok="getAvatar">
      <div id="avatar_editor">
        <vueCropper
          ref="cropper"
          :img="avatarLocalPath"
          :outputSize="1"
          :info="true"
          :full="true"
          :canMove="true"
          :canMoveBox="true"
          :fixedBox="true"
          :original="false"
          :autoCrop="true"
          :centerBox="true"
          :high="true"
          :infoTrue="false"
          :enlarge="1"
          :autoCropWidth="100"
          :autoCropHeight="100"
        ></vueCropper>
      </div>
    </Modal>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { mapActions, mapState } from 'vuex'
import dataHelper from "../DataHelper.js";
export default {
  name: "my-info",
  components: { VueCropper },
  data() {
    return {
      username: '',
      avatarUrl: '',
      avatarLocalPath: '',
      avatarEditModal: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user
    })
  },
  created() {
    this.avatarUrl = this.userInfo.avatar
    this.username = this.userInfo.username
  },
  methods: {
    ...mapActions('user', ['handleEditUserInfo']),
    handleFormatError() {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleMaxSize() {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      });
    },
    handleBeforeUpload() {
      // const check = this.uploadList.length < 5;
      // if (!check) {
      //   this.$Notice.warning({
      //     title: 'Up to five pictures can be uploaded.'
      //   });
      // }
      // return check;
    },
    handleSuccess(res) {
      console.log(res)
      // this.handleEditUserInfo({username:this.username, avatar: res.data.fileUrl})
      this.avatar = res.data.fileUrl
    },
    OpenAvatar(value) {
      console.log(value.target.files[0].path)
      this.avatarLocalPath = value.target.files[0].path
      document.getElementById('open_avatar').value = ''
      this.avatarEditModal = true
    },
    getAvatar() {
      this.$refs.cropper.getCropData((data) => {
        // do something
        this.avatarUrl = data
      })
    },
    async updateUserInfo() {
      if (this.avatarUrl === this.userInfo.avatar) {
        await dataHelper.postData(this, 'api/user/user_name', { user_email: this.userInfo.email, user_name: this.username }, (result) => {
          console.log(result)
          this.handleEditUserInfo({ username: this.username, avatar: this.userInfo.avatar })
        })
        return
      }
      dataHelper.postData(this, 'api/user/user_name', { user_email: this.userInfo.email, user_name: this.username }, (result) => {
        console.log(result)
        this.handleEditUserInfo({ username: this.username, avatar: this.userInfo.avatar })
      })
      dataHelper.postData(this, 'api/user/avatar', { avatar: this.avatarUrl, user_email: this.userInfo.email }, (result) => {
        console.log(result)
        this.handleEditUserInfo({ username: this.username, avatar: result.fileUrl })
      })
    }
  }
};
</script>

<style>
#avatar_div {
  float: left;
  /* width: 100px;
  height: 100px;
  border-radius: 100px;
  background-color: rgb(184, 184, 184); */
}
#avatar_editor {
  width: 500px;
  height: 500px;
}
#avater_cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100px;
  height: 100px;
  border-radius: 100px;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
}
#avatar_div:hover #avater_cover {
  display: flex;
}
#userinfo_username {
  width: 20%;
}
</style>
