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
          <img :src="topImg">
          <div class="login_title">
            <span class="welcome">Welcome To ~ </span>
            <van-icon name="after-sale" color="red" size="35" info="99+" />
            <span class="name">Dialy Pay</span>
          </div>
          <div class="login_auth">
            <van-tabs v-model="activeTab">
              <van-tab title="登录">
                <van-cell-group>
                  <van-field
                    v-model="phoneNum"
                    required
                    clearable
                    label="手机号"
                    placeholder="请输入手机号"
                    @click.stop="changeImage(0)"
                  />

                  <van-field
                    v-model="code"
                    type="password"
                    label="短信验证码"
                    placeholder="验证码"
                    required
                    v-if="loginWay === 0"
                  >
                    <van-button slot="button" v-if="!countDown" size="small" type="primary" @click.stop="getCode">发送验证码</van-button>
                    <van-button 
                      slot="button"
                      size="small"
                      type="primary"
                      disabled=""
                      v-model="smsCaptcha"
                      v-else>已发送{{countDown}}s</van-button>
                  </van-field>
                  <van-field
                    v-model="code"
                    type="password"
                    label="密码"
                    placeholder="请输入密码"
                    required
                    @click.stop="changeImage(1)"
                    v-if="loginWay === 1"
                  >
                  </van-field>
                  <van-field v-model="imgCaptcha"
                    center
                    clearable
                    maxlength="4"
                    v-if="loginWay === 1"
                    placeholder="请输入验证码">
                    <img
                      src="http://demo.itlike.com/web/xlmc/api/captcha"
                      alt="captcha"
                      @click.prevent="getCaptcha"
                      ref="imgCaptcha"
                      class="login_captcha"
                      slot="button">
                  </van-field>
                </van-cell-group>
                <van-button type="info" class="login_btn">登录</van-button>
                <div class="login_way" @click="toggleLoginWay">{{loginWay === 0 ? '账号密码登录' : '短信验证码登录'}}</div>
              </van-tab>
              <van-tab title="注册">
                <van-cell-group>
                  <van-field
                    v-model="phoneNum"
                    required
                    clearable
                    label="手机号"
                    placeholder="请输入手机号"
                  />

                  <van-field
                    v-model="code"
                    type="password"
                    label="密码"
                    placeholder="不少于6位密码"
                    required
                  />
                </van-cell-group>
                <van-button type="info" class="login_btn">注册</van-button>
              </van-tab>
            </van-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'
// @ is an alias to /src
export default {
  name: 'login',
  components: {
  },
  data() {
    return {
      coverImg: require('../assets/back.jpg'),
      topImg: require('../assets/A.png'),
      showCover: false,
      activeTab: 0,
      phoneNum: '',
      code: '',
      loginWay: 0, // 代表验证码登录
      imgCaptcha: '', // 图片验证码
      numCode: '', // 手机验证码
      countDown: 0,
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
      this.loginWay = this.loginWay ? 0 : 1
    },
    // 获取图片验证码
    getCaptcha() {
      const captchaEle = this.$refs.imgCaptcha;
      this.$set(captchaEle, 'src', 'http://demo.itlike.com/web/xlmc/api/captcha?time=' + new Date())
    },
    // 获取数字验证码
    getCode() {
      this.countDown = 60
      this.timer = setInterval(() => {
        this.countDown --;
        if(this.countDown === 0) {
          clearInterval(this.timer)
        }
      }, 1000);
      this.numCode = 123456
      Dialog.alert({
        title: '温馨提示',
        message: `验证码获取成功，请输入${this.numCode}`
      })
    },
    changeImage(index) {
      if(index === 0) {
        this.topImg = require('../assets/C.png')
      } else if (index === 1) {
        this.topImg = require('../assets/B.png')
      } else {
        this.topImg = require('../assets/A.png')
      }
    }
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

        img {
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
            right: 0;
            left: 50%;
            top: 30%;
            transform: translate(-50%, -50%);
            .px2vw(width, 280);
            .px2vw(height, 100);
            .px2vw(margin-left, 150);
          }
        }
      }
    }
  }
}
</style>
