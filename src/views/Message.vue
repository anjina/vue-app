<template>
  <div class="message">
    <nav-bar title="Message" :needAvatar="false"></nav-bar>
    <div class="message_list" v-if="list.length">
      <template v-for="(item, index) in list">
        <div class="message_item" @click.stop="onMegDetail(index)" :key="item.id">
          <img :src="item.fromInfo.avatar ? (IMGPATH + item.fromInfo.avatar) : AVATARD" alt="">
          <div class="van-hairline--bottom right-content">
            <div class="name">{{item.fromInfo.nickName}}</div>
            <div class="content" v-if="item.type === 1">{{item.fromInfo.nickName}}想和你...</div>
            <div class="content" v-else>{{item.message}}</div>
            <div class="time">{{item.createTime | parseTime}}</div>
          </div>
        </div>
      </template>
    </div>
    <div class="no-data" v-else>
      <van-divider :style="{ color: 'rgb(105, 105, 105)'}">暂无数据..</van-divider>
    </div>
    <van-dialog
      v-model="showDetail"
      title="消息卡片"
      show-cancel-button
      :show-confirm-button="currentDetail.type === 1"
      :confirm-button-text="confirmText"
      cancel-button-text="关闭"
      cancel-button-color="rgb(190, 190, 190)"
      :confirm-button-color="confirmText === '已接受' ? 'rgb(190, 190, 190)' : '#1989fa'"
      @confirm="onConfirm"
      transition="van-slide-up"
    >
      <p v-if="currentDetail.type === 1" class="dialog-content">
        {{currentDetail.fromInfo.nickName}}想和你成为情侣关系，是否愿意？
      </p>
      <p v-else class="dialog-content">{{currentDetail.message}}</p>
    </van-dialog>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import { apiUrl } from '@/service/api'
import { mapGetters } from 'vuex'
import { Divider, Dialog } from 'vant'
export default {
  data() {
    return {
      phoneNum: null,
      list: [],
      showDetail: false,
      currentDetail: {},
      confirmText: '我愿意',
    }
  },
  components: {
    NavBar,
    [Dialog.Component.name]: Dialog.Component,
    [Divider.name]: Divider,
  },
  computed: {
    ...mapGetters({
      nickName: 'user/nickName',
    }),
    ...mapGetters({
      IMGPATH: 'constant/IMGPATH',
      AVATARD: 'constant/AVATARD',
    })
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
      this.isLoading = false;
    },
    onMegDetail(index) {
      this.currentDetail = this.list[index];
      const { fromInfo: { lover }} = this.currentDetail
      if(lover) {
        this.confirmText = '已接受';
      }
      this.showDetail = true;
    },
    async onConfirm() {
      if(this.confirmText === '已接受') {
        return;
      }
      const { fromId, toId } = this.currentDetail
      await this.$put(apiUrl.updateUser, { options: { lover: fromId, storeId: `${fromId}_${toId}`}});
      await this.$put(apiUrl.updateUser, {
        user: fromId,
        options: { lover: toId, storeId: `${fromId}_${toId}` }
      });
      this.$store.commit('user/setProps', {
        props: {
          lover: fromId,
          storeId: `${fromId}_${toId}`,
        }
      });
      window.mySocket.startTalk({
        fromId: toId,
        toId: fromId,
        type: 2,
        message: `${this.nickName}已答应！恭喜~`
      });
      this.confirmText = '已接受';
      this.$toast('脱单成功！');
    }
  },
}
</script>

<style lang="less">
  .message {
    padding-top: 46px;
    box-sizing: border-box;
    min-height: 100vh;
    background: #fff;
    .message_list {
      height: 100%;
      .px2vw(padding-top, 20);
      .message_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .px2vw(padding, 0, 20);

        &:not(:first-child) {
          .px2vw(padding-top, 20);
        }
        img {
          .px2vw(width, 90);
          .px2vw(height, 90);
          .px2vw(margin-right, 20);
          border-radius: 50%;
          overflow: hidden;
        }

        .right-content {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          .px2vw(height, 105);
          justify-content: space-between;
          .px2vw(padding-bottom, 15);
          box-sizing: border-box;

          .content {
            color: @grey;
            .px2vw(font-size, 28);
            .ellipsisLn(1);
          }

          .time {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 1;
            color: @grey;
            .px2vw(font-size, 24);
          }
        }
      }
    }
    .no-data {
      .px2vw(padding, 40, 0);
    }
    .dialog-content {
      .px2vw(padding, 0, 30);
      text-indent: 2em;
    }
  }
</style>