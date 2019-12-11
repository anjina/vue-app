<template>
  <div v-if="list.length" class="pay-list">
    <template v-for="(item, index) in list">
      <div class="pay-list-container" :key="item.id">
        <pay-item :item="item" :index="index"></pay-item>
      </div>
    </template>
  </div>
</template>

<script>
import PayItem from '@/components/PayItem'
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
    PayItem
  }
}
</script>

<style lang="less">
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
</style>