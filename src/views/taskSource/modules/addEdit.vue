<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    centered
    wrapClassName="navLastWidth"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">确定</a-button>
      <a-button key="back" @click="handleCancel">取消</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="vertical">
        <a-row :gutter="24">
          <a-col :span="spanCol">
            <a-form-item label="客户名称">
              <a-select
                v-decorator="['dictCustomerId', { rules: [{ required: true, message: '请选择客户名称！' }] }]"
                @change="getCPpageList"
                showSearch
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in dictCustomer"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <!-- <a-form-item label="产品名称">
                <a-select v-decorator="['dictProductId', { rules: [{ required: true, message: '请选择产品名称！' }] }]" >
                  <a-select-option v-for="item in dictProduct" :key="item.dictProductId" :value="item.dictProductId">{{item.dictProductName}}</a-select-option>
                </a-select>
            </a-form-item>-->
            <a-form-item label="产品名称">
              <a-select
                v-decorator="['dictProductId', { rules: [{ required: true, message: '请选择产品名称！' }] }]"
                showSearch
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in dictProduct"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="任务源类型">
              <a-select
                v-decorator="['dictTaskTypeId', { rules: [{ required: true, message: '请选择任务源类型！' }] }]"
                showSearch
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in dictTaskType"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="来源类型">
              <a-select
                v-decorator="['dictTaskFromTypeId', { rules: [{ required: true, message: '请选择来源类型！' }] }]"
                showSearch
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in dictTaskFromType"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="提出问题时间">
              <a-date-picker v-decorator="['askTime', {}]" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="期望解决时间">
              <a-date-picker v-decorator="['expectTime', {}]" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="spanCol">
            <a-form-item label="是否为项目紧急问题">
              <a-radio-group :defaultValue="0" v-decorator="['isUrgency', {}]">
                <a-radio :value="0">否</a-radio>
                <a-radio :value="1">是</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="任务描述">
              <a-textarea
                placeholder="请输入"
                :rows="4"
                v-decorator="['taskContent',{ rules: [{ required: true, message: '请输入任务描述！' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { httpAction, getAction } from '@/api/manage'
import { dict, enTaskInfo, buCustomerPordcut } from '@/api/ajaxUrl.config'
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
      spanCol: 8,
      confirmLoading: false, //页面和确定按钮的加载动画
      model: {}, //页面传来的数据
      //客户名称
      dictCustomer: [],
      //产品名称
      dictProduct: [],
      //任务源类型
      dictTaskType: [],
      //来源类型
      dictTaskFromType: [],
    }
  },
  mounted() {
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {
      this.getBasicInfo()
    })
  },
  methods: {
    moment,
    // 页面加载获取下拉列表数据
    getBasicInfo() {
      //客户名称字典
      getAction(dict.findDictForSelect, { tableName: 'dict_customer' })
        .then((res) => {
          this.dictCustomer = res.result
        })
        .catch((err) => {
          console.log('客户名称字典:', err)
        })
      //产品名称字典
      getAction(dict.findDictForSelect, { tableName: 'dict_product' })
        .then((res) => {
          this.dictProduct = res.result
        })
        .catch((err) => {
          console.log('产品名称字典:', err)
        })
      //任务源类型设置字典
      getAction(dict.findDictForSelect, { tableName: 'dict_task_type' })
        .then((res) => {
          this.dictTaskType = res.result
        })
        .catch((err) => {
          console.log('任务源类型设置字典:', err)
        })
      //来源类型
      getAction(dict.findDictForSelect, { tableName: 'dict_task_from_type' })
        .then((res) => {
          this.dictTaskFromType = res.result
        })
        .catch((err) => {
          console.log('来源类型:', err)
        })
    },
    add() {
      this.model = {}
      this.visible = true
    },
    edit(model) {
      this.visible = true
      if (model) {
        this.model = model
      } else {
        this.model = {}
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'dictCustomerId',
            'dictTaskTypeId',
            'dictTaskFromTypeId',
            'taskContent',
            'isUrgency',
            'dictProductId'
          )
        )
        this.form.setFieldsValue({ askTime: this.model.askTime ? moment(this.model.askTime) : '' })
        this.form.setFieldsValue({ expectTime: this.model.expectTime ? moment(this.model.expectTime) : '' })
        // this.getCPpageListEdit(this.model.dictCustomerId)
      })
    },
    close() {
      this.form.resetFields()
      this.disableSubmit = false
      this.confirmLoading = false
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          formData.askTime = formData.askTime ? moment(formData.askTime).format('YYYY-MM-DD') : ''
          formData.expectTime = formData.expectTime ? moment(formData.expectTime).format('YYYY-MM-DD') : ''
          let httpurl = ''
          let method = ''
          if (formData.id) {
            method = 'put'
            httpurl = enTaskInfo.edit
          } else {
            method = 'post'
            httpurl = enTaskInfo.add
          }
          httpAction(httpurl, formData, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message)
                that.form.resetFields()
                that.disableSubmit = false
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
    getCPpageList(value) {
      //   this.dictProduct = []
      //   this.form.resetFields(['dictProductId']);
      //   //产品名称设置字典
      //   getAction(buCustomerPordcut.queryCondition, { dictCustomerId: value }).then(res => {
      //     this.dictProduct = res.result
      //   }).catch((err) => {
      //     console.log('产品名称设置字典:',err)
      //   })
    },
    getCPpageListEdit(value) {
      //   this.dictProduct = []
      //   this.form.resetFields(['dictProductId']);
      //   //产品名称设置字典
      //   getAction(buCustomerPordcut.queryCondition, { dictCustomerId: value }).then(res => {
      //     this.dictProduct = res.result
      //     this.form.setFieldsValue({dictProductId: this.model.dictProductId ? this.model.dictProductId : "",});
      //   }).catch((err) => {
      //     console.log('产品名称设置字典:',err)
      //   })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>

<style scoped>
</style>