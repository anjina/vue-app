<template>
  <div class="add_pay">
    <nav-bar title="添加账单"></nav-bar>
    <div class="add_container">
      <van-cell-group>
        <van-field
          v-model="form.money"
          required
          type="number"
          clearable
          label="Money"
          placeholder="请输入.."
        />

        <van-field
          v-model="date"
          label="日期"
          placeholder="请选择.."
          required
          disabled
          right-icon="clock-o"
          @click-right-icon="onDatePick"
        />

        <van-field
          v-model="form.remark"
          rows="2"
          autosize
          label="备注"
          type="textarea"
          maxlength="50"
          placeholder="请输入.."
          show-word-limit
        />
      </van-cell-group>
      <div class="label-list">
        <div class="header">标签</div>
        <div class="list">
          <div class="label" v-for="item in form.label" :key="item.id">
            <van-tag
              closeable
              type="warning"
              size="large"
              round
            >{{item}}</van-tag>
          </div>
        </div>
        <div class="add" @click.stop="onAddLabel">
          <van-icon name="add-o" color="#f2826a" size="24" />
        </div>
      </div>
      <div class="image-list">
        <div class="header">图片</div>
        <van-uploader :after-read="afterRead" />
      </div>
    </div>
    <div class="dater-pick" v-if="showDatePicker">
      <van-datetime-picker
        v-model="form.currentDate"
        type="date"
        @confirm="onConfirmDate"
        @cancel="toggleDatePicker"
      />
    </div>
    <van-dialog
      v-model="showLabel"
      title="Label"
      show-cancel-button
      show-confirm-button
      @cancel="onCancel"
    >
      <div class="dialog-content">
        <div class="dialog_wrapper">请选择标签:</div>
        <div class="label-group">
          <div class="label-item" v-for="(item, index) in labels" :key="item.id">
            <van-tag
              round
              size="large"
              @click="onSelect(index)"
              :style="{backgroundColor: item.selected ? '#07c160' : '#969799'}"
            >{{item}}</van-tag>
          </div>
        </div>
        <div class="create_wrapper">没有想要的？在下面创建:</div>
      </div>
      <van-field
        v-model="labelName"
        center
        clearable
        label="标签名称"
        placeholder="请输入.."
      >
        <van-icon slot="button" name="plus" color="#07c160" size="20" @click.stop="onCreateLabel" />
      </van-field>
    </van-dialog>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import { apiUrl } from '@/service/api'
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      form: {
        money: 0,
        remark: '',
        currentDate: null,
        label: ['出行', '人情往来', '人情往来', '人情往来']
      },
      showDatePicker: false,
      date: '',
      labels: [],
      showLabel: false,
      labelName: '',
    }
  },
  mounted() {
    this.fetchLabel();
  },
  methods: {
    async fetchLabel() {
      const data = await this.$get(apiUrl.label);
      this.labels = data;
    },
    onAddLabel() {
      this.showLabel = true;
    },
    onCancel() {
      this.showLabel = false;
    },
    onCreateLabel() {
      const { labelName } = this;
      if(!labelName) {
        this.$toast('请输入标签名称~');
        return;
      }
    },
    onSelect(index) {
      const item = this.labels[index];
      item.selected = !item.selected;
      this.labels.splice(index, 1, item);
    },
    onDatePick() {
      this.showDatePicker = true;
    },
    onConfirmDate() {
      const { currentDate } = this.form;
      this.formatTime(currentDate);
      this.showDatePicker = false;
    },
    formatTime(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      this.date = `${year}-${month}-${day}`;
    },
    afterRead() {},
  }
}
</script>

<style lang="less">
  .add_pay {
    padding-top: 46px;
    box-sizing: border-box;

    .add_container {
      // px做单位是为了做到和vant-ui一致
      .label-list,
      .image-list {
        position: relative;
        padding: 10px 16px;
        display: flex;
        color: #323233;
        line-height: 24px;

        .header {
          width: 90px;
          flex-shrink: 0;
        }

        &::after {
          position: absolute;
          box-sizing: border-box;
          content: '';
          pointer-events: none;
          right: 0;
          bottom: 0;
          left: 16px;
          border-bottom: 1px solid #ebedf0;
          transform: scaleY(.5);
        }
      }

      .label-list {
        .list {
          display: flex;
          flex-wrap: wrap;

          .label {
            .px2vw(margin-right, 20);
            .px2vw(margin-bottom, 10);
          }
        }

        .add {
          position: absolute;
          right: 16px;
          bottom: 8px;
          z-index: 1;
        }
      }
    }
    .dater-pick {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }

    .dialog-content {
      padding: 0 16px;

      .dialog_wrapper {
        color: @orange;
        .px2vw(margin-bottom, 30);
      }
      .label-group {
        display: flex;
        flex-wrap: wrap;

        .label-item {
          .px2vw(margin-right, 20);
          .px2vw(margin-bottom, 10);
        }
      }
      .create_wrapper {
        .px2vw(margin-top, 30);
        color: @skyBlue;
      }
    }
  }
</style>