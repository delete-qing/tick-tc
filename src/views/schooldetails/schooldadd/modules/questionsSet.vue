<template>
  <a-modal
    title="试卷设置"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    centered
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk"> 确定 </a-button>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="horizontal">
        <a-row :gutter="24">
          <a-col :span="spanCol">
            <div class="overview">
              当前试卷：共 {{ list.allNum }} 题，单选 {{ list.radio }} 题，多选 {{ list.multipleChoice }} 题，判断
              {{ list.judge }} 题。
            </div>
            <a-form-item label="随机题数：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input-number
                style="width: 100%"
                :min="1"
                :max="list.allNum"
                :precision="0"
                @change="onChange"
                v-decorator="['randomNum', { rules: [{ required: true, message: '请输入随机题数' }] }]"
              />
            </a-form-item>
            <a-form-item label="每题分数：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input-number
                style="width: 100%"
                :min="0"
                :precision="0"
                @change="onChanges"
                v-decorator="['eachScore', { rules: [{ required: true, message: '请输入每题分数' }] }]"
              />
            </a-form-item>
            <a-form-item label="试卷总分：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input-number
                style="width: 100%"
                :min="0"
                :precision="0"
                :disabled="disabled"
                v-decorator="['testScore']"
              />
            </a-form-item>
            <a-form-item label="及格分数：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input-number
                style="width: 100%"
                :min="0"
                :max="passMark"
                :precision="0"
                v-decorator="['passMark', { rules: [{ required: true, message: '请输入随机题数' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { httpAction, getAction, putAction } from '@/api/manage'
import { enCourse, dict } from '@/api/ajaxUrl.config.js' //接口
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
      chapterId: '',
      disabled: true,
      list: {}, //题目标题
      aaa: '', //测试数据相乘
      passMark: '',
    }
  },
  mounted() {},
  methods: {
    add(unm) {
      this.visible = true
      this.chapterId = unm
      this.loadtop()
    },
    edit(model) {
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
    //获取数据
    loadtop() {
      var params = {
        chapterId: this.chapterId,
      }
      getAction(enCourse.sendTestData, params).then((res) => {
        if (res.success == true) {
          this.list = Object.assign({}, res.result)
          this.form.setFieldsValue(pick(this.list, 'randomNum', 'eachScore', 'testScore', 'passMark'))
          this.$emit('getNum', this.list)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 监视输入框值的变化  每题分数
    onChange(value) {
      console.log(value, 'form表单的值')
      this.form.validateFields((err, values) => {
        // console.log(values, 'form表单的值')
        // console.log(value * values.eachScore, 'form表单的值')
        this.form.setFieldsValue({ testScore: value * values.eachScore })
        this.passMark = value * values.eachScore
        // if (this.list.allNum < values.allNum) {
        //   this.form.setFieldsValue({ allNum: this.list.allNum })
        // }
      })
    },
    // 随机题数
    onChanges(value) {
      this.form.validateFields((err, values) => {
        this.form.setFieldsValue({ testScore: value * values.randomNum })
      })
    },
    // 试卷点击确定
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          var params = {
            id: this.chapterId, //章节id
            randomNum: values.randomNum, //随机题数
            eachScore: values.eachScore, //每题分数
            testScore: values.randomNum * values.eachScore, //试卷总分
            passMark: values.passMark, //及格分数
          }
          // console.log(params)
          putAction(enCourse.testSet, params).then((res) => {
            if (res.success == true) {
              this.$message.success('编辑成功')
              this.$emit('getNum')
              this.confirmLoading = false
              this.visible = false
            } else {
              this.$message.warning(res.message)
              this.confirmLoading = false
            }
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>
<style lang='scss' scoped>
.overview {
  padding: 0 15px 15px;
}
</style>