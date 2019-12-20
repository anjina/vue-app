<template>
  <van-image-preview
    v-model="showPreview"
    :images="images"
    @change="onChange"
    @close="onClose"
  >
    <template v-slot:index>{{ pIndex }} / {{images.length}}</template>
  </van-image-preview>
</template>

<script>
export default {
  mounted() {
    this.images = this.$route.params.images || [];
  },
  data() {
    return {
      showPreview: true,
      images: [],
      pIndex: 1,
    }
  },
  methods: {
    onChange(index) {
      this.pIndex = index + 1;
    },
    onClose() {
      this.$router.back();
    }
  },
}
</script>