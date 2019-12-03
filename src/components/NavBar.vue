<template>
  <div class="nav-bar">
    <van-nav-bar :title="title" @click-right="onMy">
      <div slot="left" v-if="needBack" class="left-content">
        <van-icon class-prefix="iconfont" name="back" size="30" color="#1989fa" @click.stop="onBack" />
        <van-icon name="wap-home-o" size="30" style="margin-left: 5px;" @click.stop="onHome" />
      </div>
      <div slot="right" :class="['right-content', hasNewMsg ? 'dot' : '']" v-if="needAvatar">
        <img :src="avatar" v-if="avatar">
        <img :src="avatarD" v-else>
      </div>
    </van-nav-bar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'NavBar',
  props: {
    title: String,
    needAvatar: {
      type: Boolean,
      default: true
    },
    needBack: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters('user', ['avatar']),
    ...mapGetters('notify', ['hasNewMsg']),
  },
  data() {
    return {
      avatarD: require('../assets/avatar.png'),
    }
  },
  methods: {
    onBack() {
      this.$router.back();
    },
    onMy() {
      this.$router.push('/user');
    },
    onHome() {
      this.$router.push('/home');
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.nav-bar {
  .left-content {
    display: flex;
    align-items: center;
  }

  .right-content {
    position: relative;
    .px2vw(width, 90);
    .px2vw(height, 90);
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      z-index: 1;
    }
  }
  .dot {
    position: relative;

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      .px2vw(width, 20);
      .px2vw(height, 20);
      content: '';
      border-radius: 50%;
      background: @red;
      z-index: 9;
    }
  }
}
</style>
