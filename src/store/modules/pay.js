const state = {
  newRecord: null,
  editedRecord: null,
}

const getters = {
  newRecord: state => state.newRecord,
  editedRecord: state => state.editedRecord,
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