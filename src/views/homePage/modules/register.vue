<template>
  <a-modal
    title="新用户注册"
    :width="650"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    centered
    wrapClassName="nav"
    :maskClosable="false"
    :destroyOnClose="true"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="horizontal">
        <a-row :gutter="24">
          <a-col :span="spanCol">
            <a-form-item label="所属机构：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-tree-select
                show-search
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="treeData"
                placeholder="请选择所属机构"
                v-decorator="['officeId', { rules: [{ required: true, message: '请选择党组织' }] }]"
                :filterTreeNode="filterTreeNodeData"
                @select="onselect"
              ></a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="职务：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-select
                style="width: 100%"
                placeholder="请选择职务"
                v-decorator="['dictStaffTechnicalPositionId', { rules: [{ required: true, message: '请选择职务' }] }]"
              >
                <a-select-option v-for="item in postobj" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="职称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-select
                style="width: 100%"
                placeholder="职称"
                v-decorator="[
                  'dictStaffTechnicalPositionQualificationId',
                  { rules: [{ required: true, message: '请选择职称' }] },
                ]"
              >
                <a-select-option v-for="item in academic" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="所属年级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-select
                style="width: 100%"
                placeholder="请选择所属年级"
                v-decorator="['dictStaffClassId', { rules: [{ required: true, message: '请选择所属年级' }] }]"
              >
                <a-select-option v-for="item in dictMeetingType" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="所授科目：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-select
                style="width: 100%"
                placeholder="请选择所授科目"
                v-decorator="['dictCommonSubjectId', { rules: [{ required: true, message: '请选择所授科目' }] }]"
              >
                <a-select-option v-for="item in subject" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="姓名：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-input
                placeholder="请输入姓名"
                v-decorator="['name', { rules: [{ required: true, message: '请输入姓名' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="手机号码：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-input placeholder="请输入手机号码" v-decorator="['phone', validatorRules.phone]" />
              <!-- { rules: [{ required: true, message: '请输入手机号码' }] } -->
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="邮箱地址：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-input
                placeholder="请输入邮箱地址"
                v-decorator="['email', { rules: [{ required: true, message: '请输入邮箱地址' }] }]"
              />
              <!--  , validatorRules.email -->
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="学历：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-select
                style="width: 100%"
                placeholder="请选择学历"
                v-decorator="['dictStaffEducationId', { rules: [{ required: true, message: '请选择学历' }] }]"
              >
                <a-select-option v-for="item in education" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="出生年月：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-date-picker
                style="width: 100%"
                v-decorator="['birthDate', { rules: [{ required: true, message: '请选择出生年月' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="密码设置：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-input placeholder="请输入密码" type="password" v-decorator="['password', validatorRules.password]" />
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="密码确认：" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
              <a-input
                placeholder="请确认密码"
                type="password"
                @blur="handleConfirmBlur"
                v-decorator="['passwordConfirmation', validatorRules.confirmpassword]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <div class="logbut">
              <a-button @click="handleOk" type="primary">注册</a-button>
            </div>
          </a-col>
          <a-col :span="spanCol">
            <div class="register">已有账号？去<span @click="handleCancel" class="registertext">登录</span></div>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { deleteAction, getAction, httpAction } from '@/api/manage' //接口方法
import { enCourse, dict, sysOffice } from '@/api/ajaxUrl.config.js' //接口
// import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
export default {
  name: 'TSAddEdit',
  components: {},
  data() {
    return {
      title: '新增', //当前弹窗标题
      visible: false, //当前弹窗是否显示
      disableSubmit: false, //确定按钮是否显示
      form: this.$form.createForm(this),
      spanCol: 24,
      confirmLoading: false, //页面和确定按钮的加载动画
      model: {}, //页面传来的数据
      dictMeetingType: [], //所属年级
      postobj: [], //职务
      academic: [], //职称
      education: [], //学历
      subject: [], //科目
      treeData: [], //机构
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake',
                },
              ],
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ],
            },
          ],
        },
      ],
      validatorRules: {
        password: {
          rules: [
            {
              // 注册密码
              required: true,
              // pattern: /S{6,}/,  (?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]) 密码由8位数字、大小写字母和特殊符号组成!
              pattern: /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
              message: '密码由数字和字母组成不得少于8位',
            },
            {
              validator: this.validateToNextPassword,
            },
          ],
        },
        confirmpassword: {
          rules: [
            {
              required: true,
              message: '请重新输入登陆密码!',
            },
            {
              validator: this.compareToFirstPassword,
            },
          ],
        },
        phone: {
          rules: [
            {
              required: true,
              pattern: /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/,
              message: '请输入正确的手机号',
            },
          ],
        },
        email: {
          rules: [
            {
              required: true,
              pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '请输入正确的邮箱格式',
            },
          ],
        },
      },
      url: {
        add: '/basic/basicStaff/register',
      },
    }
  },
  created() {
    this.getBasicInfo()
  },
  methods: {
    // 获取数据
    getBasicInfo() {
      getAction(sysOffice.findShopAreaTree).then((res) => {
        // console.log(res)
        this.treeData = res.result
      }) //机构
      getAction(dict.findDictForSelect, { tableName: 'dict_staff_class' }).then((res) => {
        this.dictMeetingType = res.result
      }) //年级
      getAction(dict.findDictForSelect, { tableName: 'dict_staff_technical_position' }).then((res) => {
        this.postobj = res.result
      }) //职务
      getAction(dict.findDictForSelect, { tableName: 'dict_staff_technical_position_qualification' }).then((res) => {
        this.academic = res.result
      }) //职称
      getAction(dict.findDictForSelect, { tableName: 'dict_staff_education' }).then((res) => {
        this.education = res.result
      }) //学历
      getAction(dict.findDictForSelect, { tableName: 'dict_common_subject' }).then((res) => {
        this.subject = res.result
      }) //科目
    },
    onselect(value, node, extra) {
      let record = extra.node.dataRef
    }, //机构点击
    filterTreeNodeData(inputValue, treeNode) {
      return treeNode.data.props.title.indexOf(inputValue) > -1
    },

    //   所属地区
    cascaderChange(value) {},
    add() {
      this.edit()
    },
    edit(model) {
      this.visible = true
      this.model = model
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'name'))
      })
    },
    close() {
      this.form.resetFields()
      this.confirmLoading = false
      this.disableSubmit = false
      this.visible = false
    },
    // 注册接口
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign({}, values)
          let httpurl = ''
          let method = ''

          httpurl = this.url.add
          method = 'post'
          // if (formData.id) {
          //   httpurl = this.url.edit
          //   method = 'put'
          // } else {
          // }
          formData.birthDate = formData.birthDate.format('YYYY-MM-DD hh:mm:ss')
          httpAction(httpurl, formData, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                this.$router.push({ name: '/' })
                that.close()
              } else {
                that.$message.warning(res.message)
                that.confirmLoading = false
              }
            })
            .catch((err) => {
              that.confirmLoading = false
              that.$message.warning(err)
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form
      const confirmpassword = form.getFieldValue('confirmpassword')
      console.log('confirmpassword==>', confirmpassword)
      if (value && confirmpassword && value !== confirmpassword) {
        callback('两次输入的密码不一样！')
      }
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    },
    // 确认密码
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
  },
}
</script>
<style lang="scss" scoped>
.logbut {
  margin: 5px 0 10px 0;
  button {
    width: 91%;
    margin-left: 29px;
  }
}
.register {
  text-align: center;
}
.registertext {
  color: #23b8ff;
  cursor: pointer;
}
// /deep/ .ant-select-selection--single {
//   height: 40px;
// }
</style>