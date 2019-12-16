import axios from 'axios';
import { Toast } from 'vant';
import router from '../router/index'
import store from '../store/index'

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:8360',   //根据自己配置的反向代理去设置不同环境的baeUrl
  timeout: 10000,
})

// 文档中的统一设置post请求头。下面会说到post请求的几种'Content-Type'
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// 展示信息
const tip = msg => {
  Toast({
    message: msg,
    duration: 1000,
    forbidClick: true,
  })
}

// 跳转登录
const toLogin = () => {
  router.replace({
    path: '/',
    query: {
      redirect: router.currentRoute
    }
  })
}

// 错误处理
const errorHandle = (status, other) => {
  // 判断code
  switch (status) {
    // 401未登录
    case 401:
      tip('请先登录~');
      setTimeout(() => {
        toLogin();
      }, 1000);
      break;
    // 403 token过期
    case 403:
      tip('登录过期，请重新登录~');
      sessionStorage.removeItem('token');
      // 处理store
      setTimeout(() => {
        toLogin();
      }, 1000);
      break;
    case 404:
      tip('404 Not Found');
      break;
    default:
      console.log(other);
  }
}

let count = 0; // 请求数量
let withLoading = true

function hideLoading() {
  if(!withLoading || --count) {
    return;
  }
  Toast.clear();
}

instance.interceptors.request.use(
  config => {
    // 在请求里取store，防止取不到
    const uid = store.getters['user/phoneNum'];
    const storeId = store.getters['user/storeId'];
    config.headers = {
      ...config.headers,
      uid: uid || '',
      token: sessionStorage.getItem('token') || '',
      storeId
    }

    if(config.method === 'get') {
      ({ withLoading = true } = config.params.config);
      delete config.params.config;
    } else if(['post', 'delete', 'put'].includes(config.method)) {
      ({ withLoading = true } = config.data.config);
      delete config.data.config;
    }

    if(withLoading) {
      count ++;
      Toast.loading({
        message: 'loading..',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
    }
    return config;
  },
  error => {
    Toast.clear();
    Promise.error(error);
  }
)

instance.interceptors.response.use(
  res => {
    hideLoading();
    return res;
  },
  error => {
    Toast.clear();
    const { response } = error;
    if(response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    } else {
      // 可能断网
      Toast.fail('请检查您的网络稍后重试！');
      return Promise.reject();
    }
  }
)

export default {
  post (url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      data.config = config
      instance.post(url, data)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        })
    })
  },

  get (url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      data.config = config
      instance.get(url, {
        params: data,
      }).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err);
      })
    })
  },

  delete (url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      data.config = config
      instance.delete(url, { data })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        })
    })
  },
  put (url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      data.config = config
      instance.put(url, data)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        })
    })
  },
}
