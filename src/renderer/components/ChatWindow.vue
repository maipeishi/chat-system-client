<template>
  <div class="demo-split" :style="{height: clientHeinght+'px', width: chatWindowWidth}">
    <Split v-model="split2" mode="vertical" @on-moving="SplitMoving($event)">
      <div slot="top" class="demo-split-pane" id="top">
        <Scroll :height="scrollHeight">
          <!-- friendSelected.email -->
          <div
            v-for="items in chatMessage"
            v-if="showChatWindow === 'friend' ? items.id === friendSelected.email : items.id === groupSelected.id"
            :key="items.id"
          >
            <Row class="row" v-for="(item,index) in items.data" :key="index">
              <div
                :style="{float:item.fromUser.email === friendSelected.email ? 'left' : 'right'}"
              >
                <Avatar
                  v-if="item.fromUser.avatar"
                  :src="item.fromUser.avatar"
                  size="large"
                  :style="{float:item.fromUser.email === friendSelected.email ? 'left' : 'right'}"
                />
                <Avatar
                  v-else
                  icon="ios-person"
                  size="large"
                  :style="{float:item.fromUser.email === friendSelected.email ? 'left' : 'right'}"
                />
                <div
                  class="chat-content"
                  :style="{margin:item.fromUser.email === friendSelected.email ? '0px 0px 0px 50px' : '0px 50px 0px 0px'}"
                >
                  <div style="float:right">
                    <span
                      :style="{float:item.fromUser.email === friendSelected.email ? 'left' : 'right'}"
                    >{{item.fromUser.username}}</span>
                  </div>
                  <div class="chat-detail" v-html="item.data">{{item.data}}</div>
                </div>
              </div>
            </Row>
          </div>
        </Scroll>
      </div>
      <div slot="bottom" class="demo-split-pane">
        <div id="toolbar" class="toolbar"></div>
        <div id="text" :style="{ height: textHeight+'px' }">
          <!--可使用 min-height 实现编辑区域自动增加高度-->
        </div>
        <Button type="info" class="sendButton" @click="Send">发送</Button>
        <!-- <Upload
          :before-upload="handleUpload"
          class="sendButton"
          name="file"
          action="//47.107.155.139:8360/api/upload/file"
        >
          <Button icon="ios-cloud-upload-outline">选择上传文件</Button>
        </Upload>
        <div v-if="file !== null">
          上传文件: {{ file.name }}
          <Button :class="{disabled:fileStatus}"
            type="text"
            @click="upload"
            :loading="loadingStatus"
          >{{ loadingStatus ? '正在上传' : fileStatus?`已上传文件`:'点击上传' }}</Button>
        </div> -->
      </div>
    </Split>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import axios from 'axios'
