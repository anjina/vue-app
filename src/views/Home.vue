<template>
  <div class="home">
    <nav-bar title="Home" :needBack="false"></nav-bar>
    <Tabs @click="onTabChange" @search="onSearch" :current="current" :tabs="tabs" />
    <better-scroll
      :data="lists[current].list"
      pullup
      pulldown
      @pullup="loadMore"
      @pulldown="onRefresh"
      ref="BScroll"
    >
      <div class="list-wrapper">
        <pay-list
          :list="lists[current].list"
          :isLoading="lists[current].loading"
          :hasMore="lists[current].hasMore"
          :operation="operation"
          @edit="onEdit"
          @delete="onDelete"
        ></pay-list>
      </div>
    </better-scroll>
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
} from 'vant';
import NavBar from '@/components/NavBar'
import PayList from '@/components/PayList'
import BetterScroll from '@/components/BetterScroll'
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
          hasMore: true,
          listQuery: {
            page: 1,
            limit: 10,
            type: 0,
          },
          list: [],
          tabName: '今天',
        },
        {
          loading: false,
          hasMore: true,
          listQuery: {
            page: 1,
            limit: 10,
            type: 1,
          },
          list: [],
          tabName: '本月',
        },
        {
          loading: false,
          hasMore: true,
          listQuery: {
            page: 1,
            limit: 10,
            type: 2
          },
          list: [],
          tabName: '上个月',
        },
        {
          loading: false,
          hasMore: true,
          listQuery: {
            page: 1,
            limit: 10,
            type: 3,
          },
          list: [],
          tabName: '全部',
        },
      ],
      tabs: ['今天', '本月', '上个月', '全部'],
      current: 0,
      operation: 'pull',
    }
  },
  components: {
    NavBar,
    PayList,
    Tabs,
    BetterScroll,
    [Dialog.name]: Dialog,
    [Icon.name]: Icon,
  },
  created() {
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
    let editedRecord = this.$store.getters['pay/editedRecord'];
    const { current, tabs } = this;
    if(newRecord) {
      const { data, type } = newRecord;
      if(type !== current) {
        if(this.lists[type].list.length) {
          this.lists[type].list.unshift(data);
        }
        this.$toast(`您刚刚添加的记录属于${tabs[type]}类别!`);
      } else {
        this.lists[current].list.unshift(data);
      }
      this.$store.commit('pay/setProp', {
        prop: 'newRecord',
        value: null
      });
    }

    if(editedRecord) {
      const { data, type } = editedRecord;
      const { list } = this.lists[current];
      const index = list.findIndex(i => i.id === data.id);
      if(type !== current) {
        this.lists[current].list.splice(index, 1);
        if(this.lists[type].list.length) {
          this.lists[type].list.unshift(data);
        }
        this.$toast(`你编辑的数据移动到了${tabs[type]}类别!`);
      } else {
        this.lists[current].list.splice(index, 1, data);
      }
      this.$store.commit('pay/setProp', {
        prop: 'editedRecord',
        value: null
      });
    }
  },
  methods: {
    fetchData(operation) {
      const { current } = this;
      this.operation = operation;

      const { listQuery } = this.lists[current];
      const { page } = listQuery;
      this.lists[current].listQuery.page = operation === 'pull' ? page + 1 : 1;

      this.lists[current].loading = true;

      this.$get(apiUrl.pay, this.lists[current].listQuery, { withLoading: false })
        .then(res => {
          let { data, currentPage, totalPages } = res.data;

          this.lists[current].loading = false;

          if(currentPage === totalPages || data.length < 1) {
            this.lists[current].hasMore = false;
          }

          if(data.length < 1) {
            this.lists[current].listQuery.page -= 1;
          }

          data = formatData(data);

          if(operation === 'unshift') {
            const { list } = this.lists[current];
            const newData = data.filter(item => list.every(i => i.id !== item.id));
            const len = newData.length
            if(len > 0) {
              this.lists[current].list.unshift(...newData);
              this.$toast(`新增${len}条内容~`);
            } else {
              this.$toast('暂无新内容~');
            }
            this.$refs.BScroll.finishPullDown();
          } else if(operation === 'pull') {
            let newData = data;
            if(this.lists[current].listQuery.page === 1) {
              const { list } = this.lists[current];
              newData = data.filter(item => list.every(i => i.id !== item.id));
            }
            this.lists[current].list = [...this.lists[current].list, ...newData];
            this.$refs.BScroll.finishPullUp();
          } else {
            this.lists[current].list.push(...data);
          }
        })
    },
    loadMore() {
      this.fetchData('pull');
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
      if(this.lists[index].list.length < 1) {
        this.fetchData('load');
      }
    },
    onSearch() {},
    onDelete() {
      // const item = this.list[index];
    },
    onEdit(index) {
      const { current } = this;
      const item = this.lists[current].list[index];
      this.$store.commit('pay/setProp', {
        prop: 'editingRecord',
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
    box-sizing: border-box;

    .list-wrapper {
      padding-top: 90px;
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
      z-index: 99;
    }
  }
</style>