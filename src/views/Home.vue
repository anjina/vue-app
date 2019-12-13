<template>
  <div class="home">
    <nav-bar title="Home" :needBack="false" needRefresh @refresh="onRefresh"></nav-bar>
    <Tabs @click="onTabChange" @search="onSearch" :current="current" />
    <van-list
      v-model="lists[current].loading"
      :error.sync="lists[current].error"
      error-text="请求失败，点击重新加载"
      :finished="lists[current].finished"
      :finished-text="lists[current].list.length ? '没有更多了' : ''"
      @load="loadMore"
      :immediate-check="false"
      :offset="50"
    >
      <div class="home_container">
        <pay-list :list="lists[current].list" @edit="onEdit" @delete="onDelete"></pay-list>
      </div>
    </van-list>
    <div class="home_add" @click.stop="onAdd">
      <van-icon name="plus" size="22" color="#fff" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Dialog,
  Icon,
  List
} from 'vant';
import NavBar from '@/components/NavBar'
import PayList from '@/components/PayList'
import Tabs from '@/components/Tabs'
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
      lists: [
        {
          loading: false,
          finished: false,
          error: false,
          listQuery: {
            page: 0,
            limit: 10,
            type: 0,
          },
          list: [],
          tabName: '今天',
        },
        {
          loading: false,
          finished: false,
          error: false,
          listQuery: {
            page: 0,
            limit: 10,
            type: 1,
          },
          list: [],
          tabName: '本月',
        },
        {
          loading: false,
          finished: false,
          error: false,
          listQuery: {
            page: 0,
            limit: 10,
            type: 2
          },
          list: [],
          tabName: '上个月',
        },
        {
          loading: false,
          finished: false,
          error: false,
          listQuery: {
            page: 0,
            limit: 10,
            type: 3,
          },
          list: [],
          tabName: '全部',
        },
      ],
      current: 0,
    }
  },
  components: {
    NavBar,
    PayList,
    Tabs,
    [Dialog.name]: Dialog,
    [Icon.name]: Icon,
    [List.name]: List,
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
    this.fetchData('pull');
  },
  activated() {
    let newRecord = this.$store.getters['pay/newRecord'];
    let editedRecord = this.$store.getters['pay/editedRecord'];

    const { current } = this;
    if(newRecord) {
      const { data, type } = newRecord;
      this.lists[type].list.unshift(data);
      this.$store.commit('pay/setProp', {
        prop: 'newRecord',
        value: null
      });
      this.current = type;
    }

    if(editedRecord) {
      const { data, type } = editedRecord;
      const { list } = this.lists[current];
      const index = list.findIndex(i => i.id === data.id);
      if(type !== current) {
        this.lists[current].list.splice(index, 1);
        this.lists[type].list.unshift(data);
      } else {
        this.lists[current].list.splice(index, 1, data);
      }
      this.$store.commit('pay/setProp', {
        prop: 'editedRecord',
        value: null
      });
      this.current = type;
    }
  },
  methods: {
    fetchData(operation) {
      const { current } = this;
      let config = {};

      const { listQuery } = this.lists[current];
      const { page } = listQuery;
      this.lists[current].listQuery.page = operation === 'unshift' ? 1 : page + 1;

      if(operation === 'pull' && page !== 0) {
        config.withLoading = false;
        this.lists[current].loading = true;
      }

      this.$get(apiUrl.pay, this.lists[current].listQuery, config)
        .then(res => {
          let { data, currentPage, totalPages } = res.data;

          if(operation === 'pull') {
            this.lists[current].loading = false;
          }

          if(currentPage === totalPages || data.length < 1) {
            this.lists[current].finished = true;
          }

          data = formatData(data);

          if(operation === 'unshift') {
            const { list } = this.lists[current]
            const newData = data.filter(item => list.every(i => i.id !== item.id));
            const len = newData.length
            if(len > 0) {
              this.lists[current].list.unshift(...newData);
              this.$toast(`新增${len}条内容~`);
            } else {
              this.$toast('暂无新内容~');
            }
          } else {
            this.lists[current].list = [...this.lists[current].list, ...data];
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
    },
    onTabChange(index) {
      if(index === this.current) return;
      this.current = index;
      // if(this.lists[index].list.length < 1) {
      //   this.fetchData('unshift');
      // }
    },
    onSearch() {},
    onDelete() {
      // const item = this.list[index];
    },
    onEdit(index) {
      const { current } = this;
      const item = this.lists[current].list[index];
      this.$store.commit('pay/setProp', {
        prop: 'editedRecord',
        value: {
          data: item,
        }
      });
      this.$router.push({
        path: '/add',
        query: {
          id: item.id,
        }
      });
    },
  },
}
</script>

<style lang="less" scoped>
  .home {
    padding-top: 90px;
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