<template>
  <div>
    <a-modal
      :title="'章节考试（ ' + detailsData.courseName + ' - ' + videoItem.chapterName + ' ）'"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      width="1300px"
      :footer="null"
      :destroyOnClose="true"
    >
      <div class="con">
        <div class="left">
          <div class="top-box">
            <div class="subject">
              <img src="@assets/image/1.png" alt="" />
              <span
                v-if="sjState"
                style="margin-left: 8px"
                :style="{ color: reversedMessage == '不及格' ? '#fd7352' : ' #27c3bc' }"
                >{{ reversedMessage }}</span
              >
              <span v-else>题目</span>
            </div>
            <div
              v-for="item in colors"
              :key="item.id"
              :class="fnState == item.id ? 'colState cursor' : 'cursor'"
              @click="onsteta(item.id)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="bottom-box" v-if="sjState">
            <p>
              总分：<span class="single">{{ sjxqObj.allNum }}</span>
            </p>
            <p>
              及格：<span class="judge">{{ sjxqObj.passMarks }}</span>
            </p>
            <p>
              得分：<span class="choice">{{ sjxqObj.testMark }}</span>
            </p>
          </div>
          <div class="bottom-box" v-else>
            <p>
              单选：<span class="single">{{ optionNum.radio.notselect }}/{{ optionNum.radio.select }}</span>
            </p>
            <p>
              多选：<span class="choice">{{ optionNum.checkbox.notselect }}/{{ optionNum.checkbox.select }}</span>
            </p>
            <p>
              判断：<span class="judge">{{ optionNum.judged.notselect }}/{{ optionNum.judged.select }}</span>
            </p>
          </div>
        </div>

        <div class="conter">
          <div class="box" v-if="sjState">
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
              <div
                class="right"
                v-for="(time, i) in sjxqObj.children"
                :key="'subjectindex' + i"
                :class="time.isNot == 2 ? 'greenRight' : 'redRight'"
              >
                <div class="text-top">
                  <p>
                    <span class="title" v-if="time.dictTopicTypeId == 1">【单选】</span>
                    <span class="titles" v-if="time.dictTopicTypeId == 2">【多选】</span>
                    <span class="judge" v-if="time.dictTopicTypeId == 3">【判断】</span>
                    <span>{{ time.subjectHead }}</span>
                  </p>
                  <a-form-item v-if="time.dictTopicTypeId == 1" style="margin-bottom: 0px; padding-left: 10px">
                    <a-radio-group name="radioGroup" v-decorator="[time.id, {}]" @change="onRadio($event, time.id)">
                      <a-row>
                        <a-col :span="24" v-for="(item, ci) in time.topicOptionChildren" :key="item.id">
                          <a-radio :value="item.id" disabled>{{ ABCArray[ci] }}：{{ item.mulChoice }}</a-radio>
                        </a-col>
                      </a-row>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item v-else-if="time.dictTopicTypeId == 2" style="margin-bottom: 0px; padding-left: 10px">
                    <a-checkbox-group @change="onChange($event, time.id)" v-decorator="[time.id, {}]">
                      <a-row>
                        <a-col :span="24" class="more" v-for="(item, ci) in time.topicOptionChildren" :key="item.id">
                          <a-checkbox :value="item.id" disabled>{{ ABCArray[ci] }}：{{ item.mulChoice }}</a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item v-else style="margin-bottom: 0px; padding-left: 10px">
                    <a-radio-group name="radioGroup" v-decorator="[time.id, {}]" @change="onJudged($event, time.id)">
                      <a-row>
                        <a-col :span="24" v-for="(item, ci) in time.topicOptionChildren" :key="item.id">
                          <a-radio :value="item.id" disabled>{{ ABCArray[ci] }}：{{ item.mulChoice }}</a-radio>
                        </a-col>
                      </a-row>
                    </a-radio-group>
                  </a-form-item>
                </div>
                <div class="text-bottom">
                  <p>
                    正确答案：<span style="color: #23b8ff; font-size: 22px">{{ time.answer }}</span>
                  </p>
                  <p>答案解析：{{ time.analysis }}</p>
                  <p>知识点：{{ time.topicSpot }}</p>
                </div>
              </div>
            </a-form>
          </div>
          <div class="box" v-else>
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
              <div class="right" v-for="(time, i) in subjectObj" :key="'subjectindex' + i">
                <div class="text-top">
                  <p>
                    <span class="title" v-if="time.dictTopicTypeId == 1">【单选】</span>
                    <span class="titles" v-if="time.dictTopicTypeId == 2">【多选】</span>
                    <span class="judge" v-if="time.dictTopicTypeId == 3">【判断】</span>
                    <span>{{ time.subjectHead }}</span>
                  </p>
                  <a-form-item v-if="time.dictTopicTypeId == 1" style="margin-bottom: 0px; padding-left: 10px">
                    <a-radio-group name="radioGroup" v-decorator="[time.id, {}]" @change="onRadio($event, time.id)">
                      <a-row>
                        <a-col :span="24" v-for="(item, ci) in time.topicOptionChildren" :key="item.id">
                          <a-radio :value="item.id">{{ ABCArray[ci] }}：{{ item.mulChoice }}</a-radio>
                        </a-col>
                      </a-row>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item v-else-if="time.dictTopicTypeId == 2" style="margin-bottom: 0px; padding-left: 10px">
                    <a-checkbox-group @change="onChange($event, time.id)" v-decorator="[time.id, {}]">
                      <a-row>
                        <a-col :span="24" class="more" v-for="(item, ci) in time.topicOptionChildren" :key="item.id">
                          <a-checkbox :value="item.id">{{ ABCArray[ci] }}：{{ item.mulChoice }}</a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item v-else style="margin-bottom: 0px; padding-left: 10px">
                    <a-radio-group name="radioGroup" v-decorator="[time.id, {}]" @change="onJudged($event, time.id)">
                      <a-row>
                        <a-col :span="24" v-for="(item, ci) in time.topicOptionChildren" :key="item.id">
                          <a-radio :value="item.id">{{ ABCArray[ci] }}：{{ item.mulChoice }}</a-radio>
                        </a-col>
                      </a-row>
                    </a-radio-group>
                  </a-form-item>
                </div>
              </div>
            </a-form>
          </div>
          <div class="right-botton">
            <div class="right-box">
              <a-button type="primary" @click="getSubjectObj" v-if="sjState" :loading="loading"> 重新考试 </a-button>
              <a-button type="primary" @click="referring" v-if="!sjState" :loading="loading"> 提交 </a-button>
              <a-button @click="handleCancel">取消</a-button>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
