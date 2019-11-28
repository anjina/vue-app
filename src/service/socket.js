import openSocket from 'socket.io-client';
import Vue from 'vue'
class Socket {
  constructor(url, data) {
    this.socket = openSocket(url, {
      path: '/socket.io',
      reconnection: true,
      query: {
        phoneNum: data
      }
    });
    // this.socket.emit('addUser', data);
    this.socket.on('opend', function(data) {
      console.log('opend:', data);
    });
    this.socket.on('count', function(data) {
      console.log(data);
    });
    this.socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    })
    this.socket.on('newMsg', (data) => {
      // 收到新消息
      console.log(data)
    })
  }

  handleClose() {
    this.socket.disconnect();
  }

  startTalk(data) {
    this.socket.emit('talk', data);
  }
}

export function initSocket(id) {
  const socket = new Socket('http://127.0.0.1:8360', id);
  // 挂载到全局对象
  Vue.prototype.$socket = socket;
}