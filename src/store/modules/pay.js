const state = {
  newRecord: null,
  editedRecord: null,
  editingRecord: null,
}

const getters = {
  newRecord: state => state.newRecord,
  editedRecord: state => state.editedRecord,
  editingRecord: state => state.editingRecord,
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