<template>
  <div ref="wrapper" class="scroll-wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
import PullDown from '@better-scroll/pull-down'

BScroll.use(PullDown);
BScroll.use(Pullup);
export default {
  props: {
    probeType: {
      type: Number,
      default: 1,
    },
    click: {
      type: Boolean,
      default: true,
    },
    scrollX: {
      type: Boolean,
      default: false,
    },
    listenScroll: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: null,
    },
    pullup: {
      type: Boolean,
      default: false,
    },
    pulldown: {
      type: Boolean,
      default: false,
    },
    beforeScroll: {
      type: Boolean,
      default: false,
    },
    refreshDelay: {
      type: Number,
      default: 20,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
    })
  },
  methods: {
    _initScroll() {
      if(!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        pullDownRefresh: this.pulldown,
        pullUpLoad: this.pullup,
      });

      if(this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos);
        });
      }

      if(this.pullup) {
        this.scroll.on('pullingUp', this.pullingUpHandler)
      }

      if(this.pulldown) {
        this.scroll.on('pullingDown', this.pullingDownHandler)
      }

      if(this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll');
        });
      }
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    pullingDownHandler() {
      this.$emit('pulldown');
    },
    
    finishPullDown() {
      this.scroll.finishPullDown();
    },

    pullingUpHandler() {
      this.$emit('pullup');
    },

    finishPullUp() {
      this.scroll.finishPullUp();
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay)
    }
  },
}
</script>

<style lang="less">
  .scroll-wrapper {
    height: 100vh;
    box-sizing: border-box;
  }
</style>