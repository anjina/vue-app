import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import notify from './modules/notify.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    notify,
  }
})