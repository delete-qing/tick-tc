<template>
  <div id="Revolution">
    <div class="all">
      <page-header></page-header>
      <div class="Navigation">
        <div class="Navigation-top">
          <span v-if="tolink.tolink == 1" class="navHover" @click="goback">课程管理</span>
          <span v-if="tolink.tolink == 2" class="navHover" @click="goback">课程统计</span>
          <span v-if="tolink.tolink == 3" class="navHover" @click="goback">首页</span>
          <span v-if="tolink.tolink == 4" class="navHover" @click="goback">首页</span>
          <a-icon type="double-right" />
          <span>课程详情</span>
        </div>
      </div>
      <!-- 头部 -->
      <a-spin :spinning="spinning">
        <div class="con-all">
          <div class="conter">
            <div class="con">
              <div class="con-img">
                <img :src="listObj.courseCover" alt="" />
              </div>
              <!-- 文字 -->
              <div class="con-text">
                <div class="top-text">
                  <p style="font-size: 24px">{{ listObj.courseName }}</p>
                  <p>
                    <span>讲师：{{ listObj.lecturerName }}</span>
                    <span
                      >分类：<span>{{ listObj.subjectName }}</span></span
                    >
                  </p>
                </div>
                <div class="bottom-text">
                  <p class="one">
                    学习总人数：<span>{{ listObj.numberLearn }}</span>
                  </p>
                  <span class="stattime">开始时间：{{ moment(listObj.startTime).format('YYYY-MM-DD') }}</span>
                  <span class="endtime">结束时间：{{ moment(listObj.overTime).format('YYYY-MM-DD') }}</span>
                </div>
              </div>
              <div>
                <a-button v-show="show == 0" @click="addname">报名</a-button>
                <span v-show="show == 1">已报名</span>
                <span v-show="show == 3">报名结束</span>
              </div>
              <!-- 图标 -->
              <div class="text-icon" v-has="'user:kcadd'">
                <div class="icon-box" @click="courseEdit(listObj)">
                  <a-icon type="form" />
                </div>
              </div>
            </div>
            <div class="bottom">
              <p style="-webkit-box-orient: vertical" class="bottm-p">
                {{ listObj.intro }}
              </p>
            </div>
          </div>
          <!-- 下半部分 -->
          <div class="con-box">
            <div class="con-title">
              <div><img src="@assets/image/1.png" /> <span>章节列表</span></div>
              <a-button @click="addNum()" v-has="'user:kcadd'">新增</a-button>
            </div>
            <a-collapse class="tick-collapse" v-for="(item, index) in bottom" :key="item.id" default-active-key="1">
              <a-collapse-panel key="1" :show-arrow="false">
                <template slot="header">
                  <div class="top-left">
                    <div class="order-left">
                      <span>{{ index + 1 }}</span>
                    </div>
                    <div class="order-title">
                      <p>{{ item.chapterName }}</p>
                    </div>
                  </div>
                  <div class="top-right" v-has="'user:kcadd'">
                    <div><img @click="detailEdit(item)" src="@assets/image/6.png" /></div>
                    <div>
                      <a-popconfirm title="确认要删除章？" ok-text="是" cancel-text="否" @confirm="clear(item.id)">
                        <div class="icon-box deteleImg">
                          <img src="@assets/image/9.png" />
                        </div>
                      </a-popconfirm>
                    </div>
                  </div>
                </template>
                <div class="player">
                  <div class="player-box" v-for="videos in item.chapterVideoChildren" :key="videos.id">
                    <img :src="videos.thumbUrl" />
                    <div class="mask">
                      <img class="rid" @click="vidoe(videos)" src="@assets/image/shipin.png" />
                      <img
                        class="cha"
                        v-has="'user:kcadd'"
                        @click="deletavidoe(videos.id)"
                        src="@assets/image/cha.png"
                      />
                    </div>
                    <div class="player-bottom">
                      <p class="p-trxt" style="-webkit-box-orient: vertical">
                        {{ videos.fileName }}
                      </p>
                      <span>时长：{{ formatSeconds(videos.fileLength) }}</span>
                    </div>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
      </a-spin>
      <schooldadd ref="schooldadd" @getgetbottom="getgetbottom"></schooldadd>
      <addmodules ref="addmodules" @ok="loadData"></addmodules>
      <video-popup ref="videoPopup"></video-popup>
    </div>
  </div>
