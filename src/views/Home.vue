<template>
  <div class="home">
    <van-nav-bar title="Home" left-arrow>
      <img src="" alt="" slot="right">
    </van-nav-bar>
    <van-icon class-prefix="iconfont" name="love" size="30" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('user', ['phoneNum'])
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="less">
  .home {
    background: @bg;
    min-height: 100vh;
  }
</style>