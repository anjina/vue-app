<template>
  <div class="message">
    <nav-bar title="Message" :needAvatar="false"></nav-bar>
    <div class="message_list" v-if="list.length">
      <div class="message_item" v-for="item in list" :key="item.id">
        <img :src="item.fromInfo.avatar || avatarD" alt="">
        <div class="right-content">
          <div class="name">{{item.fromInfo.nickName}}</div>
          <div class="content" v-if="item.type === 0">{{item.message}}</div>
          <div class="content" v-if="item.type === 1">{{item.fromInfo.nickName}}想和你..</div>
          <div class="time">{{item.createTime}}</div>
        </div>
      </div>
    </div>
    <div class="no-data" v-else>
      <van-divider :style="{ color: 'rgb(105, 105, 105)'}">暂无数据..</van-divider>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import { apiUrl } from '@/service/api'
export default {
  data() {
    return {
      phoneNum: null,
      list: [],
      avatarD: require('../assets/avatar.png'),
    }
  },
  components: {
    NavBar,
  },
  mounted() {
    const id = this.$route.query.id;
    this.phoneNum = id;
    this.fetchData();
  },
  methods: {
    async fetchData () {
      const { phoneNum } = this;
      const res = await this.$get(apiUrl.getMessage, { phoneNum });
      this.list = res.data;
    }
  },
}
</script>

<style lang="less">
  .message {
    min-height: 100vh;
    box-sizing: border-box;
    background: #fff;
    .message_list {
      .message_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .px2vw(padding, 40, 20);

        img {
          .px2vw(width, 100);
          .px2vw(height, 100);
          .px2vw(margin-right, 20);
          border-radius: 50%;
          overflow: hidden;
        }

        .right-content {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          .px2vw(height, 100);
          justify-content: space-between;
          .px2vw(padding-bottom, 15);

          .time {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 1;
          }
        }
      }
    }
    .no-data {
      .px2vw(padding, 40, 0);
    }
  }
</style>