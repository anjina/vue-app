import axios from 'axios';
import { Toast } from 'vant';
import router from '../router/index'

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:8360',   //根据自己配置的反向代理去设置不同环境的baeUrl
  headers: {
    token: sessionStorage.getItem('token') || ''
  },
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
    path: '/login',
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
      toLogin();
      break;
    // 403 token过期
    case 403:
      tip('登录过期，请重新登录');
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

let count = 0 // 请求数量

function hideLoading(request) {
  const { withLoading = true } = request

  if(!withLoading || --count) {
    return;
  }
  Toast.clear();
}

instance.interceptors.request.use(
  config => {
    const { withLoading = true } = config
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
    hideLoading({ withLoading: true });
    Promise.error(error);
  }
)

instance.interceptors.response.use(
  res => {
    hideLoading(res.config);
    return res;
  },
  error => {
    hideLoading({ withLoading: true });
    const { response } = error;
    console.log(response);
    if(response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.code, response.data.message);
      return Promise.reject(response);
    } else {
      // 可能断网
    }
  }
)

export default {
  post (url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      instance.post(url, data, config)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },

  get (url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      instance.get(url, {
        params: data
      }, config).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  },

  delete (url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
      instance.delete(url, { data }, config)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  }
}