</template>   
<script>
//组件引用
import { deleteAction, getAction, putAction } from '@/api/manage' //接口方法
import { enCourse, dict } from '@/api/ajaxUrl.config.js' //接口
import PageHeader from '@/components/page/PageHeader.vue'
import schooldadd from './schooldadd/schooldadd.vue'
import addmodules from '../Revolution/modules/addmodules'
import { mapGetters } from 'vuex'
import videoPopup from '@/components/videoPlayer/popup'
import moment from 'moment'
export default {
  //组件注册
  components: {
    PageHeader,
    schooldadd,
    addmodules,
    videoPopup,
  },

  data() {
    return {
      listObj: {},
      tolink: {},
      courseId: '', //课程id
      chapterId: '', //章节id
      bottom: [], //章节数据
      videos: [], //视频数据
      show: true,
      videoId: '', //视频id
      userID: '', //人员id
      show: 0,
      spinning: false,
    }
  },
  //计算属性
  computed: {},
  //   computed: {},
  created() {},
  //实例被挂载后调用
  mounted() {
    this.userID = this.userInfo().personId
    var parmas = this.$route.query
    console.log(parmas)
    this.tolink = parmas
    this.courseId = parmas.id
    // console.log(parmas)
    this.loadData()
    this.editadd()
    // console.log(parmas)
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {
      this.getgetbottom()
    })
  },

  //方法存放处
  methods: {
    moment,
    ...mapGetters(['userInfo']), //获取用户id
    addNum() {
      this.$refs.schooldadd.add(this.courseId, '')
      this.$refs.schooldadd.title = '新增章节'
    },
    formatSeconds(value) {
      let result = parseInt(value)
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      let m =
        Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60)
      let s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60)

      let res = ''
      res += `${h}:`
      res += `${m}:`
      res += `${s}`
      return res
    },
    // 详情编辑
    detailEdit(record) {
      this.$refs.schooldadd.add(this.courseId, record)
      this.$refs.schooldadd.title = '编辑章节'
    },
    // 课程编辑
    courseEdit(record) {
      // console.log(record)
      this.$refs.addmodules.edit(record)
      this.$refs.addmodules.title = '编辑课程'
    },
    // 点击视频
    vidoe(item) {
      this.$refs.videoPopup.video(item.fileSrc)
      // console.log(item.fileSrc)
    },
    // 查询报名
    editadd() {
      var params = {
        fkBasicStaffId: this.userID,
        fkEnCourseId: this.courseId,
      }
      putAction(enCourse.isNotRegistration, params).then((res) => {
        if (res.success == true) {
          this.show = res.result.isNot
        } else {
          // this.listdata = []
          this.$message.warning(res.message)
        }
      })
    },
    // 开始报名
    addname() {
      var params = {
        fkBasicStaffId: this.userID,
        fkEnCourseId: this.courseId,
      }
      putAction(enCourse.courseRegistration, params).then((res) => {
        if (res.success == true) {
          this.show = res.result.isNot
        } else {
          // this.listdata = []
          this.$message.warning(res.message)
        }
      })
    },
    // 获取数据  数据要初始化
    loadData() {
      this.spinning = true
      var params = {
        courseId: this.courseId,
      }
      getAction(enCourse.queryById, params).then((res) => {
        if (res.success == true) {
          this.listObj = res.result
          // 获取到的时间
          var endtime = moment(res.result.overTime).format('YYYY-MM-DD')
          // 获取到现在的时间
          var newtime = moment().format('YYYY-MM-DD ')
          // 两个时间相减
          var time = moment(endtime).diff(moment(newtime), 'days')
          this.spinning = false
          console.log(time)
          if (time < 0) {
            this.show = 3
          }
        } else {
          this.spinning = false
          this.$message.warning(res.message)
        }
      })
    },
    // 获取章节
    getgetbottom() {
      var params = {
        courseId: this.courseId,
      }
      getAction(enCourse.chapterByCourseId, params).then((res) => {
        if (res.success == true) {
          this.bottom = res.result
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 删除单个视频
    deletavidoe(videoId) {
      var params = {
        videoId: videoId, //视频id
      }
      deleteAction(enCourse.deleteVideo, params).then((res) => {
        if (res.success == true) {
          this.$message.success('删除成功')
          this.getgetbottom()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 删除章节
    clear(id) {
      var params = {
        courseId: this.courseId,
        id: id, //视频id
      }
      getAction(enCourse.deleteChapter, params).then((res) => {
        if (res.success) {
          this.$message.success('删除成功')
          this.getgetbottom()
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    // 导航
    goback() {
      if (this.tolink.tolink == 1) {
        this.$router.push({ name: 'Revolution-index' })
      }
      if (this.tolink.tolink == 2) {
        this.$router.push({ name: 'analysis-statistics-statistics' })
      }
      if (this.tolink.tolink == 3) {
        this.$router.push({ name: 'homePage-index' })
      }
      if (this.tolink.tolink == 4) {
        this.$router.push({ name: 'homePage-index' })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#Revolution {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #ffffff;
  padding: 30px;
  .all {
    width: 1300px;
    margin: 0 auto;
    border-radius: 10px;
    border: solid 1px #e5e6e7;
    position: relative;
    .Navigation {
      font-size: 16px;
      position: absolute;
      top: 18px;
      right: 30px;
      .navHover {
        cursor: pointer;
      }
      .navHover:hover {
        color: #23b8ff;
      }
      .Navigation-top {
        .anticon svg {
          margin: 0 5px;
        }
      }
    }
    .con-all {
      padding-bottom: 30px;
      .conter {
        width: 1239px;
        // height: 400px;
        border: 1px solid #e5e6e7;
        border-radius: 5px;
        margin: 20px auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
        .con {
          width: 100%;
          display: flex;
          .con-img img {
            width: 282px;
            height: 172px;
          }
          .con-text {
            width: 64%;
            height: 172px;
            //   border: 1px red solid;
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .top-text {
              p {
                color: #333333;
                width: 600px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                // cursor: pointer;
                line-height: 30px;
                font-weight: 500;
                margin-bottom: 12px;
                span {
                  font-size: 18px;
                  margin-right: 30px;
                }
              }
            }
            .bottom-text {
              font-size: 18px;
              .one {
                color: #808080;
                margin-bottom: 10px;
                span {
                  font-size: 20px;
                  font-weight: 500;
                  color: #fd7352;
                }
              }
              .stattime {
                margin-right: 30px;
                color: #fd7352;
              }
              .endtime {
                color: #23b8ff;
              }
            }
          }
          .text-icon {
            width: 60px;
            cursor: pointer;
            //   border: 1px red solid;
            .icon-box {
              // margin: 18px;
              float: right;
              clear: both;
              width: 32px;
              height: 32px;
              background-color: #e6f7ff;
              border-radius: 2px;
              .anticon svg {
                margin: 6px;
                width: 20px;
                height: 20px;
                font-size: 19px;
                color: #23b8ff;
              }
            }
          }
        }
        .bottom {
          width: 100%;
          // height: 100px;
          margin-top: 28px;
          // border: 1px red solid;
          font-size: 15px;
          p {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            margin-bottom: 0px;
          }
        }
      }
      .con-box {
        width: 1239px;
        margin: 0 auto;
        .con-title {
          display: flex;
          align-items: center;
          img {
            width: 20px;
            height: 21px;
          }
          span {
            margin-left: 10px;
            font-size: 20px;
            vertical-align: middle;
          }
          button {
            width: 93px;
            height: 36px;
            margin-left: 20px;
            // margin-top: -3px;
            font-size: 18px;
            color: #23b8ff;
            border: 1px solid #23b8ff;
          }
        }
        .order {
          width: 100%;
          margin-top: 20px;
          border: 1px solid #e5e6e7;
          border-radius: 5px;
          .order-top {
            height: 60px;
            background: #f8f8f8;
            border: 1px solid #e5e6e7;
            border-radius: 5px 5px 0px 0px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            .left {
              display: flex;
              .order-left {
                width: 30px;
                height: 30px;
                margin: 15px;
                color: #23b8ff;
                border: 2px #23b8ff solid;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                  height: 30px;
                  width: 30px;
                  margin: 5px;
                  line-height: 30px;
                  text-align: center;
                }
              }
              .order-title {
                height: 60px;
                p {
                  height: 60px;
                  text-align: center;
                  line-height: 60px;
                  font-weight: 500;
                  color: #333333;
                  font-size: 18px;
                }
              }
            }
            .order-right {
              margin-top: 12px;
              img {
                width: 22px;
                height: 22px;
                margin-right: 15px;
              }
            }
          }
        }
      }
    }
  }
}
.player {
  display: flex;
  flex-wrap: wrap;
  .player-box {
    width: 183px;
    height: 203px;
    border: 1px solid #e5e6e7;
    border-radius: 5px;
    position: relative;
    margin-left: 20px;
    margin-top: 20px;
    cursor: pointer; //鼠标变小手
    &:hover .mask {
      display: block;
    }
    .mask {
      width: 100%;
      height: 112px;
      margin: auto;
      position: absolute;
      top: 0;
      right: 0;
      display: none;
      background-color: rgba(0, 0, 0, 0.7);
      transition: width 2s;
      transition-timing-function: linear;
      transition-delay: 1s;
      .cha {
        width: 30px;
        height: 30px;
        position: absolute;
        top: -15px;
        right: -15px;
      }
      .rid {
        display: block;
        width: 62px;
        height: 62px;
        margin: 26px auto;
      }
    }

    img {
      width: 100%;
      height: 112px;
      overflow: hidden;
    }
    .player-bottom {
      padding: 8px;
      display: flex;
      height: 93px;
      flex-direction: column;
      justify-content: space-between;
      font-size: 15px;
      .p-trxt {
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
      }
      span {
        margin-top: 8px;
      }
    }
  }
}
.top-right {
  display: flex;
}
/deep/ .ant-form-item {
  margin-bottom: 15px;
}
</style>