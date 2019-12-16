<template>
  <div class="tabs">
    <div class="tabs-wrapper">
      <van-icon name="search" size="24" class="icon-search" @click.stop="onSearch" />
      <template v-for="(item, index) in tabs">
        <div :key="index" class="tab" @click.stop="onTabChange(index)" :class="index === current ? 'active' : ''">{{item}}</div>
      </template>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant'
export default {
  components: {
    [Icon.name]: Icon
  },
  props: {
    tabs: {
      type: Array,
      default: function() {
        return ['今天', '本月', '上个月', '全部'];
      }
    },
    current: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onTabChange(i) {
      this.$emit('click', i);
    },
    onSearch() {
      this.$emit('search');
    }
  },
}
</script>

<style lang="less" scoped>
  .tabs {
    position: fixed;
    top: 46px;
    height: 44px;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 1;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.05);

    .tabs-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      .px2vw(padding-left, 60);
      box-sizing: border-box;

      .icon-search {
        position: absolute;
        left: 3px;
        top: 50%;
        transform: translateY(-50%);
      }

      .tab {
        flex: 1;
        line-height: 44px;
        text-align: center;
      }

      .active {
        position: relative;

        &::after {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          background: @red;
          z-index: 1;
          content: '';
        }
      }
    }
  }
</style>