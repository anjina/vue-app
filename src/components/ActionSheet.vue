<template>
  <div class="action-sheet-wrapper">
    <div class="mask" @click.stop="onCancel" v-if="needMask || showEdit"></div>
    <div class="action-sheet" v-if="showEdit">
      <div
        :class="['item', index ? 'van-hairline--top-bottom' : 'van-hairline-bottom']"
        v-for="(action, index) in actions"
        :key="action.id"
        :style="{ color: action.color }"
        @click.stop="onItem(action)"
      >
        {{action.name}}
      </div>
      <div class="cancel-sheet">
        <div class="item" @click.stop="onCancel" v-if="cancelText">{{cancelText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actions: {
      type: Array,
      default: function() {
        return [];
      }
    },
    showEdit: {
      type: Boolean,
      default: false,
    },
    needMask: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: String,
      default: '',
    }
  },
  methods: {
    onCancel() {
      this.$emit('update:showEdit', false);
    },
    onItem(action) {
      this.$emit('select', action);
    }
  },
}
</script>

<style lang="less">
  .action-sheet-wrapper {
    position: relative;
    z-index: 999;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, .7);
    }
    .action-sheet {
      position: fixed;
      z-index: 99999;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #fff;
      border-radius: 20px 20px 0 0;
      border-top: 0;

      .item {
        .px2vw(height, 100);
        .px2vw(line-height, 100);
        text-align: center;
      }

      .cancel-sheet {
        &::before {
          display: block;
          height: 8px;
          background: #f8f8f8;
          content: ' ';
        }
      }
    }
  }
</style>