<template>
  <div id="pay-list">
    <div v-if="isLoading && operation !== 'pull'" class="load-new-wrapper">
      <van-loading
        size="20px"
        type="spinner"
        color="#1989fa"
      >正在加载..</van-loading>
    </div>
    <div v-if="list.length" class="pay-list">
      <template v-for="(item, index) in list">
        <div class="pay-list-container" :key="item.id">
          <pay-item :item="item" :index="index" @edit="onEdit" @delete="onDelete"></pay-item>
        </div>
      </template>
    </div>

    <div v-if="list.length && isLoading" class="load-wrapper">
      <van-loading
        size="20px"
        type="spinner"
        color="#1989fa"
      >正在加载..</van-loading>
    </div>
    <van-divider
      :style="{ color: 'rgb(105, 105, 105)', borderColor: 'rgb(105, 105, 105)', padding: '30px 64px' }"
      v-if="list.length && !isLoading && hasMore"
    >上拉加载更多</van-divider>
    <van-divider
      :style="{ color: 'rgb(105, 105, 105)', borderColor: 'rgb(105, 105, 105)', padding: '30px 64px' }"
      v-if="list.length && !isLoading && !hasMore"
    >没有更多了</van-divider>
    <div class="no-data" v-if="!list.length">
      <van-divider :style="{ color: 'rgb(105, 105, 105)'}">暂无数据..</van-divider>
    </div>
  </div>
</template>

<script>
import PayItem from '@/components/PayItem'
import { Divider } from 'vant'
import { Loading } from 'vant'
export default {
  props: {
    list: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    hasMore: {
      type: Boolean,
      default: true,
    },
    operation: {
      type: String,
      required: true,
    }
  },
  components: {
    PayItem,
    [Divider.name]: Divider,
    [Loading.name]: Loading,
  },
  methods: {
    onEdit(index) {
      this.$emit('edit', index);
    },
    onDelete(index) {
      this.$emit('delete', index);
    }
  },
}
</script>

<style lang="less" scoped>
  #pay-list {
    .load-new-wrapper {
      .px2vw(padding-top, 40);
      .px2vw(padding-bottom, 10);
      text-align: center;
    }

    .pay-list {
      background: @bg;
      .px2vw(padding, 30, 20, 0, 20);
      box-sizing: border-box;

      .pay-list-container {
        background: #fff;
        .px2vw(border-radius, 10);
        .px2vw(padding, 20);
        box-sizing: border-box;

        &:not(:first-child) {
          .px2vw(margin-top, 20);
        }
      }
    }
    .load-wrapper {
      .px2vw(padding, 60, 0);
      text-align: center;
    }
    .no-data {
      .px2vw(padding, 40, 0);
    }
  }
</style>