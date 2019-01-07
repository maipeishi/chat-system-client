import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';
import user from './modules/User'
import socket from './modules/Socket'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    socket
  },
  strict: process.env.NODE_ENV !== 'production',
});
