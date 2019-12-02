<template>
  <div class="user">
    <nav-bar title="Nest" :needAvatar="false"></nav-bar>
    <div class="user_container">
      <div class="user_wrapper">
        <div class="left-content">
          <div class="avatar">
            <img :src="avatar" v-if="avatar">
            <img :src="avatarD" v-else>
          </div>
          <div class="info">
            <div class="name">{{nickName}}</div>
            <div class="sign">{{sign}}</div>
          </div>
        </div>
        <div class="right-content" @click.stop="onDetail">
          <van-icon name="arrow" color="#F5F5F5" size="20" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import { mapGetters } from 'vuex'
export default {
  components: {
    NavBar
  },
  data() {
    return {
      avatarD: require('../assets/avatar.png'),
    }
  },
  computed: {
    ...mapGetters('user', ['avatar', 'nickName', 'sign'])
  },
  methods: {
    onDetail() {
      this.$router.push('/detail');
    }
  },
}
</script>

<style lang="less">
.user {
  .user_container {
    .px2vw(padding, 0, 30);
    background: @skyBlue;
    .user_wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .px2vw(padding, 10, 0);

      .left-content {
        flex: 1;
        display: flex;
        align-items: center;
        .avatar {
          position: relative;
          .px2vw(width, 150);
          .px2vw(height, 150);
          .px2vw(margin-right, 20);
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
        .name {
          color: #fff;
          .ellipsisLn(1);
        }
        .sign {
          color: rgb(105, 105, 105);
          .px2vw(font-size, 28);
          .px2vw(margin-top, 10);
          .ellipsisLn(1);
        }
      }
      .right-content {
        .expandClickArea(15);
      }
    }
  }
}
</style>