import Editor from "wangeditor";
import "wangeditor/release/wangEditor.min.css";
import { chat } from './Socket.js'
import dataHelper from './DataHelper.js';
axios.defaults.withCredentials = true
export default {
  name: "chat-window",
  props: {
    socket: {},
    showChatWindow: '',
    groupSelected: {},
    friendSelected: {},
  },
  computed: {
    chatWindowWidth() {
      return this.showChatWindow === 'friend' ? '100%' : '80%'
    },
    ...mapState({
      chatMessage: state => state.socket.chatMessage,
    }),
  },
  data() {
    return {
      split2: 0.5,
      clientHeinght: window.innerHeight - 150,
      textHeight: 200,
      editor: '',
      scrollHeight: 500,
      chatFloat: 'left',
      file: null,
      loadingStatus: false,
      // fileNum: 0,
      fileStatus: false,
    };
  },
  mounted() {
    this.editor = new Editor(`#toolbar`, `#text`);
    this.editor.customConfig.debug = true
    this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
    // this.editor.customConfig.uploadImgServer = 'http://47.107.155.139:8360/api/upload/pic'  // 上传图片到服务器
    this.editor.customConfig.showLinkImg = false
    this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024
    this.editor.customConfig.uploadImgMaxLength = 1
    this.editor.customConfig.uploadImgParamsWithUrl = true
    // this.editor.customConfig.pasteIgnoreImg = true
    // this.editor.customConfig.uploadFileName = 'file';
    this.editor.customConfig.menus = [
      'head',
      'bold',
      'italic',
      'underline',
      'fontSize',  // 字号
      'fontName',  // 字体
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'emoticon',  // 表情
      'image',  // 插入图片
    ]
    this.editor.create();
    this.textHeight = this.clientHeinght / 2 - 80;
  },
  created() {
    window.addEventListener("resize", () => {
      // console.log(window.innerHeight)
      this.clientHeinght = window.innerHeight - 150;
      const aa = document.getElementsByClassName("bottom-pane");
      this.textHeight = aa[0].clientHeight - 80;

      const scrollElement = document.getElementsByClassName('top-pane')
      this.scrollHeight = scrollElement[0].clientHeight - 20
    });
    // 读取聊天记录？
  },
  methods: {
    SplitMoving(event) {
      const aa = document.getElementsByClassName("bottom-pane");
      this.textHeight = aa[0].clientHeight - 80;

      const scrollElement = document.getElementsByClassName('top-pane')
      this.scrollHeight = scrollElement[0].clientHeight - 20
    },
    findImg(data) {
      if (data.includes('style="max-width:100%;"') === -1) {
        return data
      }
      const index = data.indexOf('style="max-width:100%;"')
      console.log(index)
      if (data.substr(index + 23, 1) === '>') {
        let substrData = data.substr(index + 23)
        substrData = data.substr(0, index) + 'style="max-width:50%;"' + this.findImg(substrData)
        return substrData
      }
      return data
    },
    Send() {
      //获取编辑器的html(有css)
      let chatData = this.editor.txt.html()
      chatData = this.findImg(chatData)

      // const pIndex = chatData.indexOf('<p>')
      // if (pIndex !== -1) {
      //   chatData = chatData.substr(0, pIndex + 2) + ' style="width:50%;"' + chatData.substr(pIndex + 2)
      // }

      const date = new Date()
      const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      const timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

      // 发送信息到socket服务器
      const sendTo = this.showChatWindow === 'friend' ? { toUser: this.friendSelected } : { toGroup: this.groupSelected }
      this.socket.emit("chat", { fromUser: this.$store.state.user, sendTo, data: chatData, date: dateStr, time: timeStr, file: this.file });
      console.log(chatData)
      this.file = null
      this.fileStatus = false
      this.editor.txt.clear()
      // this.fileNum = 0
    },
    handleUpload(file) {
      this.file = file;
      return false;
    },
    upload() {
      this.loadingStatus = true;
      console.log(this.file)
      const formData = new FormData()
      formData.append('name', 'file')
      formData.append('file', this.file)
      const th = this
      axios.post('http://47.107.155.139:8360/api/upload/file', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((result) => {
        console.log(result)
        th.loadingStatus = false
        th.fileStatus = true
        // th.fileNum += 1
        th.$Message.success('Success')
      })
      // setTimeout(() => {
      //   this.file = null;
      //   this.loadingStatus = false;
      //   this.$Message.success('Success')
      // }, 1500);
    }
  }
};
</script>

<style>
.demo-split {
  height: 200px;
  border: 1px solid #dcdee2;
}
.demo-split-pane {
  padding: 10px;
}
#hide {
  display: none;
}
.sendButton {
  float: right;
}
.chat-content {
  margin-left: 50px;
  display: flex;
  flex-direction: column;
}
.chat-detail {
  background-color: rgba(211, 237, 251, 0.582);
  border-radius: 10px;
  float: left;
  padding: 10px;
  margin-top: 5px;
}
.row {
  margin-top: 10px;
}
</style>
