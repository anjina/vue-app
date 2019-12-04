<template>
  <div class="user">
    <nav-bar title="Nest" :needAvatar="false"></nav-bar>
    <div class="user_header">
      <div class="user_wrapper">
        <div class="left-content">
          <div class="avatar">
            <img :src="avatar ? (IMGPATH + avatar) : AVATARD" />
          </div>
          <div class="info">
            <div class="name">{{nickName}}</div>
            <div class="sign">{{sign}}</div>
          </div>
        </div>
        <div class="right-content" @click.stop="onDetail">
          <van-icon name="arrow" color="#F5F5F5" size="20" />
        </div>
      </div>
    </div>
    <div class="user_content">
      <info-row prop="我的消息" :hasNewMsg="hasNewMsg" @edit="onMessage"></info-row>
      <info-row prop="标签管理" @edit="onLabel"></info-row>
      <info-row prop="我的支出" @edit="onMyPay"></info-row>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import InfoRow from '@/components/UserInfoRow'
import { apiUrl } from '@/service/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    NavBar,
    InfoRow,
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters('user', ['avatar', 'nickName', 'sign', 'hasNewMsg', 'phoneNum']),
    ...mapGetters('constant', ['AVATARD', 'IMGPATH']),
  },
  methods: {
    onDetail() {
      this.$router.push('/detail');
    },
    async onMessage() {
      await this.$put(apiUrl.updateUser, { options: { hasNewMsg: 0 } });
      this.$store.commit('user/setProp', {
        prop: 'hasNewMsg',
        value: 0,
      })
      const { phoneNum } = this;
      this.$router.push({
        path: '/message',
        query: {
          id: phoneNum,
        }
      })
    },
    onLabel() {},
    onMyPay() {},
  },
}
</script>

<style lang="less">
.user {
  background: #fff;
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: 46px;
  .user_header {
    .px2vw(padding, 0, 30);
    background: @skyBlue;
    .user_wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .px2vw(padding, 40, 0);

      .left-content {
        flex: 1;
        display: flex;
        align-items: center;
        .avatar {
          position: relative;
          .px2vw(width, 150);
          .px2vw(height, 150);
          .px2vw(margin-right, 20);
          overflow: hidden;

          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            border-radius: 50%;
          }
        }
        .name {
          color: #fff;
          .ellipsisLn(1);
        }
        .sign {
          color: rgb(105, 105, 105);
          .px2vw(font-size, 28);
          .px2vw(margin-top, 10);
          .ellipsisLn(1);
        }
      }
      .right-content {
        .expandClickArea(15);
      }
    }
  }

  .user_content {
    box-sizing: border-box;
  }
}
</style>