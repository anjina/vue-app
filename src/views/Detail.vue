<template>
  <div class="detail">
    <nav-bar title="My" :needAvatar="false"></nav-bar>
    <div class="detail_container">
      <input type="file" ref="avatarFile" class="avatar-input" @change="onAvatarChange">
      <info-row prop="头像">
        <div slot="content" class="avatar">
          <img :src="avatar ? (IMGPATH + avatar) : AVATARD">
        </div>
      </info-row>
      <info-row prop="昵称" :value="nickName" @edit="onEdit(0)"></info-row>
      <info-row prop="签名" :value="sign" @edit="onEdit(1)"></info-row>
      <info-row prop="💕💕💕" :value="lover || '暂无'" @edit="onEdit(2)"></info-row>
      <info-row prop="手机号" :value="phoneNum" @edit="onEdit(3)"></info-row>
      <info-row prop="密码" value="******" @edit="onEdit(4)"></info-row>
    </div>
    <bottom-btn content="Sign Out" @confirm="onSignOut"></bottom-btn>
    <avatar-crop :imgUrl="imgUrl" :showCrop.sync="showCrop" @confirm="onUploadAvatar"></avatar-crop>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import BottomBtn from '@/components/BottomBtn'
import InfoRow from '@/components/UserInfoRow'
import AvatarCrop from '@/components/AvatarCrop'
import { apiUrl } from '@/service/api'
import { mapGetters } from 'vuex'
import { Toast } from 'vant'

export default {
  components: {
    NavBar,
    InfoRow,
    BottomBtn,
    AvatarCrop
  },
  computed: {
    ...mapGetters({
      avatar: 'user/avatar',
      nickName: 'user/nickName',
      sign: 'user/sign',
      phoneNum: 'user/phoneNum',
      lover: 'user/lover',
      password: 'user/password',
    }),
    ...mapGetters({
      IMGPATH: 'constant/IMGPATH',
      AVATARD: 'constant/AVATARD',
    })
  },
  data() {
    return {
      imgUrl: '',
      showCrop: false,
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
    onAvatarChange() {
      const file = this.$refs.avatarFile.files[0];
      if(!file.type.includes('image')) {
        this.$toast('请选择图片');
        return;
      }
      if(file.size > 1024 * 1024 * 5) {
        this.$toast('图片过大装不下!');
        return;
      }
      const reader = new FileReader() // 这里使用FileReader() 来得到图片地址
      reader.onload = e => {
        this.imgUrl = e.target.result;
        this.showCrop = true;
      }
      reader.readAsDataURL(file);
    },
    async onUploadAvatar(data) {
      const res = await this.$post(apiUrl.uploadImg, { data });
      const { imgUrl } = res.data;
      this.$store.commit('user/setProp', {
        prop: 'avatar',
        value: imgUrl
      });
      this.showCrop = false;
      this.$toast('修改成功~');
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
    padding-top: 46px;
    box-sizing: border-box;
    .detail_container {
      position: relative;
      .avatar-input {
        position: absolute;
        .px2vw(top, 30);
        .px2vw(right, 30);
        .px2vw(width, 184);
        .px2vw(height, 100);
        z-index: 99;
        opacity: 0;
      }

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