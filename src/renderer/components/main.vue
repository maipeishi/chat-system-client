<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Sider
        :width="250"
        v-model="isCollapsed"
        :style="{ height: (clientHeinght+100)+'px', overflow: 'auto'}"
      >
        <div id="avatar-box">
          <mu-avatar v-if="avatar" :size="100">
            <img :src="avatar" :title="this.$store.state.user.avatar">
          </mu-avatar>
          <mu-avatar v-else :size="100">
            <img src="../assets/_ionicons_svg_ios-person.svg">
          </mu-avatar>
        </div>
        <p id="username">欢迎，{{this.$store.state.user.username}}</p>
        <Menu
          @on-select="selectFriend($event)"
          @on-open-change="getFriends($event)"
          theme="dark"
          width="auto"
        >
          <Submenu name="1">
            <template slot="title">
              <Icon type="md-people"/>我的好友
            </template>
            <MenuItem v-for="(item,index) in friendList" :key="item.friend_email" :name="'1'+index">
            <div class="friend-list">
              <Avatar v-if="item.avatar" :src="item.avatar" size="large"></Avatar>
              <Avatar v-else icon="ios-person" size="large"></Avatar>
              <div style="margin-left:10px;">
                <Row>{{item.friend_email}}</Row>
                <Row>{{item.user_name}}</Row>
              </div>
            </div>
            </MenuItem>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              <Icon type="ios-people"/>我的群组
            </template>
            <MenuItem v-for="(item,index) in groupList" :key="item.group_id" :name="'2'+index">
              <Row>{{item.group_name}}</Row>
              <Row>{{item.group_id}}</Row>
            </MenuItem>
          </Submenu>
          <MenuItem name="3-0" to="/myInfo/">个人资料</MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
          <Head
            :Selected="showChatWindow === 'friend' ? friendSelected : groupSelected "
            :socket="socket"
            :showChatWindow="showChatWindow"
          ></Head>
        </Header>
        <Content :style="{padding: '16px 16px 16px'}">
          <Card v-if="$route.name!=='my-info-page'" :style="{height: clientHeinght+'px'}">
            <ChatWindowSider
              :socket="socket"
              v-if="showChatWindow === 'group'"
              :clientHeinght="clientHeinght"
              :groupSelected="groupSelected"
            ></ChatWindowSider>
            <ChatWindow
              v-show="showChatWindow !== ''"
              :showChatWindow="showChatWindow"
              :socket="socket"
              :friendSelected="friendSelected"
              :groupSelected="groupSelected"
            ></ChatWindow>
          </Card>
          <router-view v-else/>
          {{ro}}
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import ChatWindow from './ChatWindow.vue'
import ChatWindowSider from './ChatWindowSider.vue'
import Head from './Header.vue'
import dataHelper from "./DataHelper.js";
import { getConnection, getVerify, getVerifyResult, addGroupResult, inviteResult, chat, removeGroup } from './Socket.js'
export default {
  name: 'main-page',
  components: {
    ChatWindow,
    Head,
    ChatWindowSider,
  },
  data() {
    return {
      isCollapsed: false,
      clientHeinght: window.innerHeight - 100,


      friendSelected: {
        email: '',
        name: '',
        avatar: '',
      },
      groupSelected: {
        id: '',
        name: '',
        leader: '',
      },

      socket: {},
      // friend || group
      showChatWindow: '',

    };
  },
  computed: {
    ro: function () {
      console.log(this.$route)
    },
    ...mapState({
      userid: state => state.user.userid,
      username: state => state.user.username,
      email: state => state.user.email,
      avatar: state => state.user.avatar,
      friendList: state => state.user.friendList,
      groupList: state => state.user.groupList,
    }),
    // avatar: function() {
    //   console.log('bb')
    //   const temp = this.$store.state.user.avatar
    //   const avatarUrl = temp.substr(0,temp.indexOf(',')) || ''
    //   console.log(temp)
    //   return avatarUrl
    // }
  },
  created() {
    window.addEventListener('resize', () => {
      // console.log(window.innerHeight)
      this.clientHeinght = window.innerHeight - 100
    })
    dataHelper.postData(this, "api/auth/getUser", {}, res => {
      console.log(res);
      if (res.user_email) {
        var email = { email: res.user_email }
        var id = { id: res.id }
        var avatar = { avatar: res.avatar }
        var username = { username: res.user_name }
        var token = { token: '' }
        this.handleLogin({ username, email, id, avatar, token });

        // this.$router.push({
        //   name: "main-page",
        // });
      }
      else {
        this.$router.push({
          name: 'login-page'
        })
      }
    });
  },
  methods: {
    // ...mapActions('socket',['handleConnect']),
    ...mapActions('user', ['handleAddFriend', 'handleAddGroup', 'handleInit', 'handleLogin']),
    getFriends(value) {
      this.handleInit()
      if (value[0] === '1') {
        //关闭
        dataHelper.postData(this, "api/friends/getFriends", { email: this.email }, (result) => { // email: this.email
          console.log('好友列表')
          console.log(result)
          // 放入store
          this.handleAddFriend({ friend: result })
        })
      }
      if (value.includes('2')) {
        //关闭
        dataHelper.postData(this, "api/group/getGroup", { email: this.email }, (result) => { // email: this.email
          console.log('群组列表')
          console.log(result)
          // 放入store
          this.handleAddGroup({ group: result })
        })
      }
    },
    selectFriend(name) {
      const [type, ...index] = name
      console.log(type)
      if (type === '1') {
        this.showFriendChatWindow(Number.parseInt(index))
      }
      if (type === '2') {
        this.showGroupChatWindow(Number.parseInt(index))
      }
      // const pushToRouter = { socket: this.socket, clientHeinght: this.clientHeinght, friendSelected: this.friendSelected, groupSelected: this.groupSelected, showChatWindow: this.showChatWindow }
      this.$router.replace({
        path: '/main/',
        // params: pushToRouter,
      })
    },
    showFriendChatWindow(index) {
      console.log(this.friendList[index])
      const friend_email = this.friendList[index].friend_email;
      console.log(friend_email)
      this.friendSelected.email = friend_email
      this.friendSelected.name = this.friendList[index].user_name
      this.friendSelected.avatar = this.friendList[index].avatar
      this.showChatWindow = 'friend'
    },
    showGroupChatWindow(index) {
      this.groupMembersData = []
      const group_name = this.groupList[index].group_name;
      console.log(group_name)
      this.groupSelected.id = this.groupList[index].group_id
      this.groupSelected.leader = this.groupList[index].leader
      this.groupSelected.name = group_name


      this.showChatWindow = 'group'
    }
  },
  mounted() {
    this.socket = getConnection()
    // this.$store.dispatch('socket/handleConnect',{socket:this.socket})
  },
};

// 接收到好友请求
getVerify()
getVerifyResult()
// addFriendResult()
addGroupResult()
inviteResult()
chat()
removeGroup()
</script>
<style>
#avatar-box {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
#username {
  color: azure;
  text-align: center;
}
.friend-list{
  display: flex;
  flex-direction: row
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>