<template>
  <div class="form-item">
    <div class="form-label">{{label}}：</div>
    <div class="form-value">{{value}}</div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="less">
  .form-item {
    display: flex;
    .px2vw(font-size, 30);

    .form-label {
      .px2vw(width, 100);
      color: rgb(190, 190, 190);
      flex: 0 0 auto;
    }
  }
</style>