<template>
  <div>
  </div>
</template>

<script>
export default {
  mounted() {
    const type = this.$route.query.type;
    this.type = type ? parseInt(type) : 0;
  },
  data() {
    return {
      type: 0,
    }
  },
}
</script>

<style lang="less">
  
</style>