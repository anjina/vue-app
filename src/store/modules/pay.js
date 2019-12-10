const state = {
  newRecord: null
}

const getters = {
  newRecord: state => state.newRecord,
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