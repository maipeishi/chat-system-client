const state = {
  email: '',
  username: '',
  userid: '',
  avatar: '',
  //验证字符
  token: '',
  friendList: [],
  groupList: []
};
// const getters = {
//   avatar: state => {
//     return state.avatar
//   }
// }

const mutations = {
  setAvatar (state, avatarPath) {
    state.avatar = avatarPath
  },
  setUserid (state, id) {
    state.userid = id
  },
  setUsername (state, name) {
    state.username = name
  },
  setEmail (state, name) {
    state.email = name
  },
  setToken (state, token) {
    state.token = token
  },
  setFriendList (state, friend) {
    // 增加
    state.friendList.push(...friend)
  },
  removeFriend (state, friend) {
    const index = state.friendList.findIndex((n) => n.friend_email === friend)
    state.friendList.splice(index,1)
  },
  setGroupList (state, group) {
    state.groupList.push(...group)
  },
  leaveGroup (state, group) {
    const index = state.groupList.findIndex((n) => n.group_id === group)
    state.groupList.splice(index,1)
  },
  initLists (state) {
    state.groupList = []
    state.friendList = []
  }
};

const actions = {
  // 这里括号里面要和传入的参数一样
  handleLogin({ commit },{username, email, id,avatar,token}) {
    // do something async
    commit('setToken', token.token)
    commit('setAvatar', avatar.avatar)
    commit('setUserid', id.id)
    commit('setEmail', email.email)
    commit('setUsername', username.username)
  },
  handleAddFriend({ commit },{friend}) {
    commit('setFriendList',friend)
  },
  handleAddGroup({ commit },{group}) {
    commit('setGroupList',group)
  },
  handleInit({ commit }) {
    commit('initLists')
  },
  handleEditUserInfo({commit},{username,avatar}) {
    commit('setAvatar', avatar)
    commit('setUsername', username)
  },
  handleRemoveFriend({commit},{friend}) {
    commit('removeFriend',friend)
  },
  handleLeaveGroup({commit},{group}) {
    commit('leaveGroup',group)
  },
};

export default {
  namespaced: true,
  state,
  // getters,
  mutations,
  actions,
};
