import openSocket from 'socket.io-client';
import store from '../store/index';
import { Notify } from 'vant';

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
    this.socket.on('newMsg', () => {
      // 收到新消息
      store.commit('user/setProp', {
        prop: 'hasNewMsg',
        value: 1
      });
      Notify({
        message: '有新消息喔',
        color: '#ad0000',
        background: '#ffe1e1',
        duration: 1000,
      });
    })
  }

  handleClose() {
    this.socket.close();
  }

  startTalk(data) {
    this.socket.emit('talk', data);
  }
}

export function initSocket(id) {
  window.mySocket = new Socket('http://127.0.0.1:8360', id);
}