<template>
  <div :class="['footer', 'van-hairline--top', external]" @click.stop="onClick">{{ content }}</div>
</template>

<script>
export default {
  props: {
    content: String,
    external: String
  },
  methods: {
    onClick() {
      this.$emit('confirm');
    }
  }
}
</script>

<style lang="less">
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    width: 100%;
    .px2vw(height, 100);
    .px2vw(line-height, 100);
    text-align: center;
    color: #fff;
    background: rgb(105, 105, 105);
  }
</style>