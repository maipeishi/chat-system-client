import io from 'socket.io-client/dist/socket.io.js'
import { resolve } from 'dns';
import config from '../../../Config.json'
import store from '../store'
// let socket = {};
var socket = io('http://47.107.155.139:8360')
export function Connect() {
  // const socketconn = io('http://47.107.155.139:8360')
  // socket.on('opend', (data) => {
  //   console.log(data)
  //   const socketId = socket.id
  //   console.log(socketId)
  // })
  // store.dispatch('socket/handleConnect',{socket})
  // socket = socketconn  // 下面的方法有得用
  return socket
}
// 接收验证信息
export function getVerify() {
  // console.log('aaa')
  // console.log(socket)
  socket.on('getVerify', (data) => {
    console.log(data)
    store.dispatch('socket/handleGetMessage', { data })
  })
}
// 接收是否同意加好友(发送的验证信息是否通过)
export function getVerifyResult() {
  socket.on('addFriendResult', (data) => {
    console.log(data)
    data.type === 3 ? store.dispatch('socket/handleChangeType', { data }) : store.dispatch('socket/handleGetMessage', { data })
    addFriend(data)
  })
}
// 接收是否同意加入群(发送的验证信息是否通过) 来得了这里的都是同意
export function addGroupResult() {
  socket.on('addGroupResult', (data) => {
    console.log(data)
    data.type === 4 ? store.dispatch('socket/handleChangeType', { data }) : store.dispatch('socket/handleGetMessage', { data })
    data.type === 4 ? '' : addGroup(data)
  })
}
// 邀请好友进群已被同意
export function inviteResult() {
  // return new Promise((resolve, reject) => {
    socket.on('inviteResult', (data) => {
      console.log(data)
      if(data.type === 6) { 
        store.dispatch('socket/handleChangeType', { data })
        if(data.group.leader !== store.state.user.email) {
          addGroup({ group: {avatar:null,group_id:data.group.id,group_name:data.group.name,leader:data.group.leader}})
        }
      }
      data.type === 5 ? store.dispatch('socket/handleGetMessage', { data }) : ''
      // return resolve(data)
      if(data.type === 7) {
        store.dispatch('socket/handleGetMessage', { data })
        const setObject = Object.assign({},{user_name:data.userB.user_name},{user_email:data.userB.friend_email})
        store.dispatch('socket/handleAddSelectedGroupMembers',{data:[setObject],type:'join'})
      }
    })
  // })
}
// 聊天
export function chat() {
  socket.on('message',(data) => {
    // 存入vuex
    store.dispatch('socket/handleSetChatMessage',{data})
    // if(data.sendObj.data[0].file) {
    //   // 读取json
    //   const filePath = config['filePath']
    //   const is = fs.createReadStream(data.file.path);
    //   const os = fs.createWriteStream(think.ROOT_PATH + '/file/' + user_email + '/' + file.name);
    //   is.pipe(os);
    // }
  })
}
// 解散群
export function removeGroup() {
  socket.on('removeGroup',(data) => {
    console.log(data)
    store.dispatch('user/handleLeaveGroup',{group:data.group.id})
    data = Object.assign({},{fromUser:data.fromUser},{data:`解散群${data.group.name}(${data.group.id})`},{type:0})
    store.dispatch('socket/handleGetMessage',{data})
  })
}

// 好友列表，放入store，要放数组
function addFriend(data) {
  const friend = Object.assign({}, { avatar: data.fromUser.avatar }, { friend_email: data.fromUser.email }, { user_name: data.fromUser.username })
  console.log('新增的好友')
  console.log([friend])
  // 好友列表，放入store，要放数组
  store.dispatch('user/handleAddFriend', { friend: [friend] })
}
// 群组列表，放入store，要放数组
function addGroup(data) {
  const group = Object.assign({}, { avatar: data.group.avatar }, { group_id: data.group.group_id }, { group_name: data.group.group_name }, {leader: data.group.leader})
  console.log('加入群组')
  console.log([group])
  store.dispatch('user/handleAddGroup', { group: [group] })
}
export default {
  Connect,
  getVerify,
  // addFriendResult,
  getVerifyResult,
  addGroupResult,
  inviteResult,
  chat,
  removeGroup,
}

// 接收socket的信息