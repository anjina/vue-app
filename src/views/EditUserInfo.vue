<template>
  <div class="edit_user">
    <nav-bar :title="type | getTitle"></nav-bar>
    <div class="edit_user_container">
      <div v-if="type === 0">
        <van-field v-model.trim="newNickName" placeholder="请输入昵称.." clearable maxlength = 20 />
      </div>
      <div v-if="type === 1">
        <van-cell-group>
          <van-field
            v-model="newSign"
            rows="2"
            autosize
            label=""
            label-width="0"
            type="textarea"
            maxlength="30"
            placeholder="请输入个性签名.."
            clearable
            show-word-limit
          />
        </van-cell-group>
      </div>
      <div v-if="type === 4 && password">
        <van-cell-group>
          <van-field
            v-model="inputPassword"
            required
            label="原密码"
            placeholder="请输入原密码.."
          />

          <van-field
            v-model="newPassword"
            type="password"
            label="密码"
            placeholder="请输入新密码.."
            required
          />

          <van-field
            v-model="newTPassword"
            type="password"
            label="确认"
            placeholder="请确认新密码.."
            required
          />
        </van-cell-group>
      </div>
      <div v-if="type === 4 && !password">
        <van-cell-group>
          <van-field
            v-model="newPassword"
            type="password"
            label="密码"
            placeholder="请输入新密码.."
            required
          />

          <van-field
            v-model="newTPassword"
            type="password"
            label="确认"
            placeholder="请确认新密码.."
            required
          />
        </van-cell-group>
      </div>
    </div>
    <bottom-btn content="Save" @confirm="onSave" external="bottom-btn"></bottom-btn>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import BottomBtn from '@/components/BottomBtn'
import { Toast } from 'vant'
import { mapGetters } from 'vuex'
import { apiUrl } from '@/service/api'
export default {
  components: {
    NavBar,
    BottomBtn,
  },
  mounted() {
    const type = this.$route.query.type;
    this.type = type ? parseInt(type) : 0;
    this.newNickName = this.nickName;
    this.newSign = this.sign;
  },
  data() {
    return {
      type: 0,
      inputPassword: '', // 输入的密码
      newPassword: '', // 新密码
      newTPassword: '', // 确认新密码
      newNickName: '',
      newSign: '',
    }
  },
  computed: {
    ...mapGetters({
      nickName: 'user/nickName',
      sign: 'user/sign',
      password: 'user/password',
    }),
  },
  filters: {
    getTitle(type) {
      switch (type) {
        case 0:
          return '昵称';
        case 1:
          return '个性签名';
        case 4: 
          return '密码';
        default:
          return 'Edit';
      }
    }
  },
  methods: {
    async onSave() {
      const {
        type,
        newNickName,
        newSign,
        password,
        inputPassword,
        newPassword,
        newTPassword
      } = this

      switch (type) {
        case 0:
          if (!newNickName) {
            this.$toast('昵称不能为空');
            break;
          }
          if(newNickName.length > 20) {
            this.$toast('最大长度不能超过20字~');
            break;
          }
          await this.$put(apiUrl.updateUser, {
            options: {
              nickName: newNickName
            }
          }).catch(e => this.$toast(`http: ${e}`));
          this.$store.commit('user/setProp', {
            prop: 'nickName',
            value: newNickName,
          });
          Toast({
            message: '修改成功✌️',
            duration: 1000,
          });
          setTimeout(() => {
            this.$router.back();
          });
          break;
        case 1:
          await this.$put(apiUrl.updateUser, {
            options: {
              sign: newSign
            }
          }).catch(e => this.$toast(`http: ${e}`));
          this.$store.commit('user/setProp', {
            prop: 'sign',
            value: newSign,
          });
          Toast({
            message: '修改成功✌️',
            duration: 1000,
          });
          setTimeout(() => {
            this.$router.back();
          });
          break;
        case 4:
          // 修改密码
          if(password) {
            const props = ['inputPassword', 'newPassword', 'newTPassword'];
            if(props.some(prop => !this[prop])) {
              this.$toast('请填写完整密码项~');
              break;
            }
            if(inputPassword !== password) {
              this.$toast('原密码错误😕~');
              break;
            }
            if(newPassword !== newTPassword) {
              this.$toast('新密码不一致😶~');
              break;
            }
          } else {
            const props = ['newPassword', 'newTPassword'];
            if(props.some(prop => !this[prop])) {
              this.$toast('请填写完整密码项~');
              break;
            }
            if(newPassword !== newTPassword) {
              this.$toast('新密码不一致😶~');
              break;
            }
          }
          await this.$put(apiUrl.updateUser, {
            options: {
              password: newPassword
            }
          }).catch(e => this.$toast(`http: ${e}`));
          Toast({
            message: '修改成功✌️',
            duration: 1000,
          });
          this.$store.commit('user/setProp', {
            prop: 'password',
            value: newPassword,
          });
          setTimeout(() => {
            this.$router.back();
          });
          break;
        default:
          // 不存在
          break;
      }
    },
  }
}
</script>

<style lang="less">
  .edit_user {
    height: 100vh;
    background: @skyBlue;
    padding-top: 46px;
    box-sizing: border-box;

    .edit_user_container {
      .px2vw(padding, 30, 30);
    }

    .bottom-btn {
      color: #333;
      background: #fff;
    }
  }
</style>