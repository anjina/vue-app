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
      <info-row prop="昵称" :value="nickName" @edit="onEdit(0)"></info-row>
      <info-row prop="签名" :value="sign" @edit="onEdit(1)"></info-row>
      <info-row prop="💕💕💕" :value="phoneNum" @edit="onEdit(2)"></info-row>
      <info-row prop="手机号" :value="phoneNum" @edit="onEdit(3)"></info-row>
      <info-row prop="密码" value="******" @edit="onEdit(4)"></info-row>
    </div>
    <bottom-btn content="Sign Out" @confirm="onSignOut"></bottom-btn>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import BottomBtn from '@/components/BottomBtn'
import InfoRow from '@/components/UserInfoRow'
import { mapGetters } from 'vuex'
import { Toast } from 'vant'
export default {
  components: {
    NavBar,
    InfoRow,
    BottomBtn
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
    onEdit(type) {
      if(type === 2 || type === 3) {
        this.$toast('暂不支持修改哦~');
        return;
      }
      this.goEdit(type);
    },
    goEdit(type) {
      this.$router.push({
        path: '/edit',
        query: {
          type
        },
      });
    },
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
  }
</style>