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
          v-model="form.date"
          label="日期"
          placeholder="请选择.."
          disabled
          right-icon="clock-o"
          @click-right-icon="onDatePick"
        />

        <van-field
          v-model="form.remark"
          rows="3"
          autosize
          label="备注"
          type="textarea"
          maxlength="100"
          placeholder="请输入.."
          show-word-limit
        />

        <van-field
          v-model="form.location"
          rows="1"
          autosize
          label="定位"
          type="textarea"
          placeholder="请输入或选择位置.."
          right-icon="location-o"
          @click-right-icon="onLocationPick"
        />
      </van-cell-group>

      <van-radio-group v-model="form.type" class="add_radio_group">
        <div class="radio-type">类型</div>
        <van-radio :name="0">支出</van-radio>
        <van-radio :name="1">收入</van-radio>
      </van-radio-group>

      <div class="label-list">
        <div class="header">标签</div>
        <div class="list">
          <div class="label" v-for="(item, index) in labels" :key="item.name">
            <van-tag
              type="warning"
              size="large"
              round
              :style="{backgroundColor: item.name === form.label ? '#07c160' : '#969799'}"
              @click.stop="onSelect(index)"
            >{{item.name}}</van-tag>
          </div>
        </div>
        <div class="add" @click.stop="onAddLabel">
          <van-icon name="add-o" color="#f2826a" size="24" />
        </div>
      </div>
      <div class="image-list">
        <div class="header">图片</div>
        <van-uploader :after-read="afterRead" multiple v-model="imgsList" />
      </div>
    </div>
    <bottom-btn :content="id ? '保存' : '创建'" @confirm="onCreate" :external="isReady ? 'bottom-btn-y' : 'bottom-btn-n'"></bottom-btn>
    <div class="dater-pick" v-if="showDatePicker">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmDate"
        @cancel="onClose"
      />
    </div>
    <van-dialog
      v-model="showLabel"
      title="Label"
      show-cancel-button
      show-confirm-button
      @cancel="onCancel"
      :before-close="onConfirmLabel"
    >
      <van-field
        v-model="labelName"
        center
        clearable
        label="标签名称"
        placeholder="请输入.."
      ></van-field>
    </van-dialog>
    <Map v-if="showMap" @close="showMap = false" @confirm="onConfirmLocation" />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import BottomBtn from '@/components/BottomBtn'
import Map from '@/components/Map'
import { apiUrl } from '@/service/api'
import { loadMap } from '@/utils/loadMap'
import { mapGetters } from 'vuex'
import { getTimeType } from '@/utils/utils'
import {
  Cell,
  CellGroup,
  Field,
  Dialog,
  DatetimePicker,
  Radio,
  RadioGroup,
  Icon,
  Uploader,
  Tag
} from 'vant'

