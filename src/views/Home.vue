<template>
  <div class="home">
    <nav-bar title="Home" :needBack="false"></nav-bar>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="home_container"></div>
    </van-pull-refresh>
    <div class="home_add" @click.stop="onAdd">
      <van-icon name="plus" size="22" color="#fff" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Dialog } from 'vant';
import NavBar from '@/components/NavBar'
import { apiUrl } from '@/service/api'
export default {
  computed: {
    ...mapGetters('user', ['lover', 'phoneNum']),
    ...mapGetters('notify', ['hasShowTip']),
  },
  data() {
    return {
      listQuery: {
        query: {

        },
        type: 0
      },
      isLoading: false,
    }
  },
  components: {
    NavBar
  },
  mounted() {
    // lover不存在？？ 安排！！
    if(!this.lover && !this.hasShowTip) {
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
      this.$store.commit('notify/setProp', {
        prop: 'hasShowTip',
        value: true
      });
    }

    this.fetchData();
  },
  methods: {
    async fetchData() {
      const res = await this.$get(apiUrl.pay, this.listQuery, { withLoading: false });
      console.log(res);
    },
    onMy() {
      this.$router.push('/user');
    },
    onAdd() {
      this.$router.push('/add');
    },
    async onRefresh() {
      await this.fetchData();
      this.isLoading = false;
    }
  },
}
</script>

<style lang="less" scoped>
  .home {
    padding-top: 46px;
    box-sizing: border-box;

    .home_container {
      min-height: 100vh;
      box-sizing: border-box;
    }
    .home_add {
      position: fixed;
      .px2vw(right, 60);
      .px2vw(bottom, 60);
      .px2vw(width, 120);
      .px2vw(height, 120);
      background: @green;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
  }
</style>