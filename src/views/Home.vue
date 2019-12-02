<template>
  <div class="home">
    <nav-bar title="Home" :needBack="false"></nav-bar>
    <van-icon class-prefix="iconfont" name="love" size="30" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Dialog } from 'vant';
import NavBar from '@/components/NavBar'
export default {
  computed: {
    ...mapGetters('user', ['lover']),
  },
  data() {
    return {
      avatarD: require('../assets/avatar.png'),
    }
  },
  components: {
    NavBar
  },
  mounted() {
    // lover不存在？？ 安排！！
    if(!this.lover) {
      Dialog.confirm({
        message: '系统检测到你还是单身狗，\n是否尝试领养一个🙈？',
        transition: 'slide',
        confirmButtonText: '嘻嘻😍',
        confirmButtonColor: 'pink',
        cancelButtonText: '🐶'
      }).then(() => {
        this.$router.push('/search');
      }).catch(() => {
        // 
      })
    }
  },
  methods: {
    onMy() {
      this.$router.push('/user');
    }
  },
}
</script>

<style lang="less">
  .home {
  }
</style>