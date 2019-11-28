<template>
  <div class="login">
    <transition name="fade">
      <div class="login_cover" v-if="showCover">
        <img :src="coverImg">
      </div>
    </transition>
    <div class="login_container">
      <div class="login_wrapper">
        <div class="login_box" @click="changeImage(2)">
          <img :src="topImg" class="top-img">
          <div class="login_title">
            <span class="welcome">Welcome To ~ </span>
            <van-icon name="after-sale" color="red" size="35" info="99+" />
            <span class="name">Dialy Pay</span>
          </div>
          <div class="login_auth">
            <van-tabs v-model="activeTab" animated>
              <van-tab title="登录">
                <van-cell-group>
                  <van-field
                    v-model.trim="loginPhoneNum"
                    required
                    clearable
                    label="手机号"
                    placeholder="请输入手机号"
                    @click.stop="changeImage(0)"
                  />

                  <van-field
                    v-model.trim="code"
                    label="短信验证码"
                    placeholder="验证码"
                    required
                    @click.stop="changeImage(1)"
                    v-if="loginWay === 0"
                  >
                    <van-button slot="button" v-if="!countDown" size="small" type="primary" @click.stop="getCode">发送验证码</van-button>
                    <van-button 
                      slot="button"
                      size="small"
                      type="primary"
                      disabled
                      v-else>已发送{{countDown}}s</van-button>
                  </van-field>
                  <van-field
                    v-model="loginPassword"
                    type="password"
                    label="密码"
                    placeholder="请输入密码"
                    required
                    @click.stop="changeImage(1)"
                    v-if="loginWay === 1"
                  >
                  </van-field>
                  <van-field v-model.trim="imgCaptcha"
                    center
                    clearable
                    maxlength="4"
                    v-if="loginWay === 1"
                    placeholder="请输入验证码">
                  </van-field>
                  <img
                    src="http://127.0.0.1:8360/captcha"
                    alt="captcha"
                    @click.prevent="getCaptcha"
                    ref="imgCaptcha"
                    class="login_captcha"
                    v-if="loginWay === 1"
                  />
                </van-cell-group>
                <van-button type="info" class="login_btn" @click.stop="onLogin">登录</van-button>
                <div class="login_way" @click="toggleLoginWay">{{loginWay === 0 ? '账号密码登录' : '短信验证码登录'}}</div>
              </van-tab>
              <van-tab title="注册">
                <van-cell-group>
                  <van-field
                    v-model.trim="phoneNum"
                    required
                    clearable
                    label="手机号"
                    placeholder="请输入手机号"
                    @click.stop="changeImage(0)"
                  />

                  <van-field
                    v-model="password"
                    type="password"
                    label="密码"
                    placeholder="不少于6位密码"
                    @click.stop="changeImage(1)"
                    required
                  />
                </van-cell-group>
                <van-button type="info" class="login_btn" @click.stop="onRegister">注册</van-button>
              </van-tab>
            </van-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { apiUrl } from '@/service/api'