export default {
  components: {
    NavBar,
    BottomBtn,
    Map,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Dialog.Component.name]: Dialog.Component,
    [DatetimePicker.name]: DatetimePicker,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Icon.name]: Icon,
    [Uploader.name]: Uploader,
    [Tag.name]: Tag,
  },
  data() {
    return {
      form: {
        money: '',
        remark: '',
        date: null,
        label: '',
        location: null,
        images: [],
        type: 0,
      },
      showDatePicker: false,
      labels: [],
      showLabel: false,
      labelName: '',
      isReady: false,
      showMap: false,
      currentDate: null,
      minDate: new Date(2019, 10, 1),
      maxDate: new Date(),
      id: 0, // 存在id则为编辑状态
      imgsList: []
    }
  },
  computed: {
    ...mapGetters({
      uid: 'user/phoneNum',
      toId: 'user/lover',
    })
  },
  mounted() {
    const { id } = this.$route.query;
    if(!id) {
      this.form.date = this.formatTime(new Date());
      this.initLocation();
    } else {
      this.id = id;
      this.initData();
    }
    this.fetchLabel();
  },
  watch: {
    form: {
      handler: function(newV) {
        if(newV.location && newV.money && newV.label) {
          this.isReady = true;
        } else {
          this.isReady = false;
        }
      },
      deep: true
    }
  },
  methods: {
    async fetchLabel() {
      const res = await this.$get(apiUrl.label, {}, { withLoading: false });
      this.labels = res.data;
    },
    initData() {
      const { data } = this.$store.getters['pay/editingRecord'];
      const form = {
        money: data.money,
        remark: data.remark,
        date: data.date,
        label: data.label,
        location: data.location,
        images: data.imgsUrl,
        type: data.type,
      }
      this.form = Object.assign({}, this.form, form);
    },
    onAddLabel() {
      this.showLabel = true;
    },
    onCancel() {
      this.showLabel = false;
    },
    onSelect(index) {
      const item = this.labels[index];
      this.form.label = item.name;
    },
    onConfirmLabel(action, done) {
      const { labelName } = this;
      if(action === 'cancel') {
        this.labelName = '';
        done();
        return;
      }
      if(!labelName) {
        this.$toast('请输入标签名称~');
        done(false);
        return;
      }
      const index = this.labels.findIndex(item => item.name === labelName.trim());
      if(index > -1) {
        this.$toast('标签已存在~');
        done(false);
        return;
      }
      this.labels.push({
        name: labelName
      });
      this.labelName = '';
      done();
    },
    onDatePick() {
      this.showDatePicker = true;
    },
    onClose() {
      this.showDatePicker = false;
    },
    onLocationPick() {
      this.showMap = true;
    },
    onConfirmLocation(data) {
      this.showMap = false;
      this.form.location = data;
    },
    onConfirmDate() {
      const { currentDate } = this;
      this.form.date = this.formatTime(currentDate);
      this.showDatePicker = false;
    },
    formatTime(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1;
      const day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
      const hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
      const minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
      return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    },
    async initLocation() {
      const AMap = await loadMap();
      const map = new AMap.Map('');
      map.plugin('AMap.Geolocation', () => {
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        });
        geolocation.getCurrentPosition((status, res) => {
          if(status === 'complete') {
            this.form.location = res.formattedAddress
          }
        });
      });
    },
    formatData(data) {
      let { images, money } = data;
      if(images.length) {
        images = images.map(i => i.content).join('||');
      } else {
        images = '';
      }
      return {
        ...data,
        images,
        money: +money,
      };
    },
    afterRead(file) {
      console.log(file)
    },
    onCreate() {
      if(!this.isReady) return;
      const form = this.formatData(this.form);
      const { id } = this;
      const type = getTimeType(form.date);
      if(id) {
        this.id = 0;
        this.$put(apiUrl.pay, { form, id })
          .then(res => {
            if(res.errno === 0) {
              this.$toast('修改成功~');
            }
            this.$store.commit('pay/setProp', {
              prop: 'editedRecord',
              value: {
                data: res.data,
                type,
              }
            });
            this.$router.back();
          })
      } else {
        this.$post(apiUrl.pay, {
          form
        }).then(res => {
          if(res.errno === 0) {
            this.$toast('创建成功~');
            this.$router.push('/home');
            this.$store.commit('pay/setProp', {
              prop: 'newRecord',
              value: {
                data: res.data,
                type,
              }
            });
          }
        }).catch(err => {
          this.$toast(`创建失败，请重试:${err}`);
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .add_pay {
    padding-top: 46px;
    box-sizing: border-box;
    min-height: 100vh;
    background: #fff;

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

      .add_radio_group {
        display: flex;
        padding-left: 16px;
        .px2vw(margin, 20, 0);

        .radio-type {
          width: 90px;
        }

        .van-radio:last-child {
          .px2vw(margin-left, 40);
        }
      }
    }
    .dater-pick {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
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

      .no-data {
        text-align: center;
        color: rgb(105, 105, 105);
      }

      .create_wrapper {
        .px2vw(margin-top, 30);
        color: @skyBlue;
      }
    }
    .bottom-btn-y {
      background: @green;
      color: #fff;
    }

    .bottom-btn-n {
      background: #fff;
      color: #333;
    }
  }
</style>