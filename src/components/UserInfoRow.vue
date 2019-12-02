<template>
  <div>
    <div class="row">
      <div class="left-content">
        <div class="prop">{{prop}}</div>
        <div class="content" v-if="value">{{value}}</div>
        <slot name="content"></slot>
      </div>
      <div class="right-content" @click.stop="onEdit">
        <van-icon name="arrow" />
      </div>
    </div>
    <van-divider />
  </div>
</template>

<script>
export default {
  props: {
    prop: {
      type: String,
      required: true
    },
    value: {
      type: String,
    }
  },
  methods: {
    onEdit() {},
  },
}
</script>

<style lang="less" scoped>
  .van-divider {
    margin: 0;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .px2vw(padding, 20, 20);

    .left-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .px2vw(margin-right, 30);
    }
  }
</style>