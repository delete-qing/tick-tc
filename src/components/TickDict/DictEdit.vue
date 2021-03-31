<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
          <a-input
            placeholder
            v-decorator="['name', {rules: [{ required: true, message: '请输入名称！' }]}]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="labelComputed">
          <a-input placeholder v-decorator="['remark', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input placeholder v-decorator="['sort', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { dict } from '@/api/ajaxUrl.config'
import pick from 'lodash.pick'

export default {
  name: 'DictEdit',
  props: {
    dictId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      //当前查询表名，用于控制当前为风险等级设置时 说明 显示 为 金额
      newTableName:'',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        add: dict.add,
        edit: dict.edit
      },
      fany: ''
    }
  },
  computed: {
    labelComputed() {
      if(this.newTableName == 'dict_risk_level') {
        return '金额'
      } else {
        return '说明'
      }
    }
  },
  created() {},
  methods: {
    add(value) {
      this.newTableName = value
      this.edit({},this.newTableName)
    },
    edit(record,value) {
      this.newTableName = value
      this.fany = record.sign
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'id',
            'sign',
            'code',
            'name',
            'value',
            'tableName',
            'parentid',
            'sort',
            'isdefault',
            'remark'
          )
        )
        //时间格式化
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      // console.log(1111)
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          let formData = Object.assign(this.model, values)

          let datasource = {
            id: formData.id,
            name: formData.name,
            remark: formData.remark,
            sort: formData.sort,
            tableName: this.dictId
          }
          httpAction(httpurl, datasource, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
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
    }
  }
}
</script>

<style scoped>
</style>