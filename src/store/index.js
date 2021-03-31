import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

// 盘点货物随机抽取
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state,
  mutations,
  /* state: {

  },
  mutations: {

  }, */
  actions: {

  },
  getters
})
