<template>
  <div class="avatar_crop" v-if="showCrop">
    <div class="crop_wrapper">
      <vueCropper
        ref="cropper"
        :img="imgUrl"
        :outputSize="options.size"
        :outputType="options.outputType"
        :info="options.info"
        :full="options.full"
        :canMove="options.canMove"
        :canMoveBox="options.canMoveBox"
        :fixedBox="options.fixedBox"
        :original="options.original"
        :autoCrop="options.autoCrop"
        :fixed="options.fixed"
        :fixedNumber="options.fixedNumber"
        :centerBox="options.centerBox"
        @realTime="realTime"
      ></vueCropper>
    </div>
    <div class="show-preview" :style="previewStyle" v-if="needPreview">
      <div :style="previews.div">
        <img :src="previews.url" :style="previews.img">
      </div>
    </div>
    <div class="operations">
      <div @click.stop="onConfirm">确定</div>
      <div @click.stop="onCancel">取消</div>
    </div>
  </div>
</template>

<script>
import { VueCropper  } from 'vue-cropper'
export default {
  components: {
    VueCropper 
  },
  props: {
    imgUrl: {
      type: String,
      required: true,
    },
    showCrop: {
      type: Boolean,
      default: false,
    },
    needPreview: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      options: {
        outputSize: 1, // 裁剪生成图片质量
        outputType: 'png', // 生成图片格式
        info: true, // 裁剪框大小信息
        autoCrop: true,
        fixed: true,
        fixedNumber: [1, 1],
        fixedBox: false,
        canMove: true,
        canMoveBox: true,
        original: false,
        full: false,
        centerBox: true,
      },
      previews: {},
      previewStyle: {}
    }
  },
  methods: {
    onCancel() {
      this.$emit('update:showCrop', false);
    },
    realTime(data) {
      const previews = data
      this.previewStyle = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "40px auto",
        zoom: 150 / previews.w,
        borderRadius: '50%',
      }
      this.previews = data;
    },
    onConfirm() {
      this.$refs.cropper.getCropData((data) => {
        this.$emit('confirm', data);
      })
    },
  },
}
</script>

<style lang="less">
  .avatar_crop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background: @yellow;

    .crop_wrapper {
      width: 100%;
      height: 60vh;
    }

    .operations {
      display: flex;
      justify-content: space-around;

      div {
        .px2vw(width, 180);
        .px2vw(height, 80);
        .px2vw(line-height, 80);
        text-align: center;
        border: 1px solid @skyBlue;
        .px2vw(border-radius, 10);
        background: @skyBlue;
        color: #fff;
        .px2vw(font-size, 32);
      }
    }
  }
</style>