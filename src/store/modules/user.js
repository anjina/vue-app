const state = {
  phoneNum: null,
  avatar: null,
  nickName: null,
  sign: null,
  password: null,
  lover: null,
  token: sessionStorage.getItem('token'),
  hasNewMsg: 0,
  storeId: null,
}

const getters = {
  phoneNum: state => state.phoneNum,
  avatar: state => state.avatar,
  sign: state => state.sign,
  nickName: state => state.nickName,
  password: state => state.password,
  token: state => state.token,
  lover: state => state.lover,
  hasNewMsg: state => state.hasNewMsg,
  storeId: state => state.storeId,
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