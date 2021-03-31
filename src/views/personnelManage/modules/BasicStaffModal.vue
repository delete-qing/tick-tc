<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="850"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    centered
    cancelText="关闭"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">返回</a-button>
      <a-button key="submit" type="primary" @click="handleOk">保存</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="horizontal">
        <a-row :gutter="24">
          <a-col :lg="12">
            <a-form-item label="姓名：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-input v-decorator="['name']" />
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="所属机构：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-tree-select
                show-search
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="treeData"
                v-decorator="['officeId']"
                :filterTreeNode="filterTreeNodeData"
                @select="onselect"
              ></a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="职务：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-select style="width: 100%" v-decorator="['dictStaffTechnicalPositionId']">
                <a-select-option v-for="item in postobj" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="职称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-select style="width: 100%" v-decorator="['dictStaffTechnicalPositionQualificationId']">
                <a-select-option v-for="item in academic" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="所属年级：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-select style="width: 100%" v-decorator="['dictStaffClassId']">
                <a-select-option v-for="item in dictMeetingType" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="所授科目：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-select style="width: 100%" v-decorator="['dictCommonSubjectId']">
                <a-select-option v-for="item in subject" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :lg="12">
            <a-form-item label="手机号码：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-input v-decorator="['phone', validatorRules.phone]" />
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="邮箱地址：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-input v-decorator="['email', validatorRules.email]" />
              <!-- @blur="Change" -->
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="学历：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-select style="width: 100%" v-decorator="['dictStaffEducationId']">
                <a-select-option v-for="item in education" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="出生年月：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-date-picker style="width: 100%" v-decorator="['birthDate']" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAction, httpAction, putAction } from '@/api/manage'
import { doMian } from '@/api/api'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import pick from 'lodash.pick'
import moment from 'moment'
import { basicData, dict, workInstructions, sysOffice, basicStaff } from '@/api/ajaxUrl.config.js'
import { mapGetters } from 'vuex'
export default {
  name: 'BasicStaffModal',
  data() {
    return {
      // headers: {},
      // uploadLoading: false,
      // styleTypeBool: true,
      title: '操作',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isFound: false,
      treeData: [], //所属机构树结构数据
      postobj: [], //职务
      academic: [], //职称
      dictMeetingType: [], //所属年级
      subject: [], //科目
      education: [], //学历
      model: {}, //当前人员的数据
      newID: '', //当前人员的id

      validatorRules: {
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
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.getBasicInfo() //下拉列表 数据
    })
  },
  computed: {},
  methods: {
    moment,
    ...mapGetters(['userInfo']),
    edit(record) {
      this.visible = true
      this.newID = record.id
      console.log(record.id)
      this.model = Object.assign({}, record)

      this.$nextTick(() => {
        // 赋值上去
        this.form.setFieldsValue(
          pick(
            this.model,
            'name', //姓名
            'phone', //手机号码
            'email', //邮箱地址
            'dictStaffEducationId', //学历
            'officeId', //所属机构
            'dictStaffTechnicalPositionId', //职务
            'dictStaffClassId', //所属年级
            'dictCommonSubjectId', //所授科目
            'dictStaffTechnicalPositionQualificationId' //职称
          )
        )
        this.form.setFieldsValue({
          birthDate: moment(this.model.birthDate),
        })
      })
    },
    close() {
      this.visible = false
    },
    // 点击确定按钮
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          var forms = values
          console.log(forms)
          var params = {
            id: this.newID,
          }
          this.model = Object.assign(params, forms)
          putAction(basicStaff.saveAndUpdate, this.model).then((res) => {
            if (res.success == true) {
              this.$message.success('保存成功！')
              this.confirmLoading = false
              this.visible = false
              that.$emit('ok')
            } else {
              if (res.result.phone == 0) {
                this.$message.warning('手机号重复')
                this.confirmLoading = false
              } else if (res.result.email == 0) {
                this.$message.warning('邮箱重复')
                this.confirmLoading = false
              } else {
                this.$message.warning(res.message)
                this.confirmLoading = false
                this.visible = false
              }
            }
          })
        }
      })
    },
    // 下拉框的数据
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
    // 取消按钮
    handleCancel() {
      this.close()
    },
    onselect(value, node, extra) {
      let record = extra.node.dataRef
    },
    filterTreeNodeData(inputValue, treeNode) {
      return treeNode.data.props.title.indexOf(inputValue) > -1
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
.nav .ant-modal .ant-modal-body {
  height: calc(100vh - 300px);
}
.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.ant-alert-with-description.ant-alert-no-icon {
  padding: 8px !important;
}
@media (min-width: 992px) {
  /deep/ .ant-col-lg-12 {
    width: 49%;
  }
}
</style>
