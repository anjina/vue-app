import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './service/axios'

Vue.prototype.$post = http.post
Vue.prototype.$get = http.get
Vue.prototype.$delete = http.delete
Vue.prototype.$put = http.put

Vue.filter('parseTime', (date) => {
  let duration = ((new Date().getTime() - new Date(date).getTime()) / 1000 / 60).toFixed(0) // 分钟
  if (duration <= 1) {
    return '刚刚'
  } else if (duration < 60) {
    return duration + '分钟前'
  } else if (duration < 60 * 24) {
    return (duration / 60).toFixed(0) + '小时前'
  } else if (duration < 60 * 24 * 2) {
    return '昨天 ' + date.substr(11, 5)
  } else if (duration < 60 * 24 * 365) {
    return date.substr(5, 11)
  } else {
    return date.slice(0, -3)
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
