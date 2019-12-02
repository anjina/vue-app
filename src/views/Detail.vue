<template>
  <div class="detail">
    <nav-bar title="My" :needAvatar="false"></nav-bar>
    <div class="detail_container">
      <info-row prop="头像">
        <div slot="content" class="avatar">
          <img :src="avatar" v-if="avatar">
          <img :src="avatarD" v-else>
        </div>
      </info-row>
      <info-row prop="昵称" :value="nickName"></info-row>
      <info-row prop="签名" :value="sign"></info-row>
      <info-row prop="💕💕💕" :value="phoneNum"></info-row>
      <info-row prop="手机号" :value="phoneNum"></info-row>
      <info-row prop="密码" value="******"></info-row>
    </div>
    <div class="footer" @click.stop="onSignOut">Sign Out</div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import InfoRow from '@/components/UserInfoRow'
import { mapGetters } from 'vuex'
import { Toast } from 'vant'
export default {
  components: {
    NavBar,
    InfoRow,
  },
  computed: {
    ...mapGetters({
      avatar: 'user/avatar',
      nickName: 'user/nickName',
      sign: 'user/sign',
      phoneNum: 'user/phoneNum',
      lover: 'user/lover',
      password: 'user/password',
    })
  },
  data() {
    return {
      avatarD: require('../assets/avatar.png'),
    }
  },
  methods: {
    onSignOut() {
      if(sessionStorage.getItem('token')) {
        sessionStorage.removeItem('token');
      }
      window.mySocket.handleClose();
      Toast({
        message: 'Welcome Back Again💛~',
        duration: 1000,
      })
      setTimeout(() => {
        this.$router.push('/login');
      }, 1000);
    },
  },
}
</script>

<style lang="less">
  .detail {
    height: 100vh;
    background: #fff;
    .detail_container {
      .avatar {
        position: relative;
        .px2vw(width, 100);
        .px2vw(height, 100);
        overflow: hidden;

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          border-radius: 50%;
        }
      }
    }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 1;
      box-sizing: border-box;
      width: 100%;
      .px2vw(height, 100);
      .px2vw(line-height, 100);
      text-align: center;
      color: #fff;
      background: rgb(105, 105, 105);
    }
  }
</style>