import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "user" */ '../views/Login.vue')
  },
  {
    path: '/user',
    name: 'user',
    // route level code-splitting
    // this generates a separate chunk (user.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user" */ '../views/User.vue'),
    meta: {
      keepAlive: true,
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "user" */ '../views/Home.vue'),
    meta: {
      keepAlive: true,
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "user" */ '../views/Search.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import(/* webpackChunkName: "user" */ '../views/Detail.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/edit',
    name: 'edit',
    component: () => import(/* webpackChunkName: "user" */ '../views/EditUserInfo.vue')
  },
  {
    path: '/message',
    name: 'message',
    component: () => import(/* webpackChunkName: "user" */ '../views/Message.vue')
  },
  {
    path: '/label',
    name: 'label',
    component: () => import(/* webpackChunkName: "user" */ '../views/Label.vue')
  },
  {
    path: '/add',
    name: 'add',
    component: () => import(/* webpackChunkName: "user" */ '../views/Add.vue')
  },
  {
    path: '/images',
    name: 'images',
    component: () => import(/* webpackChunkName: "user" */ '../views/ImagePreview.vue')
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.name === 'login' || sessionStorage.getItem('token')) {
    next();
  } else {
    next('/');
  }
})

export default router
