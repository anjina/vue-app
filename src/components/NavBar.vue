<template>
  <van-nav-bar fixed :title="title" @click-right="onMy">
    <div slot="left" class="left-content">
      <van-icon v-if="needBack" class-prefix="iconfont" name="back" size="30" color="#1989fa" @click.stop="onBack" />
      <van-icon v-if="needBack" name="wap-home-o" size="30" style="margin: 0 5px;" @click.stop="onHome" />
      <van-icon v-if="needRefresh" name="replay" size="30" :dot="hasNewRecord ? true : false" color="#1989fa" @click.stop="onRefresh" />
    </div>
    <div slot="right" :class="['right-content', hasNewMsg ? 'dot' : '']" v-if="needAvatar">
      <img :src="avatar ? (IMGPATH + avatar) : AVATARD">
    </div>
  </van-nav-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import { NavBar, Icon } from 'vant'
export default {
  name: 'NavBar',
  components: {
    [Icon.name]: Icon,
    [NavBar.name]: NavBar,
  },
  props: {
    title: String,
    needAvatar: {
      type: Boolean,
      default: true
    },
    needBack: {
      type: Boolean,
      default: true
    },
    needRefresh: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapGetters('user', ['avatar', 'hasNewMsg']),
    ...mapGetters('constant', ['IMGPATH', 'AVATARD']),
    ...mapGetters('notify', ['hasNewRecord']),
  },
  data() {
    return {
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
    },
    onRefresh() {
      this.$emit('refresh');
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .left-content {
    display: flex;
    align-items: center;
    height: 46px;
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
</style>