// @ is an alias to /src
export default {
  name: 'login',
  data() {
    return {
      coverImg: require('../assets/back.jpg'),
      topImg: require('../assets/A.png'),
      showCover: false,
      activeTab: 0,
      phoneNum: '', // 注册手机号
      code: '', // 输入的验证码
      imgCaptcha: '', // 输入的图片验证码
      loginWay: 0, // 代表验证码登录
      numCode: '', // 收到的手机验证码
      countDown: 0,
      password: '', // 注册password
      loginPassword: '', // 登录密码
      loginPhoneNum: '' // 登录账号
    }
  },

  mounted() {
    this.showCover = true
    setTimeout(() => {
      this.showCover = false
    }, 1000)
  },
  methods: {
    toggleLoginWay() {
      this.loginWay = this.loginWay ? 0 : 1;
    },
    // 获取图片验证码
    getCaptcha() {
      const captchaEle = this.$refs.imgCaptcha;
      this.$set(captchaEle, 'src', 'http://127.0.0.1:8360/captcha?time=' + new Date());
    },
    // 获取数字验证码
    getCode() {
      const { loginPhoneNum } = this
      const message = this.validatePhoneNum(loginPhoneNum)
      if(message) {
        this.$toast(message);
        return;
      }
      this.countDown = 60
      this.timer = setInterval(() => {
        this.countDown --;
        if(this.countDown === 0) {
          clearInterval(this.timer)
        }
      }, 1000);
      this.$get(apiUrl.login, { phoneNum: loginPhoneNum }).then(
        res => {
          const { code } = res.data.data
          this.numCode = code
          Dialog.alert({
            title: '温馨提示',
            message: `验证码获取成功，请输入${this.numCode}`
          })
        }
      )
    },
    // 切换头图
    changeImage(index) {
      if(index === 0) {
        this.topImg = require('../assets/C.png')
      } else if (index === 1) {
        this.topImg = require('../assets/B.png')
      } else {
        this.topImg = require('../assets/A.png')
      }
    },
    validatePhoneNum(phoneNum) {
      if(phoneNum.length < 1) {
        return '请先填写手机号';
      }
      if(!/^1[345678][0-9]{9}$/.test(phoneNum)) {
        return '请输入有效的手机号';
      }
      return false;
    },
    validatePassword(password) {
      if(password.length < 1) {
        return '密码不能为空';
      }
      if(password.length < 6) {
        return '密码不能小于6位';
      }
      return false;
    },
    onRegister() {
      const { phoneNum, password } = this
      const message = this.validatePhoneNum(phoneNum)
      if(message) {
        this.$toast(message);
        return;
      }
      const message1 = this.validatePassword(password)
      if(message1) {
        this.$toast(message1);
        return;
      }
      this.$post(apiUrl.register, {
        phoneNum,
        password
      }).then(res => {
        if(res.status === 201) {
          this.$toast.fail('手机号已注册');
          return;
        }
        if(res.status === 200) {
          const { token } = res.data.data
          sessionStorage.setItem('token', token);
          this.$store.commit('user/setProps', {
            props: {
              phoneNum,
              password,
            }
          })
          this.showToast('注册成功！');
        }
      })
    },
    onLogin() {
      const { loginPhoneNum } = this;
      const msg = this.validatePhoneNum(loginPhoneNum);
      if(msg) {
        this.$toast(msg);
        return;
      }
      // 验证码登录
      if(this.loginWay === 0) {
        if(!this.code) {
          this.$toast('请输入验证码');
          return;
        }
        if(this.code && this.numCode !== this.code) {
          this.$toast.fail('验证码错误');
          return;
        }
        this.$post(apiUrl.login, { phoneNum: loginPhoneNum, byCode: true })
          .then(res => {
            const { token, phoneNum } = res.data.data;
            sessionStorage.setItem('token', token);
            this.$store.commit('user/setProp', {
              prop: 'phoneNum',
              value: phoneNum
            });
            this.showToast('登录成功！');
          })
      } else {
        // 密码登录
        const { loginPassword, imgCaptcha } = this;
        const message = this.validatePassword(loginPassword);
        if(message) {
          this.$toast(message);
          return;
        }
        if(!imgCaptcha) {
          this.$toast('请输入验证码');
          return;
        }
        this.$post(apiUrl.login, 
          {
            phoneNum: loginPhoneNum,
            password: loginPassword,
            imgCaptcha
          }
        ).then(res => {
          if(res.data.errno === 1000) {
            this.$toast.fail(res.data.errmsg);
            return;
          }
          const {
            avatar,
            nickName,
            phoneNum,
            sign,
            password,
            token,
          } = res.data.data;
          sessionStorage.setItem('token', token);
          this.$store.commit('user/setProps', {
            props: {
              avatar,
              nickName,
              phoneNum,
              sign,
              password,
            }
          });
          this.showToast('登录成功！');
        })
      }
    },
    showToast(message) {
      Toast({
        type: 'success',
        duration: 500,
        message,
        onClose: () => {
          this.$router.push('/home');
        }
      });
    },
  }
}
</script>

<style lang="less">
.login {
  .px2vw(font-size, 40);
  .login_cover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .login_container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background: @pink;
    z-index: 9;

    .login_wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: .9;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
      .px2vw(padding, 120, 40);
      box-sizing: border-box;

      .login_box {
        position: relative;
        background: #fff;
        .px2vw(border-radius, 8);
        .px2vw(padding, 80, 30);
        box-sizing: border-box;
        width: 100%;
        height: 100%;

        .top-img {
          position: absolute;
          left: 50%;
          .px2vw(top, 0);
          .px2vw(width, 150);
          z-index: 1;
          transform: translate(-50%, -50%);
        }

        .login_title {
          text-align: center;
          .px2vw(margin-top, 10);

          .name {
            color: @red;
          }
        }

        .login_auth {
          .px2vw(margin-top, 20);

          .login_btn {
            .px2vw(margin-top, 30);
            width: 100%;
          }

          .login_way {
            .px2vw(margin-top, 20);
            .px2vw(font-size, 30);
          }

          .login_captcha {
            position: absolute;
            bottom: 0;
            right: 0;
            .px2vw(width, 200);
            .px2vw(height, 100);
            .px2vw(line-height, 100);
          }
        }
      }
    }
  }
}
</style>
