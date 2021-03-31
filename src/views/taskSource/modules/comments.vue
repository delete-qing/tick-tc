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
    wrapClassName="navLastWidth "
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button v-if="state" key="submit" type="primary" :loading="confirmLoading" @click="handleOk">批示</a-button>
      <a-button key="back" @click="handleCancel">取消</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="24">
        <a-col :span="spanCol">
          <div class="commentsCss">
            <span>客户名称：</span>
            <p>{{model.dictCustomerName}}</p>
          </div>
        </a-col>
        <a-col :span="spanCol">
          <div class="commentsCss">
            <span>产品名称：</span>
            <p>{{model.dictProductName}}</p>
          </div>
        </a-col>
        <a-col :span="spanCol">
          <div class="commentsCss">
            <span>任务源类型：</span>
            <p>{{model.dictTaskTypeName}}</p>
          </div>
        </a-col>
        <a-col :span="spanCol">
          <div class="commentsCss">
            <span>来源类型：</span>
            <p>{{model.dictTaskFromTypeName}}</p>
          </div>
        </a-col>
        <a-col :span="spanCol">
          <div class="commentsCss">
            <span>提出问题时间：</span>
            <p>{{model.askTime}}</p>
          </div>
        </a-col>
        <a-col :span="spanCol">
          <div class="commentsCss">
            <span>期望解决时间：</span>
            <p>{{model.expectTime}}</p>
          </div>
        </a-col>
        <a-col :span="24">
          <div class="commentsCss">
            <span>是否为项目紧急问题</span>
            <p v-if="model.isUrgency === 1">是</p>
            <p v-else>否</p>
          </div>
        </a-col>
        <a-col :span="24">
          <div class="commentsCss">
            <span>任务描述：</span>
            <p>{{model.taskContent}}</p>
          </div>
        </a-col>
        <a-col :span="24" v-if="!state">
          <div class="commentsCss">
            <span>是否重点工作：</span>
            <p v-if="model.keyWork === 1">是</p>
            <p v-else>否</p>
          </div>
        </a-col>
        <a-col :span="24" v-if="!state">
          <div class="commentsCss">
            <span>批示：</span>
            <p>{{model.remark}}</p>
          </div>
        </a-col>
      </a-row>
      <a-form :form="form" layout="vertical" v-if="state">
        <a-row :gutter="24">
          <a-col :span="spanCol">
            <a-form-item label="是否重点工作">
              <a-radio-group :defaultValue="0" v-decorator="['keyWork', {}]">
                <a-radio :value="0">否</a-radio>
                <a-radio :value="1">是</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="批示" style="margin:0px">
              <a-textarea
                placeholder="请输入"
                :rows="3"
                v-decorator="['remark',{}]"
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
  name: 'comments',
  components: {},
  data() {
    return {
      title: '新增', //当前弹窗标题
      visible: false, //当前弹窗是否显示
      disableSubmit: false, //确定按钮是否显示
      form: this.$form.createForm(this),
      spanCol: 8,
      confirmLoading: false, //页面和确定按钮的加载动画
      modelId: '',
      model: {}, //页面传来的数据
      //客户名称
      dictCustomer: [],
      //产品名称
      dictProduct: [],
      //任务源类型
      dictTaskType: [],
      //来源类型
      dictTaskFromType: [],
      state:false
    }
  },
  mounted() {
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {
    })
  },
  methods: {
    moment,
    // 页面加载获取下拉列表数据
    getBasicInfo() {
    },
    add() {
      this.model = {}
      this.visible = true
    },
    edit(model,state) {
      this.model = {}
      if(state === 'edit') {
        this.state = true
      } else {
        this.state = false
      }
      this.visible = true
      this.modelId = model
      this.confirmLoading = true
      getAction(enTaskInfo.queryEnTaskInfoById, { id: this.modelId })
        .then((res) => {
          this.model = res.result
          this.confirmLoading = false
          this.$nextTick(() => {
              if(this.state) {
                this.form.setFieldsValue({remark: this.model.remark ? this.model.remark : "",});
                this.form.setFieldsValue({keyWork: this.model.keyWork});
              }
          })
        })
        .catch((err) => {
          console.log('详情:', err)
          this.confirmLoading = false
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
          // that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          formData.askTime = formData.askTime ? moment(formData.askTime).format('YYYY-MM-DD') : ''
          formData.expectTime = formData.expectTime ? moment(formData.expectTime).format('YYYY-MM-DD') : ''
          formData.isAnnotate = formData.remark ? 1 : 0//是否批示0为否，1为是，默认为0 
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
      this.dictProduct = []
      this.form.resetFields(['dictProductId'])
      //产品名称设置字典
      getAction(buCustomerPordcut.queryCondition, { dictCustomerId: value })
        .then((res) => {
          this.dictProduct = res.result
        })
        .catch((err) => {
          console.log('产品名称设置字典:', err)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.commentsCss {
  span {
    color: #adadad;
    line-height: 32px;
  }
  p {
    color: #ffffff;
  }
}
</style>