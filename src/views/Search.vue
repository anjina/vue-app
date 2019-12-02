<template>
  <div class="search">
    <van-nav-bar
      title="约TA🙋‍♀️"
      left-text="Back" 
      left-arrow
      @click-left="onBack"
    ></van-nav-bar>
    <van-search
      v-model="listQuery.query.keyword"
      placeholder="请输入心仪的TA😍"
      show-action
      shape="round"
      background="pink"
      @search="onSearch"
    >
      <div slot="action" @click="onSearch">找找看</div>
    </van-search>
    <van-collapse v-model="activeNames" accordion>
      <van-collapse-item title="为你推荐😉😉😉" name="1">
        <div v-if="!recommendList.length" class="no-data">
          注孤生😭😭😭
        </div>
      </van-collapse-item>
      <van-collapse-item title="匹配结果☺️☺️☺️" name="2">
        <div v-if="!searchList.length" class="no-data">
          快开始匹配呀👅👅👅
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { apiUrl } from '@/service/api'
export default {
  data() {
    return {
      value: '',
      activeNames: '1',
      recommendList: [],
      searchList: [],
      listQuery: {
        query: {
          keyword: null
        }
      }
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const res = await this.$get(apiUrl.getLovers, this.listQuery);
      console.log(res);
    },
    onSearch() {
      const { value } = this;
      if(!value) {
        this.$toast('请先输入查找内容哦~');
        return;
      }
    },
    onBack() {
      this.$router.back();
    },
  },
}
</script>

<style lang="less">
  .search {
    .no-data {
      .px2vw(font-size, 30);
    }
  }
</style>