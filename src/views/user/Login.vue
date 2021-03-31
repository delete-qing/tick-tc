<template>
  <div class="main">
    <a-form
      class="user-layout-login"
      ref="formLogin"
      :autoFormCreate="
        (form) => {
          this.form = form
        }
      "
      id="formLogin"
    >
      <a-form-item
        fieldDecoratorId="username"
        :fieldDecoratorOptions="{ rules: [{ validator: this.handleUsernameOrEmail }], validateTrigger: 'change' }"
      >
        <a-input size="large" type="text" class="tick-input" placeholder="输入帐号">
          <a-icon slot="prefix" class="loginText" type="user" :style="{ display: 'none' }" />
        </a-input>
      </a-form-item>
      <a-form-item
        fieldDecoratorId="password"
        :fieldDecoratorOptions="{ rules: [], validateTrigger: 'blur' }"
        style="position: relative"
      >
        <a-input size="large" type="password" class="tick-input" autocomplete="false" placeholder="输入密码">
          <a-icon slot="prefix" class="loginText" type="lock" :style="{ display: 'none' }" />
        </a-input>
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button tick-login-button"
          :loading="loginBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="loginBtn"
        ></a-button>
      </a-form-item>
      <div style="margin-bottom: 10%; margin-top: -5px">
        <!-- <a-checkbox style="font-size:12px;line-height:20px;color:#cccccc" v-model="formLogin.rememberMe">记住密码</a-checkbox> -->
        <!-- <router-link :to="{ name: 'recover', params: { user: 'aaa'} }" class="forge-password" style="float: right;">
            忘记密码
        </router-link>-->
      </div>
      <!-- <a-form-item style="margin-bottom:5%">
      </a-form-item> -->

      <!-- <div class="user-login-other">
        <span>其他登陆方式</span>
        <a><a-icon class="item-icon" type="alipay-circle"></a-icon></a>
        <a><a-icon class="item-icon" type="taobao-circle"></a-icon></a>
        <a><a-icon class="item-icon" type="weibo-circle"></a-icon></a>
        <router-link class="register" :to="{ name: 'register' }">
          注册账户
        </router-link>
      </div>-->
    </a-form>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>

    <!-- <iframe style='display:none;width:0;height:0;' src="/loginOld.html"></iframe> -->
    <!-- <form style="display:none;" id="loginOld" action="/bigdata/a/login" method="post" >
        <input id="username" type="text" name="username" value="admin" />
        <input name="password" type="password" value="123456" />
    </form>-->
  </div>
</template>

<script>
//import md5 from "md5"
import api from '@/api'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { loginOld } from "@/api/login"

export default {
  components: {
    TwoStepCaptcha,
  },
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // loginOld:false,
      // loginNew:false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: null,
      state: {
        time: 60,
        smsSendBtn: false,
      },
      formLogin: {
        username: '',
        password: '',
        captcha: '',
        mobile: '',
        rememberMe: true,
      },
    }
  },
  created() {
    window.localStorage.setItem('loginParams', false)
    Vue.ls.remove(ACCESS_TOKEN)
    var _this = this

    // window.addEventListener('message', function (e) {
    //        var flag = e.data;
    //         //找data里面的变量 赋值
    //        flag && (_this.loginOld=true);
    //   }, false);
    // update-begin- --- author:scott ------ date:20190225 ---- for:暂时注释，未实现登录验证码功能
    //      this.$http.get('/auth/2step-code')
    //        .then(res => {
    //          this.requiredTwoStepCaptcha = res.result.stepCode
    //        }).catch(err => {
    //          console.log('2step-code:', err)
    //        })
    // update-end- --- author:scott ------ date:20190225 ---- for:暂时注释，未实现登录验证码功能
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        this.loginType = 0
      } else {
        this.loginType = 1
      }
      callback()
    },
    handleTabClick(key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit() {
      let that = this
      let flag = false

      let loginParams = {
        remember_me: that.formLogin.rememberMe,
      }

      // 使用账户密码登陆
      if (that.customActiveKey === 'tab1') {
        that.form.validateFields(['username', 'password'], { force: true }, (err, values) => {
          if (!err) {
            flag = true
            loginParams[!that.loginType ? 'email' : 'username'] = values.username
            //loginParams.password = md5(values.password)
            loginParams.password = values.password
          }
        })
      }
      // // 使用手机号登陆
      // } else {
      //   that.form.validateFields([ 'mobile', 'captcha' ], { force: true }, (err, values) => {
      //     if (!err) {
      //       flag = true
      //       loginParams = Object.assign(loginParams, values)
      //     }
      //   })
      // }

      // if (!flag) return

      // that.loginBtn = true

      // var currentHash = location.hash;
      //   // 选中iframe的contentWindow属性
      // var iframe = document.getElementById("child").contentWindow;
      //  // 你要给那个子页面发  路径

      // // console.log(this.$refs.iframe.contentWindow)
      // // console.log(this.$refs.iframe.contentWindow.location.href)

      // var childDomain = 'http://192.168.1.119:8089/a/login'
      // //你要给子页面传的值
      // var msg = {user:'admin',password:'xxzx'}
      //   //传值
      // iframe.postMessage(msg,childDomain);

      that
        .Login(loginParams)
        .then(() => {
          // that.formOld.submit();
          // var oldLoginParams = loginParams;
          // oldLoginParams.flag = true;
          // window.tickStorage.setItem('loginParams',oldLoginParams);
          // setTimeout(function(){
          that.loginSuccess()
          // },1000);
        })
        .catch((err) => {
          that.requestFailed(err)
        })
    },
    getCaptcha(e) {
      e.preventDefault()
      let that = this
      this.form.validateFields(['mobile'], { force: true }, (err) => {
        if (!err) {
          this.state.smsSendBtn = true

          let interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 60
              that.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          this.$http
            .post(api.SendSms, { mobile: that.formLogin.mobile })
            .then((res) => {
              setTimeout(hide, 2500)
              this.$notification['success']({
                message: '提示',
                description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                duration: 8,
              })
            })
            .catch((err) => {
              setTimeout(hide, 1)
              clearInterval(interval)
              that.state.time = 60
              that.state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess() {
      this.loginBtn = false
      console.log(this.$router)
      this.$router.push({ name: '/' })
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`,
      })
    },
    requestFailed(err) {
      this.$notification['error']({
        message: '登录失败',
        description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
        duration: 4,
      })
      this.loginBtn = false
    },
  },
  mounted() {
    var _this = this

    // _this.formOld = document.getElementById("loginOld");
  },
}
</script>

<style lang="scss" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>