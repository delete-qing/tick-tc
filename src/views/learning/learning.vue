<template>
  <div id="learning">
    <div class="all">
      <page-header></page-header>
      <!-- 头部 -->
      <a-spin :spinning="spinning">
        <div class="con">
          <div class="left">
            <div :class="fnState == '最近学习' ? 'colState' : ''" @click="onsteta('最近学习')">最近学习</div>
            <div :class="fnState == '' ? 'colState' : ''" @click="onstetas('')">全部</div>
            <div
              v-for="item in colors"
              :key="item.dictCommonSubjectId"
              :class="fnState == item.dictCommonSubjectId ? 'colState' : ''"
              @click="onstetas(item.dictCommonSubjectId)"
            >
              {{ item.dictCommonSubjectName }}
            </div>
          </div>

          <div class="conter">
            <div class="right" v-for="(item, index) in listdata" :key="index">
              <!-- v-for="(item, index) in 3" :key="index" -->
              <div class="right-con">
                <div class="con-img">
                  <img :src="item.courseCover" alt="" />
                </div>
                <!-- 文字部分 -->
                <div class="con-text">
                  <div class="text-con">
                    <div>
                      <p class="text-top">
                        <span> {{ item.enCourseName }}</span>
                      </p>
                    </div>
                    <div class="bottom-box">
                      <!-- 左边box -->
                      <!-- :class="item.statuscolro ? 'red' : ''" -->
                      <div class="stutd" v-show="item.percent == 0 && item.fileCourseChapterVideoName">
                        <span>已学至</span>
                      </div>
                      <div
                        class="stutd"
                        style="background-color: #e5e6e7"
                        v-show="item.percent == 0 && !item.fileCourseChapterVideoName"
                      >
                        <span style="color: #7b6d6d">未学习</span>
                      </div>
                      <div class="stutd" v-show="item.percent != 0 && item.percent != 100">
                        <span>已学至</span>
                      </div>
                      <div class="stutd" style="background: #e1f0ff" v-show="item.percent == 100">
                        <span style="color: #23b8ff">已完成</span>
                      </div>
                      <div class="bottom-p" v-if="item.percent != 0 || item.fileCourseChapterVideoName">
                        <span>{{ item.enCourseChapterName }}&nbsp;&nbsp;></span>
                        <p>
                          <span>{{ item.fileCourseChapterVideoName }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 右边box -->
              <div class="right-box">
                <div
                  class="top-box"
                  @click="godetails(item.fkEnCourseId)"
                  v-show="item.percent != 0 && item.percent != 100"
                >
                  继续学习
                </div>
                <div
                  class="top-box"
                  @click="godetails(item.fkEnCourseId)"
                  v-show="item.percent == 0 && !item.fileCourseChapterVideoName"
                  style="background-color: #e5e6e7; color: #7b6d6d"
                >
                  开始学习
                </div>
                <div
                  class="top-box"
                  @click="godetails(item.fkEnCourseId)"
                  v-show="item.percent == 100 && item.status == 30"
                  style="background-color: #e1f0ff; color: #23b8ff"
                >
                  已完成
                </div>
                <div
                  class="top-box"
                  @click="godetails(item.fkEnCourseId)"
                  v-show="item.percent == 100 && item.status == 20"
                >
                  继续学习
                </div>
                <!-- 该章节下有视频 有考题 -->
                <div
                  class="top-box"
                  @click="godetails(item.fkEnCourseId)"
                  v-show="item.percent == 100 && item.status == 10"
                >
                  继续学习
                </div>
                <!-- 考试未及格 -->
                <!-- 进度条 -->
                <div class="bottom-boxone" v-show="item.percent != 0 && item.percent != 100" style="width: 80px">
                  <a-progress :percent="item.percent" size="small" strokeColor="#FD7352" />
                  <!-- item.videoNum != 0 ? Number(((item.alreadStudy / item.videoNum) * 100).toFixed(2)) : 0 -->
                </div>
                <div class="bottom-boxtwo" v-show="item.percent == 0" style="width: 80px">
                  <a-progress :percent="item.percent" size="small" strokeColor="#cccccc" />
                </div>
                <div class="bottom-boxtherr" v-show="item.percent == 100 && item.status == 30" style="width: 80px">
                  <a-progress :percent="item.percent" size="small" strokeColor="#23b8ff" />
                </div>
                <div class="bottom-boxone" v-show="item.percent == 100 && item.status == 20" style="width: 80px">
                  <a-progress :percent="item.percent" size="small" strokeColor="#FD7352" />
                </div>
                <div class="bottom-boxtherr" v-show="item.percent == 100 && item.status == 10" style="width: 80px">
                  <a-progress :percent="item.percent" size="small" strokeColor="#23b8ff" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>   
<script>
//组件引用 form  map
import { deleteAction, getAction, putAction } from '@/api/manage' //接口方法
import { buCourseStudyTeacher, dict } from '@/api/ajaxUrl.config.js' //接口
import PageHeader from '@/components/page/PageHeader.vue'
import { mapGetters } from 'vuex'
export default {
  //组件注册
  components: {
    PageHeader,
  },

  data() {
    return {
      fnState: '最近学习',
      dictCommonSubjectId: '', //科目ID
      tolink: {},
      colors: [], //分类接口数据
      listdata: [], //内容数据
      spinning: false,
      userID: '', //用户ID
      show: true,
      num: 0,
      statuscolro: false, //换颜色
      stateleaing: 1,
      showlearnig: false,
    }
  },
  created() {},
  //计算属性
  computed: {},
  //   computed: {},
  //实例被挂载后调用
  mounted() {
    var params = this.$route.query
    this.tolink = params
    this.userID = this.userInfo().personId
    // console.log(this.userID)
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {
      //获取当前用户报名的所有课程
      this.getBasicInfo()
      this.getStudyTeacherList()
    })
  },
  //方法存放处
  methods: {
    ...mapGetters(['userInfo']), //获取用户id

    //点击最近学习
    onsteta(id) {
      this.dictCommonSubjectId = id //科目
      this.fnState = id
      this.getStudyTeacherList()
    },
    //点击全部或者某个分类
    onstetas(id) {
      this.dictCommonSubjectId = id //科目
      this.fnState = id
      this.loadData()
    },
    // 根据科目id查课程  全部
    loadData() {
      this.spinning = true
      var params = {
        fkBasicStaffId: this.userID,
        dictCommonSubjectId: this.dictCommonSubjectId, // 科目
      }
      getAction(buCourseStudyTeacher.studyTeacherSubject, params)
        .then((res) => {
          if (res.success == true) {
            // console.log(res)
            this.listdata = res.result
            this.listdata.forEach((e) => {
              e.percent = parseInt(e.percent)
              // if (e.percent == '0') {
              //   e.statuscolro = true
              // } else if (e.percent != 0 && e.percent != 100) {
              //   e.statuscolro = false
              // } else if (e.percent == 100) {
              //   e.statuscolro = true
              // }
            })
            // var percentdata = res.result.percent
            // this.listdata.forEach((e) => {})
          } else {
            this.listdata = []
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    //重新最近学习课程
    getStudyTeacherList() {
      this.spinning = true
      var params = {
        fkBasicStaffId: this.userID,
        // dictCommonSubjectId: this.dictCommonSubjectId, // 科目
      }
      // /course/buCourseStudyTeacher/studyTeacherList
      getAction(buCourseStudyTeacher.studyTeacherList, params)
        .then((res) => {
          if (res.success == true) {
            // console.log(res)
            this.listdata = res.result
            this.listdata.forEach((e) => {
              e.percent = parseInt(e.percent)
            })
          } else {
            this.listdata = []
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },

    // 跳转  视频页
    godetails(fkEnCourseId) {
      this.$router.push({
        name: 'learning-classroomLearning-index',
        query: { tolink: '2', fkEnCourseId: fkEnCourseId },
      })
    },
    getBasicInfo() {
      var pramas = {
        fkBasicStaffId: this.userID,
      }
      //获取用户报名的所有课程分类
      putAction(buCourseStudyTeacher.getCourseName, pramas).then((res) => {
        if (res.success == true) {
          // console.log(res)
          this.colors = res.result.data
        } else {
          this.$message.warning(res.message)
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
#learning {
  width: 100%;
  // height: 100%;
  background-color: #ffffff;
  padding: 30px;
  .all {
    width: 1300px;
    height: 100%;
    margin: 0 auto;
    border-radius: 10px;
    border: solid 1px #e5e6e7;

    .con {
      margin: 20px;
      display: flex;
      justify-content: space-between;
      min-height: calc(100vh - 240px);
      .left {
        width: 104px;
        // height: calc(100vh - 250px);
        display: block;
        overflow: hidden;
        overflow-y: auto;
        border: 1px #e5e6e7 solid;
        margin-right: 20px;
        border-radius: 10px;
        div {
          width: 100%;
          height: 51px;
          line-height: 51px;
          text-align: center;
          font-size: 16px;
          margin-top: 13px;
          cursor: pointer;
        }
        .colState {
          background: #e1f0ff;
          border-left: 2px solid #21b5fb;
        }
      }
      .conter {
        // height: calc(100vh - 250px);
        // overflow-y: scroll;
        flex: 1;
        .right {
          width: 100%;
          // height: 120px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          border: 1px solid #e5e6e7;
          border-radius: 10px;
          .right-con {
            display: flex;
            .con-img img {
              width: 138px;
              height: 87px;
              margin: 21px;
            }
            .con-text {
              margin-top: 4%;
              display: flex;
              .text-con {
                display: flex;
                flex-direction: column;
                .text-top {
                  width: 500px;
                  font-size: 18px;
                  color: #333333;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                  cursor: pointer;
                }
                .bottom-box {
                  display: flex;
                  .stutd {
                    width: 71px;
                    height: 29px;
                    background: #fde4df;
                    line-height: 29px;
                    text-align: center;
                    border-radius: 5px;
                    span {
                      color: #fd7352;
                    }
                  }

                  .bottom-p {
                    display: flex;
                    span {
                      height: 29px;
                      line-height: 29px;
                      margin-left: 10px;
                    }
                    p {
                      height: 29px;
                      line-height: 29px;
                      width: 200px;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                      cursor: pointer;
                      color: #aeaeae;
                    }
                  }
                }
              }
            }
          }
          .right-box {
            width: 146px;
            float: right;
            clear: both;
            background: #f9f9f9;
            display: flex;
            flex-direction: column;
            align-items: center;
            .top-box {
              width: 87px;
              height: 24px;
              margin-top: 31px;
              border-radius: 5px;
              background: #fde4df;
              line-height: 24px;
              text-align: center;
              color: #fd7352;
              cursor: pointer;
            }

            .bottom-box {
              margin-top: 25px;
              .ant-progress-text {
                color: red;
              }
            }
          }
        }
      }
    }
  }
}
/deep/.anticon svg {
  color: #21b5fb;
  margin-left: 7px;
}
.bottom-boxone {
  margin-top: 30px;
  /deep/ .ant-progress-text {
    color: #fd7352;
  }
}
.bottom-boxtwo {
  margin-top: 30px;
}
.bottom-boxtherr {
  margin-top: 30px;
}
</style>