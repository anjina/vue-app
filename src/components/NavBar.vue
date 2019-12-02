<template>
  <div class="nav-bar">
    <van-nav-bar :title="title" @click-left="onBack" @click-right="onMy" :left-arrow="needBack">
      <div slot="right" class="avatar" v-if="needAvatar">
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
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.avatar {
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
</style>
