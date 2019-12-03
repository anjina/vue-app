<template>
  <div>
    <div class="row">
      <div class="left-content">
        <div :class="['prop', hasNewMsg ? 'dot' : '']">{{prop}}</div>
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
      default: '',
    },
    hasNewMsg: {
      type: Number,
      default: 0,
    }
  },
  methods: {
    onEdit() {
      this.$emit('edit');
    },
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
    .px2vw(padding, 30, 30);

    .left-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .px2vw(margin-right, 40);

      .content {
        .ellipsisLn(1);
      }

      .dot {
        position: relative;

        &::after {
          position: absolute;
          .px2vw(top, -5);
          .px2vw(right, -10);
          z-index: 99;
          content: '';
          .px2vw(width, 20);
          .px2vw(height, 20);
          border-radius: 50%;
          background: @red;
        }
      }
    }

    .right-content {
      .expandClickArea(15);
    }
  }
</style>