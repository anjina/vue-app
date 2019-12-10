<template>
  <div class="map_container" v-if="show">
    <div id="map">
      <div class="map_info">
        <van-field
          v-model="currentLocation"
          autosize
          :row="1"
          disabled
          label="当前位置"
          left-icon="location-o"
          type="textarea"
          placeholder="请选择.."
        />
        <div class="input_box">
          <van-icon name="search" class="map_search" size="22" />
          <input id="map_input" v-model="value" placeholder="请输入.." @input="onInput" />
        </div>
      </div>
      <div class="map_back">
        <van-icon class-prefix="iconfont" name="back" size="30" color="#1989fa" @click.stop="onBack" />
      </div>
      <div class="map_confirm" @click.stop="onConfirm">确认</div>
    </div>
  </div>
</template>

<script>
import { loadMap } from '@/utils/loadMap'
import { Toast } from 'vant';
export default {
  data() {
    return {
      value: '',
      show: true,
      currentLocation: '定位中..',
    }
  },
  async created() {
    Toast.loading({
      message: '获取位置...',
      forbidClick: true
    });
    const AMap = await loadMap('3f3789735d7d50290d52d154ded286b6');
    this.map = new AMap.Map('map', {
      resizeEnable: true,
      zoom: 16,
    });
    AMap.plugin(['AMap.Geolocation', 'AMap.ToolBar', 'AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：5s
        buttonPosition:'LB',    //定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
        showCircle: false,
      });
      this.map.addControl(geolocation);
      geolocation.getCurrentPosition(status => {
        if(status !== 'complete') {
          Toast.clear();
          this.$toast('定位失败，请重新尝试');
        }
      });
      AMap.event.addListener(geolocation, "complete", (data) => {
        console.log(data)
        const { formattedAddress } = data
        this.currentLocation = formattedAddress;
        Toast.clear();
      });

      // add toolbar
      const toolbar = new AMap.ToolBar({
        liteStyle: true
      });
      this.map.addControl(toolbar);

      // 实例化Autocomplete
      this.initSearch = () => {
        const autoOptions = {
          city: '全国',
          input: 'map_input'
        }
        const autoComplete = new AMap.Autocomplete(autoOptions);

        const placeSearch = new AMap.PlaceSearch({
          map: this.map
        });  //构造地点查询类
        AMap.event.addListener(autoComplete, "select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);  //关键字查询查询
        }
        AMap.event.addListener(placeSearch, "markerClick", (e) => {
          const { data: { name, cityname} } = e
          this.currentLocation = `${cityname} · ${name}`
        });
      }
    });
  },
  destroyed() {
    this.map.destroy();
    this.map = null;
    this.initSearch = null;
  },
  methods: {
    onInput() {
      this.initSearch();
    },
    onBack() {
      this.show = false;
      this.$emit('close');
    },
    onConfirm() {
      this.$emit('confirm', this.currentLocation);
    }
  },
}
</script>

<style lang="less">
  .map_container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 99;

    #map {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .map_info { 
      position: absolute;
      .px2vw(right, 10);
      .px2vw(top, 10);
      z-index: 100;
      width: 100%;
      .px2vw(padding-left, 100);
      box-sizing: border-box;

      .input_box {
        position: relative;
        .px2vw(border-radius, 10);
        box-sizing: border-box;
        background: #fff;
        .px2vw(height, 60);
        .px2vw(line-height, 60);
        .px2vw(padding-left, 86);
      }
      .map_search {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
      }

      #map_input {
        width: 100%;
        outline: none;
        border: none;
      }
    }

    .map_confirm {
      position: absolute;
      .px2vw(width, 200);
      .px2vw(height, 60);
      .px2vw(line-height, 60);
      text-align: center;
      .px2vw(bottom, 20);
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
      background: @green;
      color: #fff;
      .px2vw(border-radius, 10);
    }
    .map_back {
      position: absolute;
      .px2vw(top, 5);
      .px2vw(left, 5);
      z-index: 100;
      .px2vw(width, 80);
      .px2vw(height, 80);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: @grey;
    }
  }
</style>