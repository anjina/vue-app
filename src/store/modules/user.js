const state = {
  phoneNum: '',
  avatar: '',
  nickName: '',
  sign: '',
  password: '',
  token: sessionStorage.getItem('token')
}

const getters = {
  phoneNum: state => state.phoneNum,
  avatar: state => state.avatar,
  sign: state => state.sign,
  nickName: state => state.nickName,
  password: state => state.password,
  token: state => state.token,
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
    console.log(state.token)
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