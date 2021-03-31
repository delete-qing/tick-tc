<template>
  <a-modal
    title="登录"
    :width="486"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    centered
    wrapClassName="login"
    :maskClosable="false"
    :destroyOnClose="true"
    :footer="null"
    :bodyStyle="{ padding: '42px' }"
  >
    <!-- <a-spin :spinning="confirmLoading"> -->
    <a-form v-if="accountStatus == 0" :form="form" layout="vertical" ref="formLogin" id="formLogin">
      <a-row :gutter="24">
        <a-col :span="spanCol">
          <a-form-item>
            <a-input
              placeholder="请输入注册手机号"
              v-decorator="['username', { rules: [{ required: true, message: '请输入注册手机号' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="spanCol">
          <a-form-item>
            <a-input
              type="password"
              placeholder="请输入密码"
              v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="spanCol">
          <div class="logbut">
            <a-button :loading="loading" @click="handleOk" type="primary">登录</a-button>
          </div>
        </a-col>
        <a-col :span="spanCol">
          <div class="register">没有账号？去<span @click="registerClick" class="registertext">注册</span></div>
        </a-col>
      </a-row>
    </a-form>
    <div v-if="accountStatus == 1" class="underReview">
      <div class="logCon">
        <div class="logImg">
          <img src="../weitonggou.png" alt="" />
        </div>
        <div class="logBut">当前账号审核未通过！</div>
      </div>
    </div>
    <div v-if="accountStatus == 2" class="underReview">
      <div class="logCon">
        <div class="logImg">
          <img src="../shehe.png" alt="" />
        </div>
        <div class="logBut">当前账号审核中，请稍等！</div>
      </div>
    </div>
    <!-- </a-spin> -->
    <register ref="register"></register>
    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </a-modal>
</template>
<script>
import { httpAction, getAction } from '@/api/manage'
import api from '@/api'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import pick from 'lodash.pick'
import register from './register'
import Vue from 'vue'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'TSAddEdit',
  components: {
    register,
    TwoStepCaptcha,
  },
  data() {
    return {
      title: '新增', //当前弹窗标题
      visible: false, //当前弹窗是否显示
      disableSubmit: false, //确定按钮是否显示
      form: this.$form.createForm(this),
      spanCol: 24,
      accountStatus: 0,
      confirmLoading: false, //页面和确定按钮的加载动画
      loading: false,
      model: {}, //页面传来的数据
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
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
    var lett = this
    // document.onkeydown = function (e) {
    //   var key = window.event.keyCode
    //   if (key == 13) {
    //     lett.handleOk()
    //   }
    // }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    add() {
      this.edit()
    },
    edit(model) {
      this.visible = true
      this.accountStatus = 0
      this.model = model
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'name', 'sign', 'sort'))
      })
    },
    close() {
      this.form.resetFields()
      this.confirmLoading = false
      this.disableSubmit = false
      this.visible = false
    },
    handleOk() {
      this.confirmLoading = true
      this.loading = true
      let that = this
      // this.accountStatus = 1
      let loginParams = {}
      that.form.validateFields(['username', 'password'], { force: true }, (err, values) => {
        if (!err) {
          loginParams.username = values.username
          //loginParams.password = md5(values.password)
          loginParams.password = values.password
        }
      })
      that
        .Login(loginParams)
        .then(() => {
          this.loading = false
          this.confirmLoading = false
          that.loginSuccess()
        })
        .catch((err) => {
          this.loading = false
          this.confirmLoading = false
          that.requestFailed(err)
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
      console.log(err)
      if (err.message == '该用户审核中') {
        this.accountStatus = 2
      } else if (err.message == '该用户审核未通过') {
        this.accountStatus = 1
      } else {
        this.$notification['error']({
          message: '登录失败',
          description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
          duration: 4,
        })
      }

      this.loginBtn = false
    },
    handleCancel() {
      this.close()
    },
    //   注册
    registerClick() {
      this.$refs.register.add()
    },
  },
}
</script>
<style lang="scss" scoped>
.logbut {
  margin: 5px 0 10px 0;
  button {
    height: 50px;
  }
}
.register {
  text-align: center;
}
.registertext {
  color: #23b8ff;
  cursor: pointer;
}
.underReview {
  .logCon {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .logText {
    text-align: center;
    letter-spacing: 0px;
    color: #999999;
    font-size: 17px;
  }
  .logImg {
    text-align: center;
    margin: 25px 0;
  }
  .logBut {
    text-align: center;
  }
}

/deep/ .ant-spin-nested-loading {
  margin: 10px 0;
}
/deep/ .ant-modal-title {
  font-weight: 600 !important;
  color: #333333;
}
/deep/ .ant-input {
  height: 42px;
}
/deep/ .ant-btn {
  width: 100%;
}
/deep/ .ant-form-vertical .ant-form-item {
  margin-bottom: 5px;
}
/deep/ .ant-form-vertical .ant-form-item {
  margin: 15px;
}
/deep/ .logbut button {
  height: 46px;
}
</style>