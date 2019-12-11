<template>
  <div class="home">
    <nav-bar title="Home" :needBack="false" needRefresh @refresh="onRefresh"></nav-bar>
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="loadMore"
    >
      <div class="home_container">
        <pay-list :list="list"></pay-list>
      </div>
    </van-list>
    <div class="home_add" @click.stop="onAdd">
      <van-icon name="plus" size="22" color="#fff" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Dialog } from 'vant';
import NavBar from '@/components/NavBar'
import PayList from '@/components/PayList'
import { apiUrl } from '@/service/api'

const formatData = data => {
  if(data && data.length) {
    data.forEach(item => {
      item.imgsUrl = (item.imgsUrl && item.imgsUrl.split(',')) || [];
    })
  }
  return data || [];
}
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
        type: 0,
        page: 1,
        limit: 10,
      },
      list: [],
      loading: false,
      error: false,
      finished: false,
    }
  },
  components: {
    NavBar,
    PayList
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
    this.fetchData('load');
  },
  activated() {
    let newRecord = this.$store.getters['pay/newRecord'];
    if(newRecord) {
      newRecord = formatData(newRecord);
      this.list.unshift(newRecord);
      this.$store.commit('pay/setProp', {
        prop: 'newRecord',
        value: null
      });
    }
  },
  methods: {
    fetchData(operation) {
      let config = {}
      if(operation === 'pull') {
        config.withLoading = false;
      }
      this.listQuery.page = operation === 'pull' ? this.listQuery.page + 1 : 1;
      this.$get(apiUrl.pay, this.listQuery, config)
        .then(res => {
          const data = formatData(res.data.data);
          const count = res.data.count;
          if(count < this.listQuery.limit) {
            this.finished = true;
          }
          this.list = data;
          if(operation === 'pull') {
            this.loading = false;
          }
          if(operation === 'unshift' && count === this.list.length) {
            this.$toast('没有新内容~');
          }
        })
    },
    loadMore() {
      this.fetchData('pull')
    },
    onMy() {
      this.$router.push('/user');
    },
    onAdd() {
      this.$router.push('/add');
    },
    onRefresh() {
      this.fetchData('unshift');
    }
  },
}
</script>

<style lang="less" scoped>
  .home {
    padding-top: 46px;
    box-sizing: border-box;

    .home_container {
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