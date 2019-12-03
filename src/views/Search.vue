<template>
  <div class="search">
    <nav-bar title="约TA🙋‍♀️"></nav-bar>
    <van-search
      v-model.trim="listQuery.query.keyword"
      placeholder="请输入心仪的TA😍"
      show-action
      shape="round"
      background="pink"
      @search="onSearch"
    >
      <div slot="action" @click="onSearch">匹配</div>
    </van-search>
    <van-collapse v-model="activeNames" accordion>
      <van-collapse-item title="为你推荐😉😉😉" name="1">
        <div v-if="!recommendList.length" class="no-data">
          注孤生😭😭😭
        </div>
        <van-grid :border="false" :column-num="6" v-else>
          <van-grid-item v-for="item in recommendList" :key="item.id" class="each-lover" @click.stop="onDetail(item)">
            <van-image :src="item.avatar || loverD" />
          </van-grid-item>
        </van-grid>
      </van-collapse-item>
      <van-collapse-item title="匹配结果☺️☺️☺️" name="2">
        <div v-if="!searchList.length" class="no-data">
          快开始匹配呀👅👅👅
        </div>
        <van-grid :border="false" :column-num="6" v-else>
          <van-grid-item v-for="item in searchList" :key="item.id" class="each-lover" @click.stop="onDetail(item)">
            <van-image :src="item.avatar || loverD" />
          </van-grid-item>
        </van-grid>
      </van-collapse-item>
    </van-collapse>

    <van-dialog
      v-model="showDetail"
      title="资料卡"
      show-cancel-button
      confirm-button-text="牵手🔥"
      cancel-button-text="再看看"
      confirm-button-color="pink"
      @confirm="onLove"
      class="favorite-dialog"
    >
      <div class="favorite-image-wrapper">
        <img :src="favoriteInfo.avatar || loverD">
      </div>
      <van-cell-group style="margin-bottom: 20px;">
        <van-cell title="昵称" :value="favoriteInfo.nickName" />
        <van-cell title="签名" :value="favoriteInfo.sign" />
        <van-cell title="电话" :value="favoriteInfo.phoneNum" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { apiUrl } from '@/service/api'
import NavBar from '@/components/NavBar'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      value: '',
      activeNames: '1',
      recommendList: [],
      searchList: [],
      listQuery: {
        query: {
          keyword: null
        }
      },
      loverD: require('../assets/loverD.png'),
      showDetail: false,
      favoriteInfo: {},
    }
  },
  components: {
    NavBar
  },
  computed: {
    ...mapGetters({
      uid: 'user/phoneNum',
      lover: 'user/lover',
    })
  },
  mounted() {
    this.fetchData(0);
  },
  methods: {
    async fetchData(type) {
      const res = await this.$get(apiUrl.getLovers, this.listQuery);
      res.data = res.data.filter(item => item.phoneNum !== this.uid)
      if(type) {
        this.searchList = res.data;
        this.activeNames = '2';
        this.listQuery.query.keyword = ''
      } else {
        this.recommendList = res.data;
        this.activeNames = '1';
      }
    },
    onSearch() {
      const { listQuery: { query: { keyword: value } } } = this;
      if(!value) {
        this.$toast('请先输入查找内容哦~');
        return;
      }
      this.searchList = this.fetchData(1);
    },
    onBack() {
      this.$router.back();
    },
    onDetail(item) {
      this.favoriteInfo = item;
      this.showDetail = true;
    },
    onLove() {
      if(this.lover) {
        this.$toast('要专一哦~');
        return;
      }
      const { phoneNum: lover } = this.favoriteInfo;
      const { uid } = this
      window.mySocket.startTalk(
        {
          fromId: uid,
          toId: lover,
          type: 1
        }
      );
    },
  },
}
</script>

<style lang="less">
  .search {
    background: @pink;
    min-height: 100vh;
    box-sizing: border-box;
    .no-data {
      .px2vw(font-size, 30);
    }
    .each-lover {
      img {
        border-radius: 50%;
      }
    }
    .favorite-dialog {
      .favorite-image-wrapper {
        text-align: center;
        .px2vw(margin, 20, 0);

        img {
          .px2vw(width, 250);
          .px2vw(height, 250);
          overflow: hidden;
          border-radius: 50%;
        }
      }
    }
  }
</style>