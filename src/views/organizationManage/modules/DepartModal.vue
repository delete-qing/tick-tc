<template>
  <a-modal
    :title="title"
    :width="800"
    :ok="false"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="nav"
    centered
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :hidden="seen" label="上级部门" hasFeedback>
          <a-tree-select
            style="width: 100%"
            :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
            :treeData="departTree"
            v-model="model.parentId"
            placeholder="请选择上级部门"
            disabled
          ></a-tree-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构名称" :hidden="false" hasFeedback>
          <a-input id="departName" placeholder="请输入机构/部门名称" v-decorator="['name', validatorRules.name]" />
        </a-form-item>
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="归属专业">
          <a-select
            placeholder="请选择"
            v-decorator="['dictOfficeProfessionId', {  }]"
          >
            <a-select-option
              v-for="item in officeProfession"
              :key="item.id"
              :value="item.id"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item> -->
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="部门类型">
          <a-select
            placeholder="请选择"
            v-decorator="['differentiate', { 
              rules: [{ required: true, message: '请选择部门类型' }]
             }]"
          >
            <a-select-option value="段领导">段领导</a-select-option>
            <a-select-option value="机关科室">机关科室</a-select-option>
            <a-select-option value="车间">车间</a-select-option>
            <a-select-option value="班组">班组</a-select-option>
          </a-select>
        </a-form-item> -->
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门主管">
          <a-select placeholder="请选择" v-decorator="['officeDirectorId', {}]">
            <a-select-option v-for="(item, index) in personal" :key="index" :value="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item> -->
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否高铁">
          <a-select
            placeholder="请选择"
            v-decorator="['highSpeedRail', { 
              rules: [{ required: true, message: '请选择是否高铁' }]
             }]"
          >
            <a-select-option value="0">是</a-select-option>
            <a-select-option value="1">否</a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="电话">
          <a-input placeholder="请输入电话" v-decorator="['phone', validatorRules.phone]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number v-decorator="['sort', { initialValue: 0 }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
          <a-textarea placeholder="请输入备注" v-decorator="['memo', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { queryDepartTreeList } from '@/api/api'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { dict } from '@/api/ajaxUrl.config.js'

export default {
  name: 'SysDepartModal',
  components: { ATextarea },
  data() {
    return {
      departTree: [],
      orgTypeData: [],
      phoneWarning: '',
      departName: '',
      title: '操作',
      seen: false,
      visible: false,
      condition: false,
      disableSubmit: false,
      model: {},
      menuhidden: false,
      menuusing: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      personal: [],
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        name: { rules: [{ required: true, message: '请输入机构/部门名称!' }] },
        orgCode: { rules: [{ required: true, message: '请输入机构编码!' }] },
        phone: { rules: [{ validator: this.validateMobile }] },
      },
      officeId: '',
      officeProfession: [],
      url: {
        add: '/sys/sysOffice/add',
      },
    }
  },
  created() {
    // 归属专业
    // getAction(dict.officeProfession).then((res) => {
    //   this.officeProfession = res.result
    // })
  },
  methods: {
    loadTreeData() {
      var that = this
      queryDepartTreeList().then((res) => {
        if (res.success) {
          that.departTree = []
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            that.departTree.push(temp)
            // console.log(temp.id);
          }
        }
      })
    },
    // 人员
    person(depart) {
      let officeId = depart != null ? depart.toString().split('-')[1] : ''
      // 人员
      getAction('/basic/basicStaff/queryByOfficeId', {
        officeId: officeId,
      })
        .then((res) => {
          // console.log(res)
          this.personal = res
        })
        .catch((err) => {
          // console.log(err)
        })
    },
    add(depart) {
      if (depart) {
        this.seen = false
        this.person(depart)
      } else {
        this.seen = true
      }
      this.edit(depart)
      // console.log(depart);
    },
    edit(record) {
      // console.log(record);
      this.form.resetFields()
      this.model = Object.assign({}, {})
      this.visible = true
      this.loadTreeData()
      this.model.parentId = record != null ? record.toString().split('-')[1] : ''
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'name',
            'departNameEn',
            'departNameAbbr',
            'sort',
            'description',
            'orgType',
            'orgCode',
            'phone',
            // "fax",
            // "address",
            'memo',
            'status',
            'delFlag',
            'dictOfficeProfessionId',
            'differentiate',
            'officeDirectorId',
            'highSpeedRail'
          )
        )
      })
    },
    close() {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          //时间格式化
          // console.log(formData);
          httpAction(this.url.add, formData, 'post')
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadTreeData()
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
  },
}
</script>

<style scoped>
</style>