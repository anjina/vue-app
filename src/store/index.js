import Vue from 'vue'
import Vuex from 'vuex'

const context = require.context('./modules', false, /\.js$/);

const modules = context.keys().reduce((current, next) => {
  const key = next.match(/^\.\/(\w+)\.js/)[1]
  current[key] = context(next).default;
  return current;
}, {})

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
})