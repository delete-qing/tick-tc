<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
    wrapClassName="nav"
    cancelText="关闭"
    centered
    @afterClose="afterClose"
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
            <a-form-item label="题目：" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
              <a-textarea
                placeholder="请输入题目"
                v-decorator="['subjectHead', { rules: [{ required: true, message: '请输入题目' }] }]"
                :autosize="{ minRows: 3 }"
              />
            </a-form-item>
            <a-form-item label="选项：" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
              <div style="color: red; font-weight: 600">一行为一个选项，回车输入下一个选项</div>
              <a-textarea
                placeholder="一行为一个选项，回车输入下一个选项"
                @blur="textBlur"
                v-decorator="['mulChoice', { rules: [{ required: true, message: '请输入选项' }] }]"
                :autosize="{ minRows: 5 }"
              />
            </a-form-item>
            <a-form-item label="答案：" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
              <div v-if="optionData.length == 0" style="color: red; font-weight: 600; margin-bottom: 5px">
                请先添加选项
              </div>
              <a-checkbox-group
                v-if="isType == 2 && optionData.length != 0"
                v-decorator="['answer', { rules: [{ required: true, message: '请选择选项' }] }]"
                style="width: 100%"
              >
                <a-row :gutter="24">
                  <a-col :span="24" v-for="(item, index) in optionData" :key="item.id">
                    <a-checkbox :value="item.id">{{ optionList[index] }}：{{ item.name }}</a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
              <a-radio-group
                v-if="(isType == 1 || isType == 3) && optionData.length != 0"
                v-decorator="['answer', { rules: [{ required: true, message: '请选择选项' }] }]"
                style="width: 100%"
              >
                <a-row :gutter="24">
                  <a-col :span="24" v-for="(item, index) in optionData" :key="item.id">
                    <!-- <a-checkbox :value="item.id">{{item.name}}</a-checkbox> -->
                    <a-radio :value="item.id">{{ optionList[index] }}：{{ item.name }}</a-radio>
                  </a-col>
                </a-row>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="解析：" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
              <a-textarea
                placeholder="请输入解析"
                v-decorator="['analysis', { rules: [{ required: true, message: '请输入解析' }] }]"
                :autosize="{ minRows: 5 }"
              />
            </a-form-item>
            <a-form-item label="知识点：" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
              <a-textarea
                placeholder="请输入知识点"
                v-decorator="['topicSpot', { rules: [{ required: true, message: '请输入知识点' }] }]"
                :autosize="{ minRows: 5 }"
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
import { UUID } from '@/utils/util'
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
      textData: [],
      optionData: [],
      isType: '1',
      subjectID: '', //题目ID
      fkEnCourseTopicId: '', //章节ID
      optionList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
      // id:UUID.prototype.createUUID()
      // url: {
      //   add: '',
      //   edit: '',
      // },
    }
  },
  methods: {
    add(data) {
      // console.log(data)
      this.fkEnCourseTopicId = data
      this.visible = true
    },
    edit(record) {
      // console.log(record, '--这是record参数')
      this.isType = record.dictTopicTypeId
      this.fkEnCourseTopicId = record.fkEnCourseTopicId //章节id
      // console.log(this.isType)
      this.visible = true
      this.subjectID = record.id //题目ID
      // console.log(this.subjectID)
      this.record = record
      this.$nextTick(() => {
        this.texdt(record)
        this.form.setFieldsValue(pick(this.record, 'subjectHead', 'analysis', 'topicSpot', 'sign', 'sort'))
      })
      // console.log(record)
    },
    // 选项框失去焦点
    textBlur() {
      var textarea = this.form.getFieldValue('mulChoice')
      if (textarea) {
        this.textData = textarea.split(/[(\r\n)\r\n]+/)
      } else {
        this.textData = []
      }
      this.textData = textarea.split(/[(\r\n)\r\n]+/)
      var arr = []
      this.textData.forEach((item) => {
        arr.push({
          name: item,
          id: UUID.prototype.createUUID(),
        })
      })
      this.optionData = arr
      // console.log(this.optionData)
    },
    // 选项
    texdt(record) {
      console.log(record)
      var answerdata = []
      // record.mulChoice = []
      var text = ''
      var newI = record.topicOptionChildren.length == 0 ? 0 : record.topicOptionChildren.length - 1
      record.topicOptionChildren.forEach((ele, i) => {
        if (newI == i) {
          text += ele.mulChoice
        } else {
          text += ele.mulChoice + '\n'
        }
        this.optionData.push({
          name: ele.mulChoice,
          id: ele.id,
        })
        // console.log(this.optionData)

        if (this.isType == 1 || this.isType == 3) {
          console.log(ele.id)
          if (ele.rightNotAnwers == 1) {
            this.$nextTick(() => {
              this.form.setFieldsValue({ answer: ele.id })
            })
          }
        } else {
          // 多选
          if (ele.rightNotAnwers == 1) {
            // console.log(ele.rightNotAnwers)
            answerdata.push(ele.id)
            // console.log(ele.id)
          }
        }
      })
      if (answerdata.length > 0) {
        this.$nextTick(() => {
          this.form.setFieldsValue({ answer: answerdata })
        })
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ mulChoice: text })
      })
    },
    textareaChange(data) {
      // console.log(data)
    },
    close() {
      this.subjectID = ''
      this.form.resetFields()
      this.optionData = [] //清空选择
      this.confirmLoading = false
      this.disableSubmit = false
      this.visible = false
    },
    // 点击确定
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          if (this.subjectID != '') {
            // console.log(this.subjectID)
            // 修改
            var addtopic = {}
            // console.log(values)
            addtopic = Object.assign({}, values)
            addtopic.mulChoice = this.optionData //多选
            addtopic.fkEnCourseTopicId = this.fkEnCourseTopicId
            addtopic.sign = this.isType //标识符
            addtopic.mulChoice.forEach((e, i) => {
              // 循环选项  index
              e.choice = i + 1
              e.fkEnCourseChapterTopicId = this.subjectID
              // console.log(e.fkEnCourseChapterTopicId)
              e.mulChoice = e.name
              // e.fkEnCourseChapterTopicId = e.id
              console.log(e.fkEnCourseChapterTopicId)
            })

            if (this.isType == 2) {
              addtopic.mulChoice.forEach((e, i) => {
                values.answer.forEach((item) => {
                  if (e.id == item) {
                    e.rightNotAnwers = 1
                  }
                })
              })
            } else {
              addtopic.mulChoice.forEach((e, i) => {
                if (e.id == values.answer) {
                  //  正确选项
                  e.rightNotAnwers = 1
                } else {
                  e.rightNotAnwers = 0
                }
              })
            }
            //题目请求数据
            var params = {
              analysis: addtopic.analysis, //解析
              dictTopicTypeId: addtopic.sign, //题目类型
              fkEnCourseTopicId: addtopic.fkEnCourseTopicId, //所属章节
              subjectHead: addtopic.subjectHead, //题目标题
              topicSpot: addtopic.topicSpot, //知识点
              id: this.subjectID, //题目id
              topicOptionChildren: addtopic.mulChoice,
            }
            // console.log(params)
            // 编辑 点击编辑之后点修改会出现修改成功
            putAction(enCourse.editOption, params).then((res) => {
              if (res.success == true) {
                this.$message.success('修改成功')
                this.$emit('ok')
                this.close()
                this.subjectID = ''
                // this.$emit('getgetbottom')
              } else {
                this.$emit('ok')
                that.confirmLoading = false
                this.$message.warning(res.message)
                this.subjectID = ''
                this.close()
              }
            })
          } else {
            // 增加
            var addtopic = {}
            // console.log(values)
            addtopic = Object.assign({}, values)
            addtopic.mulChoice = this.optionData //多选
            addtopic.fkEnCourseTopicId = this.fkEnCourseTopicId
            addtopic.sign = this.isType //标识符
            addtopic.mulChoice.forEach((e, i) => {
              // 循环选项  index
              e.index = i + 1
            })

            if (this.isType == 2) {
              addtopic.mulChoice.forEach((e, i) => {
                values.answer.forEach((item) => {
                  if (e.id == item) {
                    e.rightKey = 1
                  }
                })
              })
            } else {
              addtopic.mulChoice.forEach((e, i) => {
                if (e.id == values.answer) {
                  //  正确选项
                  e.rightKey = 1
                } else {
                  e.rightKey = 0
                }
              })
            }
            //题目请求数据
            var params = {
              analysis: addtopic.analysis, //解析
              dictTopicTypeId: addtopic.sign, //题目类型
              fkEnCourseTopicId: addtopic.fkEnCourseTopicId, //所属章节
              subjectHead: addtopic.subjectHead, //题目标题
              topicSpot: addtopic.topicSpot, //知识点
            }
            putAction(enCourse.addTopic, params).then((res) => {
              if (res.success == true) {
                var CurrentID = res.result //获取到题目的id
                // 添加单选
                var solt = 0
                addtopic.mulChoice.forEach((e, i) => {
                  var cccc = {
                    choice: e.index, //	选项序号
                    fkEnCourseChapterTopicId: CurrentID, //当前所属题目
                    mulChoice: e.name, //选项内容
                    rightNotAnwers: e.rightKey, //是否正确答案（0否，1是）
                    fkEnCourseTopicId: addtopic.fkEnCourseTopicId, //所属章节
                  }
                  putAction(enCourse.addOption, cccc).then((res) => {
                    if (res.success == true) {
                      solt++
                      if (solt == addtopic.mulChoice.length) {
                        this.$message.success('添加成功')
                        this.close()
                        this.$emit('ok')
                      }
                    } else {
                      return
                      // this.$message.warning(res.message)
                    }
                  })
                })
              } else {
                this.visible = false
                this.$message.warning(res.message)
              }
            })
          }
        }
      })
    },
    // 弹窗关闭之后回调
    afterClose() {
      //  this.$emit('ok')
    },
    // 删除题目
    handleCancel() {
      this.close()
    },
  },
}
</script>
<style lang='scss' scoped>
/deep/ .ant-radio-wrapper,
.ant-checkbox-wrapper {
  margin-bottom: 8px;
}
/deep/ .ant-form-item-control {
  line-height: unset;
}
/deep/ .ant-form-item-label {
  line-height: unset;
}
/deep/ .ant-form-item {
  margin-bottom: 10px;
}
</style>