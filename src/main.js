import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
import http from './service/axios'

Vue.use(Vant);

Vue.prototype.$post = http.post
Vue.prototype.$get = http.get
Vue.prototype.$delete = http.delete

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
