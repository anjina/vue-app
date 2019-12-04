const state = {
  IMGPATH: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8360' : '',
  AVATARD: require('../../assets/avatar.png'),
  LOVERD: require('../../assets/loverD.png'),    
}
  
const getters = {
  IMGPATH: state => state.IMGPATH,
  AVATARD: state => state.AVATARD,
  LOVERD: state => state.LOVERD,
}

const actions = {
}

const mutations = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}