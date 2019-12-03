const state = {
  hasNewMsg: false,
  hasShowTip: false
}

const getters = {
  hasShowTip: state => state.hasShowTip,
  hasNewMsg: state => state.hasNewMsg,
}

const actions = {
}

const mutations = {
  setProp (state, {
    prop,
    value
  }) {
    state[prop] = value
  },

  setProps(state, { props }) {
    for(const [key, value] of Object.entries(props)) {
      state[key] = value
    }
  },

  getProp (state, {
    prop
  }) {
    return state[prop]
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}