//组件引用
import { getAction, putAction, postAction } from '@/api/manage' //接口方法
import { buCourseStudyTeacher } from '@/api/ajaxUrl.config.js' //接口
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      old_date: '', //试卷开始时间
      detailsData: {}, //课程信息
      videoItem: {}, //章节信息
      QLSdata: {}, //学习记录信息
      visible: false,
      fnState: '', //左边选中
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      colors: [], //左边渲染用数组
      subjectObj: [], //所有题目
      optionNum: {
        radio: { notselect: 0, select: 0 },
        checkbox: { notselect: 0, select: 0 },
        judged: { notselect: 0, select: 0 },
      }, //各选项数量
      radioObj: [], //选择的单选
      judgedObj: [], //选择的判断
      checkboxObj: [], //选择的多选
      sjState: true, //true代表显示考试详情，false表示显示考试试卷
      sjxqObj: {
        allNum: 100,
        children: [],
        eachScore: 10,
        passMarks: 60,
        testMark: 0,
      },
      loading: false,
      ABCArray: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ],
    }
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例
      if (this.sjxqObj.testMark < this.sjxqObj.passMarks) {
        //不及格
        return '不及格'
      } else {
        //及格
        return '及格'
      }
    },
  },
  methods: {
    moment,
    ...mapGetters(['userInfo']), //获取用户id
    showModal() {
      this.visible = true
    },
    //提交试卷
    referring() {
      var new_date = moment()
      var difftime = (new_date - this.old_date) / 1000 //计算时间差,并把毫秒转换成秒
      // this.visible = false
      this.form.validateFields((err, values) => {
        if (this.optionNum.radio.select > this.optionNum.radio.notselect) {
          //单选
          var num = this.optionNum.radio.select - this.optionNum.radio.notselect
          this.$message.info('当前有' + num + '题单选未答！')
          return
        } else if (this.optionNum.checkbox.select > this.optionNum.checkbox.notselect) {
          //多选
          var num = this.optionNum.checkbox.select - this.optionNum.checkbox.notselect
          this.$message.info('当前有' + num + '题多选未答！')
          return
        } else if (this.optionNum.judged.select > this.optionNum.judged.notselect) {
          //判断
          var num = this.optionNum.judged.select - this.optionNum.judged.notselect
          this.$message.info('当前有' + num + '题判断未答！')
          return
        }
        this.loading = true
        var children = []
        for (var key in values) {
          //遍历对象的所有属性，包括原型链上的所有属性
          if (values.hasOwnProperty(key)) {
            //判断是否是对象自身的属性，而不包含继承自原型链上的属性
            var teacherOption = ''
            if (typeof values[key] == 'object') {
              teacherOption = values[key].join(',')
            } else {
              teacherOption = values[key]
            }
            var obj = {
              fkEnCourseChapterTopicId: key, //所属题目
              teacherOption: teacherOption, //选项
              answer: this.getYesId(key), //正确答案
            }
            children.push(obj)
          }
        }
        var params = {
          fkBuCourseStudyTeacherId: this.QLSdata.id, //'教师学习记录ID',
          fkEnCourseChapterId: this.videoItem.id, //章节id
          fkBasicStaffId: this.userInfo().personId, //'教师',
          startTime: moment(this.old_date).format('YYYY-MM-DD HH:mm:ss'), //'考试开始时间',
          overTime: moment(new_date).format('YYYY-MM-DD HH:mm:ss'), //'考试结束时间',
          testTime: difftime, //'考试用时（秒）',
          fkEnCourseId: this.detailsData.id, //课程ID
          children: children, //答题记录信息
        }
        putAction(buCourseStudyTeacher.saveChapterTest, params).then((res) => {
          if (res.success) {
            this.$emit('ok')
            this.getSelectChapterTest()
          } else {
            this.$message.warning(res.message)
          }
        })
      })
    },
    //获取正确选项
    getYesId(id) {
      var obj = this.subjectObj.find((e) => {
        return e.id === id
      })
      var objA = []
      obj.topicOptionChildren.forEach((e) => {
        //是否正确答案（0否，1是）
        if (e.rightNotAnwers == 1) {
          objA.push(e.id)
        }
      })
      return objA.join(',')
    },
    handleCancel(e) {
      this.sjxqObj = {
        allNum: 100,
        children: [],
        eachScore: 10,
        passMarks: 60,
        testMark: 0,
      }
      this.subjectObj = []
      this.visible = false
    },
    add(videoItem, detailsData, QLSdata) {
      this.visible = true
      this.radioObj = [] //单选
      this.judgedObj = [] //选择的判断
      this.checkboxObj = [] //选择的多选
      this.videoItem = videoItem
      this.detailsData = detailsData
      this.QLSdata = QLSdata
      this.getSelectChapterTest()
    },
    //查询考试详情
    getSelectChapterTest() {
      this.sjxqObj = {
        allNum: 100,
        children: [],
        eachScore: 10,
        passMarks: 60,
        testMark: 0,
      }
      var params = {
        fkEnCourseChapterId: this.videoItem.id, //章节id
        fkBasicStaffId: this.userInfo().personId, //'教师',
      }
      putAction(buCourseStudyTeacher.selectChapterTest, params).then((res) => {
        if (res.success) {
          if (res.result.children.length) {
            //说明考过试了，页面展示详情
            this.sjState = true
            this.sjxqObj = res.result
            var obj = {}
            var objA = []
            var _this = this
            this.sjxqObj.children.forEach((e) => {
              var answer = []
              e.topicOptionChildren.forEach((c, i) => {
                //是否正确答案（0否，1是）
                if (c.rightNotAnwers == 1) {
                  answer.push(this.ABCArray[i])
                }
              })
              e.answer = answer.join(',')
            })
            this.sjxqObj.children.forEach((e) => {
              if (e.personOption.indexOf(',') != -1) {
                //存在
                obj[e.id] = e.personOption.split(',')
              } else {
                //不存在
                obj[e.id] = e.personOption
              }
            })
            this.gatColors(this.sjxqObj.children.length)
            setTimeout(() => {
              _this.form.setFieldsValue(obj)
              _this.loading = false
            })
          } else {
            //说明没有考过试，页面展示试卷
            this.sjState = false
            this.getSubjectObj()
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //获取新试卷
    getSubjectObj() {
      this.loading = true
      var _this = this
      this.sjState = false //true代表显示考试详情，false表示显示考试试卷
      this.sjxqObj = {
        allNum: 100,
        children: [],
        eachScore: 10,
        passMarks: 60,
        testMark: 0,
      }
      this.subjectObj = []
      this.old_date = moment()
      putAction(buCourseStudyTeacher.startTest, { fkEnCourseChapterId: this.videoItem.id })
        .then((res) => {
          if (res.success == true) {
            if (res.result.data.length > 0) {
              this.subjectObj = res.result.data
              var obj = {
                radio: { notselect: 0, select: 0 },
                checkbox: { notselect: 0, select: 0 },
                judged: { notselect: 0, select: 0 },
              }
              this.subjectObj.forEach((e) => {
                if (e.dictTopicTypeId == 1) {
                  //单选
                  obj.radio.select++
                } else if (e.dictTopicTypeId == 2) {
                  //多选
                  obj.checkbox.select++
                } else if (e.dictTopicTypeId == 3) {
                  //判断
                  obj.judged.select++
                }
              })
              this.optionNum = obj
              this.gatColors(res.result.data.length)
              setTimeout(() => {
                _this.form.resetFields()
                _this.loading = false
              })
            }
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {})
    },
    //获取左边
    gatColors(num) {
      var num1 = num
      var num2 = 5
      var parseNum = parseInt(num1 / num2)
      var parseNum1 = parseNum + 1
      var parseNum2 = num1 % num2
      if (num1 > 0) {
        var obj = []
        for (var i = 0; i < parseNum; i++) {
          var newNum = i * 5 + 1
          var newNum1 = (i + 1) * 5
          var newobj = newNum + '~' + newNum1
          obj.push({ id: 'index' + i, name: newobj })
        }
        var newNum3 = i * 5 + 1
        var newNum4 = parseNum * 5 + parseNum2
        var newobj5 = newNum3 + '~' + newNum4
        obj.push({ id: 'index' + parseNum, name: newobj5 })
        this.fnState = obj[0].id
        this.colors = obj
      } else {
        this.fnState = ''
        this.colors = []
      }
    },
    onsteta(id) {
      this.fnState = id
    },
    //单选点击
    onRadio(e, id) {
      if (this.radioObj.indexOf(id) > -1) {
        //则包含该元素
      } else {
        this.radioObj.push(id)
      }
      this.optionNum.radio.notselect = this.radioObj.length
    },
    //判断点击
    onJudged(e, id) {
      if (this.judgedObj.indexOf(id) > -1) {
        //则包含该元素
      } else {
        this.judgedObj.push(id)
      }
      this.optionNum.judged.notselect = this.judgedObj.length
    },
    //多选点击
    onChange(e, id) {
      console.log('checked = ', e, id)
      // checkboxObj
      if (e.length > 0) {
        //大于0说明当前选择了
        if (this.checkboxObj.indexOf(id) > -1) {
          //则包含该元素
          //存在就不管了
        } else {
          //不存在就统计
          this.checkboxObj.push(id)
        }
      } else {
        //等于0说明当前把选择的取消了
        if (this.checkboxObj.indexOf(id) > -1) {
          //则包含该元素
          this.checkboxObj.splice(this.checkboxObj.indexOf(id), 1) //存在就删除
        }
      }
      this.optionNum.checkbox.notselect = this.checkboxObj.length
    },
  },
}
</script>
<style lang="scss" scoped>
// confirmLoading form  handleSubmit
.con {
  width: 1237px;
  display: flex;
  justify-content: space-between;
  .left {
    width: 159px;
    border: 1px #e5e6e7 solid;
    margin-right: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .top-box {
      width: 100%;
      height: 51px;
      line-height: 51px;
      text-align: center;
      font-size: 16px;
      // border-radius: 10px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      // margin-top: 13px;
      // cursor: pointer;
      .subject {
        text-align: center;
        background: #f8f8f8;
        margin-bottom: 10px;
        // padding-left: 44px;
      }
      .cursor {
        cursor: pointer;
      }
      img {
        width: 20px;
        height: 21px;
      }
      span {
        margin-left: 5px;
        // font-size: 22px;
        vertical-align: middle;
      }
    }
    .colState {
      background: #e1f0ff;
      border-left: 2px solid #21b5fb;
    }
    .bottom-box {
      margin: 21px 17px;
      width: 125px;
      height: 159px;
      background: #f8f8f8;
      border: 1px solid #e5e6e7;
      border-radius: 5px;
      p {
        margin-top: 17px;
        text-align: left;
        font-size: 19px;
        padding-left: 10px;
        .single {
          color: #23b8ff;
        }
        .choice {
          color: #fd7352;
        }
        .judge {
          color: #27c3bc;
        }
      }
    }
  }
  .conter {
    border: 1px solid #e5e6e7;
    position: relative;
    flex: 1;
    .box {
      padding: 20px;
      height: calc(100vh - 300px);
      overflow: auto;
      padding-bottom: 50px;
      .right {
        width: 1019px;
        // height: 230px;
        padding: 10px;
        padding-top: 24px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid #e5e6e7;
        border-radius: 10px;
        font-size: 18px;
        font-weight: 600;
        color: #333333;
        .text-top {
          p {
            .title {
              color: #23b8ff;
            }
          }
          p {
            .titles {
              color: #fd7352;
            }
          }
          p {
            .judge {
              color: #27c3bc;
            }
          }
        }
        .more {
          margin-bottom: 18px;
        }
        .text-bottom {
          font-size: 15px;
          padding: 10px;
          width: 100%;
          background: #f8f8f8;
          border: 1px solid #dcdcdc;
          border-radius: 5px;
          font-weight: 500;
        }
      }
      .redRight {
        background: rgba(253, 115, 82, 0.2);
      }
      .greenRight {
        background: rgba(39, 195, 188, 0.2);
      }
    }
    .right-botton {
      width: 100%;
      height: 62px;
      display: flex;
      background: #f8f8f8;
      border-radius: 0px 0px 5px 5px;
      position: absolute;
      left: 0;
      bottom: 0;
      .right-box {
        position: absolute;
        top: 0;
        right: 0;
        button {
          min-width: 80px;
          height: 40px;
          margin: 12px 10px;
        }
      }
    }
  }
}
</style>