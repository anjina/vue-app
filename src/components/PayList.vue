<template>
  <div id="pay-list">
    <div v-if="list.length" class="pay-list">
      <template v-for="(item, index) in list">
        <div class="pay-list-container" :key="item.id">
          <pay-item :item="item" :index="index" @edit="onEdit" @delete="onDelete"></pay-item>
        </div>
      </template>
    </div>
    <div class="no-data" v-else>
      <van-divider :style="{ color: 'rgb(105, 105, 105)'}">暂无数据..</van-divider>
    </div>
  </div>
</template>

<script>
import PayItem from '@/components/PayItem'
import { Divider } from 'vant'
export default {
  props: {
    list: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  components: {
    PayItem,
    [Divider.name]: Divider
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
    .no-data {
      .px2vw(padding, 40, 0);
    }
  }
</style>