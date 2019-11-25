<template>
  <div class="login">
    <div class="login_password">
      <!-- 密码输入框 -->
      <van-password-input
        :value="value"
        info="密码为 6 位数字"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
      />
    </div>

    <!-- 数字键盘 -->
    <van-number-keyboard
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"
    />
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'login',
  components: {
  },
  data() {
    return {
      value: '',
      showKeyboard: false
    }
  },
  methods: {
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    }
  }
}
</script>

<style lang="less">
.login {
  width: 100%;
  background: @pink;
  height: 100vh;
  box-sizing: border-box;

  .login_password {
    .px2vw(padding-top, 200);
  }
}
</style>
