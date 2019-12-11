<template>
  <div class="pay-item" v-if="item">
    <div class="label-icon">
      <van-icon class-prefix="iconfont" name="label3" size="28" color="#87CEEB" />
    </div>
    <div class="header">
      <div class="left-header">
        <img :src="IMGPATH + item.creatorInfo.avatar" alt="">
        <div class="info">
          <div class="nick-name">{{item.creatorInfo.nickName}}</div>
          <div class="time">{{item.date}}</div>
        </div>
      </div>
    </div>
    <van-divider />
    <div class="content">
      <div class="pay-type">{{item.type | filterType}}</div>
      <div class="pay-money">
        <span>{{item.money | filterMoney}}</span>元
      </div>
      <form-item label="分类" :value="item.label"></form-item>
      <form-item label="地点" :value="item.location"></form-item>
      <form-item label="备注" :value="item.remark"></form-item>
    </div>
    <van-divider />
    <div class="footer">
      <div class="left-footer">
        <div class="left-footer-wrapper" v-if="item.imgsUrl.length" @click.stop="onImgPreview(item.imgsUrl)">
          <van-icon name="photo-o" size="24" />
          <div class="photo">凭证</div>
        </div>
      </div>
      <div class="right-footer" @click.stop="onMore">
        <van-icon name="ellipsis" size="24" />
      </div>
    </div>

    <van-image-preview
      v-model="showPreview"
      :images="images"
      @change="onChange"
    >
      <template v-slot:index>{{ pIndex }} / {{images.length}}</template>
    </van-image-preview>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FormItem from '@/components/FormItem'
export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
    index: Number
  },
  computed: {
    ...mapGetters({
      IMGPATH: 'constant/IMGPATH',
    })
  },
  data() {
    return {
      pIndex: 1,
      showPreview: false,
      images: []
    }
  },
  components: {
    FormItem
  },
  methods: {
    onImgPreview(imgs) {
      const { IMGPATH } = this;
      this.images = imgs.map(img => IMGPATH + img);
      this.showPreview = true;
    },
    onChange(index) {
      this.pIndex = index + 1;
    },
    onMore() {},
  },
  filters: {
    filterType(v) {
      if(v === 0) {
        return '付款成功';
      } else if(v === 1) {
        return '收入到账';
      }
    },
    filterMoney(v) {
      return v.toFixed(2);
    }
  }
}
</script>

<style lang="less" scoped>
  .pay-item {
    position: relative;

    .label-icon {
      position: absolute;
      .px2vw(right, -35);
      .px2vw(top, -35);
    }

    .header {
      display: flex;
      align-items: center;
      .px2vw(margin-bottom, 15);

      .left-header {
        flex: 1;
        display: flex;
        align-items: center;
        img {
          .px2vw(width, 100);
          .px2vw(height, 100);
          .px2vw(margin-right, 10);
          border-radius: 50%;
          overflow: hidden;
          background: @grey;
        }
        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          .time {
            color: @grey;
            .px2vw(font-size, 30);
            .px2vw(margin-top, 10);
          }
        }
      }
    }
    .content {
      .px2vw(padding, 15, 0);

      .pay-type {
        .px2vw(font-size, 30);
      }

      .pay-money {
        .px2vw(margin, 20, 0);
        .px2vw(font-size, 30);

        span {
          .px2vw(font-size, 44);
          .px2vw(margin-right, 10);
          font-weight: 700;
          color: #000;
        }
      }

      .form-item {
        .px2vw(margin-bottom, 10);
      }
    }

    .footer {
      .px2vw(padding-top, 20);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left-footer {
        flex: 1;

        .left-footer-wrapper {
          display: flex;
          align-items: center;
        }
        .photo {
          .px2vw(margin-left, 5);
        }
      }
    }
  }
</style>