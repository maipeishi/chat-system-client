const state = {
  // socket: '',
  verifyMessage: [],
  selectedGroupMembers: [],
  chatMessage: [],
  // chatMessage: [
  //   {
  //     id: '1641084984@qq.com',
  //     data: [
  //       {
  //         fromUser: { // 自己发的信息，对方发给自己的信息
  //           user_email: '',
  //           user_name: '',
  //           avatar: '',
  //         },
  //         data: {},
  //         date: '',
  //         time: '',
  //         isOnline: true || false,
  //       }
  //     ],
  //   }
  // ]
};

const mutations = {
  setSocket(state, socket) {
    state.socket = socket
  },
  setVerifyMessage(state, data) {
    console.log(data)
    if(state.verifyMessage.length >30) {
      state.verifyMessage = state.verifyMessage.splice(0,1)
    }
    state.verifyMessage.push(data)
  },
  setMessageType(state, data) {
    state.verifyMessage[data.index].type = data.type
  },
  setSelectedGroupMembers(state, data) {
    console.log(data)
    if (data.type === 'all')
      state.selectedGroupMembers = []
    state.selectedGroupMembers.push(...data.data)
  },
  setChatMessage(state, data) {
    // console.log(data)
    const index = state.chatMessage.findIndex((value, index, arr) => value.id === data.sendObj.id)
    console.log(index)
    if (index !== -1) {
      // state.chatMessage[index].data = []
      state.chatMessage[index].data.push(data.sendObj.data)
    }
    else {
      state.chatMessage.push({id:data.sendObj.id,data:[data.sendObj.data]})
      // state.chatMessage.push(data.sendObj)
    }
  }
};

const actions = {
  // 这里括号里面要和传入的参数一样
  handleConnect({ commit }, { socket }) {
    // do something async
    commit('setSocket', socket)
  },
  handleGetMessage({ commit }, { data }) {
    commit('setVerifyMessage', data)
  },
  handleChangeType({ commit }, { data }) {
    commit('setMessageType', data)
  },
  handleAddSelectedGroupMembers({ commit }, { data, type }) {
    console.log(data)
    console.log(type)
    commit('setSelectedGroupMembers', Object.assign({}, { data: data }, { type: type }))
  },
  handleSetChatMessage({ commit }, { data }) {
    commit('setChatMessage', data)
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
