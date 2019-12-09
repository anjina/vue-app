<template>
  <div class="map_container">
    <div id="map">
    </div>
  </div>
</template>

<script>
import { loadMap } from '@/utils/loadMap'
export default {
  data() {
    return {
    }
  },
  async created() {
    const AMap = await loadMap('3f3789735d7d50290d52d154ded286b6');
    console.log(AMap);
  },
}
</script>

<style lang="less">
  .map_container {
    width: 100%;
    height: 100vh;

    #map {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
</style>