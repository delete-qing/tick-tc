<template>
  <div id="classroomLearning">
    <div class="pagetop">
      <div class="topcon">
        <PageHeader></PageHeader>
        <div class="Navigation">
          <div class="Navigation-top">
            <span v-if="tolink.tolink == 1" class="navHover" @click="goback">首页</span>
            <span v-if="tolink.tolink == 2" class="navHover" @click="goback">课程学习</span>
            <a-icon type="double-right" />
            <span>视频播放</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="video">
        <div class="video_item">
          <div class="video_item_div">
            <!-- 视频播放 -->
            <videoPlayer
              ref="videoPlayer"
              :videotUrl="videotUrl"
              :videotImg="videotImg"
              @onPlay="getPlay"
              @onPause="getPause"
              @onEnd="getEnd"
            ></videoPlayer>
          </div>
        </div>
        <div class="chapter_pro">
          <div class="chapter_name">{{ newQLSdata.chapterName }}&nbsp;>&nbsp;{{ newQLSdata.fileName }}</div>
          <div class="progress_con">
            <div>全部教师平均学习至{{ datanumone }}%，您学习至{{ datanumtwo }}%。</div>
            <a-tooltip v-show="datanumtwo != 100">
              <!-- <a-progress :percent="datanumone" :success-percent="datanumtwo" /> -->
              <a-progress :percent="datanumtwo" />
            </a-tooltip>
            <a-tooltip v-show="datanumtwo == 100">
              <a-progress :percent="100" />
            </a-tooltip>
          </div>
        </div>
      </div>
      <div class="details">
        <div class="details_text">
          <div class="text_name">
            <div class="text_name_text" :title="detailsData.courseName">{{ detailsData.courseName }}</div>
            <div
              class="text_name_fraction"
              :title="detailsData.courseAvg"
              v-text="detailsData.courseAvg == '' ? '' : detailsData.courseAvg"
            ></div>
          </div>
          <div class="text_date">
            <div class="text_date_left">
              <div :title="detailsData.lecturerName">{{ detailsData.lecturerName }}</div>
              <div :title="detailsData.subjectName">{{ detailsData.subjectName }}</div>
            </div>

            <div
              class="text_date_right"
              :title="
                moment(detailsData.startTime).format('YYYY.MM.DD') +
                ' - ' +
                moment(detailsData.overTime).format('YYYY.MM.DD')
              "
            >
              {{ moment(detailsData.startTime).format('YYYY.MM.DD') }}-{{
                moment(detailsData.overTime).format('YYYY.MM.DD')
              }}
            </div>
          </div>
          <div :title="detailsData.intro" style="-webkit-boxt_date_rightx-orient: vertical" class="text_brief">
            {{ detailsData.intro }}
          </div>
        </div>
        <div class="videoNum clearfix">
          <div
            :class="item.id == chapter ? 'action setnum' : 'setnum'"
            v-for="(item, index) in detailsData.chapterChildren"
            @click="chapterChange(item.id)"
            :key="item.id"
            :title="item.chapterName"
          >
            <!-- 章节数字 -->
            {{ index + 1 }}
          </div>
        </div>
        <div class="chapterDetails">
          <div class="chapter">
            <div class="chapter_name">
              <div class="chapterName">{{ videoItem.chapterName ? videoItem.chapterName : '' }}</div>
              <!-- 考试弹窗 -->
              <div
                class="chapter_name_but"
                v-if="
                  videoItem.chapterVideoChildren
                    ? videoItem.chapterVideoChildren.length > 0
                      ? videoItem.chapterVideoChildren[videoItem.chapterVideoChildren.length - 1].status == 20
                      : false
                    : false
                "
                @click="test(videoItem)"
              >
                章节考试
              </div>
            </div>
            <div
              class="chapterVideo"
              v-for="(ele, i) in videoItem.chapterVideoChildren"
              :key="ele.time"
              @click="onVideo(ele, i)"
            >
              <div class="chapterVideo_left">
                <div class="chapterVideo_img">
                  <img :src="ele.thumbUrl" alt="" />
                </div>
                <div class="chapterVideo_mark">
                  <div
                    class="chapterVideo_mark_status"
                    style="color: #31bbfd"
                    v-if="ele.status == 20 || ele.status == 30"
                  >
                    已完成
                  </div>
                  <div class="chapterVideo_mark_status" style="color: #f39687" v-else-if="ele.status == 10">进行中</div>
                  <div class="chapterVideo_mark_status" style="color: #acacac" v-else-if="ele.status == 0">未解锁</div>
                  <div class="chapterVideo_mark_time">{{ ele.time }}</div>
                </div>
              </div>
              <div style="-webkit-box-orient: vertical" class="chapterVideo_name">
                {{ ele.fileName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <addtext ref="addtext" @ok="getQueryLastStudy()"></addtext>
    <detailsmodules ref="detailsmodules"></detailsmodules>
  </div>
</template>
<script>
//组件引用
import { deleteAction, getAction, putAction } from '@/api/manage' //接口方法
import { buCourseStudyTeacher, dict } from '@/api/ajaxUrl.config.js' //接口
import PageHeader from '@/components/page/PageHeader.vue'
import videoPlayer from '@/components/videoPlayer'
import addtext from './addtext/addtext.vue'
import detailsmodules from './addtext/detailsmodules'
import { mapGetters } from 'vuex'
import moment from 'moment'
//import name from ""
export default {
  //组件注册
  components: {
    PageHeader,
    videoPlayer,
    addtext,
    detailsmodules,
  },
  data() {
    return {
      tolink: {},
      detailsData: {}, //课程信息
      videoItem: {}, //当前选择的章节
      chapter: '',
      fkEnCourseId: '', //课程ID
      videotUrl: '', //当前视频播放地址
      videotImg: '', //当前视频略缩图
      gklog: 0, //上次学习视频播放时间
      newNum: 0, //视频播放触发是用于计数
      QLSdata: {}, //学习记录数据
      newQLSdata: {}, //当前观看视频数据
      BCstate: true, //是否保存当前学习记录
      datanumone: 0, //进度条数据
      datanumtwo: 0, //进度条数据
    }
  },
  //计算属性
  computed: {},
  //实例被挂载后调用
  mounted() {
    var params = this.$route.query
    this.tolink = params
    this.fkEnCourseId = params.fkEnCourseId
    this.loadData()
  },
  //方法存放处
  methods: {
    moment,
    ...mapGetters(['userInfo']), //获取用户id
    chapterChange(value) {
      this.chapter = value //当前选择章节id
      this.detailsData.chapterChildren.forEach((e) => {
        console.log(this.detailsData.chapterChildren)
        if (e.id === this.chapter) {
          //id相同说明当前e为选中的id对于的数据
          this.videoItem = e
        }
      })
    },
    test(videoItem) {
      console.log(videoItem)
      this.$refs.addtext.add(videoItem, this.detailsData, this.QLSdata)
    },
    // 获取页面数据
    loadData() {
      var params = {
        fkEnCourseId: this.fkEnCourseId, //课程id
        fkBasicStaffId: this.userInfo().personId, //当前用户id
      }
      getAction(buCourseStudyTeacher.keepLearningAndDetails, params)
        .then((res) => {
          if (res.success == true) {
            var obj = res.result.data
            this.detailsData = obj
            var objnum = res.result.percent
            this.datanumone = objnum.allPercent
            this.datanumtwo = parseInt(objnum.onePercent)
            // e.percent = parseInt(e.percent)
            // 当数组的长度大于0时就把第一项赋值给this.videoItem否则就为空
            if (this.detailsData.chapterChildren.length > 0) {
              this.getQueryLastStudy()
            } else {
              this.videoItem = {}
            }
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {})
    },
    //获取学习记录  上次观看的视频
    getQueryLastStudy() {
      this.newNum = 0 //请空计数
      var params = {
        fkEnCourseId: this.fkEnCourseId, //课程id
        fkBasicStaffId: this.userInfo().personId, //当前用户id
      }
      getAction(buCourseStudyTeacher.queryLastStudy, params)
        .then((res) => {
          if (res.success == true) {
            this.QLSdata = res.result //学习记录
            this.videotUrl = res.result.fileSrc //当前视频播放地址
            this.videotImg = res.result.thumbUrl //当前视频略缩图
            this.gklog = res.result.corrVideoFrom //上次学习视频播放时间
            this.BCstate = true //设置可以保存当前学习记录
            this.$refs.videoPlayer.onVideoPlayer(this.videotUrl, this.videotImg, this.gklog) //设置当前播放视频为上一次学习的视频
            this.detailsData.chapterChildren.forEach((a, i) => {
              a.chapterVideoChildren.forEach((c) => {
                c.status = 0
                c.chapterName = a.chapterName
              })
            })
            //循环所有章节
            for (var i = 0; i < this.detailsData.chapterChildren.length; i++) {
              //判断当前章节是否为上一次学习章节
              if (this.detailsData.chapterChildren[i].id === res.result.fkEnCourseChapterId) {
                // console.log('当前章节是上一次学习章节')
                //当前章节是上一次学习章节
                //循环章节所有视频
                this.QLSdata.chapterName = this.detailsData.chapterChildren[i].chapterName
                for (var c = 0; c < this.detailsData.chapterChildren[i].chapterVideoChildren.length; c++) {
                  //判断当前视频是否为上一次学习视频
                  // console.log('判断当前视频是否为上一次学习视频')
                  if (
                    this.detailsData.chapterChildren[i].chapterVideoChildren[c].id ==
                    res.result.fkFileCourseChapterVideoId
                  ) {
                    //当前视频是上一次学习视频
                    this.detailsData.chapterChildren[i].chapterVideoChildren[c].status = this.QLSdata.status //把当前视频状态变为学习中
                    // console.log('终止循环')
                    break //终止循环
                  } else {
                    //当前视频不是上一次学习视频
                    this.detailsData.chapterChildren[i].chapterVideoChildren[c].status = 20 //把当前视频状态变为学习完成
                  }
                }
                break //终止循环
              } else {
                //当前章节不是上一次学习章节
                //循环章节所有视频把当前章节所有视频状态改为学习完成
                // console.log('当前章节不是上一次学习章节')
                for (var c = 0; c < this.detailsData.chapterChildren[i].chapterVideoChildren.length; c++) {
                  // console.log('把当前视频状态变为学习完成')
                  this.detailsData.chapterChildren[i].chapterVideoChildren[c].status = 20 //把当前视频状态变为学习完成
                }
              }
            }
            this.chapterChange(res.result.fkEnCourseChapterId) //定位到当前章节
            this.newQLSdata = this.QLSdata
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {})
    },
    // 导航路由
    goback() {
      if (this.tolink.tolink == 1) {
        this.$router.push({ name: 'homePage-index' })
      }
      if (this.tolink.tolink == 2) {
        this.$router.push({ name: 'learning-learning' })
      }
    },
    //根据教师id、课程id查询最近学习记录
    onVideo(obj, i) {
      console.log(obj)
      if (obj.status == 0) {
        this.$message.warning('未解锁！')
        return
      } else if (obj.status == 20) {
        //完成
        this.BCstate = false //设置不可以保存当前学习记录
      } else {
        this.BCstate = true //设置可以保存当前学习记录
      }
      this.newQLSdata = obj
      this.videotUrl = obj.fileSrc //当前视频播放地址
      this.videotImg = obj.thumbUrl //当前视频略缩图
      this.$refs.videoPlayer.onVideoPlayer(this.videotUrl, this.videotImg, '')
      this.newNum = 0 //请空计数
    },
    //视频播放时触发
    getPlay(time) {
      //因为这个是视频播放触发，240次大概60秒，然后保存
      if (this.newNum > 240) {
        this.onEdit(time, 0)
        this.newNum = 0
      } else {
        this.newNum++
      }
      // console.log('getPlay', this.newNum, time)
    },
    //视频暂停播放时触发
    getPause(time) {
      console.log('getPause', time)
    },
    //视频完成播放时触发
    getEnd(time) {
      console.log('getEnd', time)
      this.onEdit(time, 1)
    },
    //修改本次教师学习记录
    onEdit(time, state) {
      if (this.BCstate) {
        var params = {
          id: this.QLSdata.id, //教师学习记录ID
          corrVideoFrom: time, // 对应视频位置
          isFinish: state, // 是否完成本次学习
          fkFileCourseChapterVideoId: this.QLSdata.fkFileCourseChapterVideoId, //当前视频id
        }
        putAction(buCourseStudyTeacher.edit, params).then((res) => {
          if (res.success == true) {
            if (state == 1) {
              this.getQueryLastStudy()
            }
            console.log(res)
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#classroomLearning {
  height: 100%;
  overflow: auto;
  color: #acacac;
  background: #000000;
  display: flex;
  flex-direction: column;
}
.pagetop {
  background: #1d1d1d;
  .topcon {
    width: 1300px;
    margin: 0 auto;
    position: relative;
    .Navigation {
      color: #ffffff;
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
  }
}
.page-header {
  background: #1d1d1d;
  border: none;
  // .pageTitle{
  //     color: #ACACAC !important;
  // }
}
/deep/ .page-header .titleBread .pageTitle {
  color: #acacac !important;
}
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
.content {
  width: 1300px;
  flex: 1;
  margin: 0 auto;
  display: flex;
  .video {
    width: 74.5%;
    .video_item {
      width: 100%;
      height: calc(100% - 80px);
      min-height: 582px;
      max-height: 726px;
      display: flex;
      align-items: center;
      .video_item_div {
        width: 100%;
        height: 582px;
      }
      // &:after {
      //   content: '';
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   height: 93.5%;
      //   width: 1px;
      //   background-color: #1d1d1d;
      // }
      // border-left: 1px solid #1D1D1D;
    }
    .chapter_pro {
      // padding: 0 20px;
      .chapter_name {
        color: #acacac;
        font-size: 18px;
        margin: -28px 0 10px 0;
        border-left: 1px solid #000;
      }
    }
    .progress {
      display: flex;
      .progress_item {
        .progress_item_con {
          display: flex;
          flex-direction: column;
          align-items: center;
          .progress_strip {
            width: 100%;
            height: 3px;
            background: #ce6c60;
          }
          .progress_strip_bg {
            background: #1e8ff8;
          }
        }
      }
    }
  }
  .details {
    width: 25.5%;
    padding: 30px 20px;
    background: #151515;
    display: flex;
    flex-direction: column;
    .details_text {
      .text_name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .text_name_text {
          font-size: 18px;
          line-height: 33px;
          color: #e8e8e8;
          letter-spacing: 1px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .text_name_fraction {
          color: #e99083;
          font-size: 22px;
        }
      }
      .text_date {
        display: flex;
        justify-content: space-between;
        margin: 8px 0px;
        .text_date_left {
          display: flex;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 16px;
          div {
            margin-right: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .text_date_right {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .text_brief {
        word-wrap: break-word;
        word-break: break-all;
        letter-spacing: 1px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
    .videoNum {
      margin: 20px 0 16px 0;
      .setnum {
        cursor: pointer;
        width: 38px;
        height: 30px;
        border-radius: 15px;
        text-align: center;
        line-height: 30px;
        font-size: 17px;
        font-weight: 600;
        float: left;
        margin-right: 4px;
        margin-bottom: 10px;
      }
      .setnum:nth-child(7n) {
        margin-right: 0;
      }
      .action {
        background: rgba(254, 254, 255, 0.08);

        color: #f57254;
      }
    }
    .chapterDetails {
      .chapter {
        .chapter_name {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          .chapterName {
            font-size: 17px;
            color: #e8e8e8;
            letter-spacing: 1px;
          }
          .chapter_name_but {
            cursor: pointer;
            width: 79px;
            height: 28px;
            border: 1px solid #909090;
            border-radius: 14px;
            line-height: 28px;
            text-align: center;
          }
        }
        .chapterVideo {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          cursor: pointer;
          .chapterVideo_left {
            width: 126px;
            height: 66px;
            margin-right: 10px;
            position: relative;
            .chapterVideo_img {
              width: 100%;
              height: 100%;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .chapterVideo_mark {
              padding: 6px;
              font-size: 14px;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 66px;
              background: rgba(3, 3, 3, 0.74);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .chapterVideo_mark_time {
                text-align: end;
              }
            }
          }
          .chapterVideo_name {
            flex: 1;
            letter-spacing: 1px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        .chapterVideo:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
// 进度条
.progress_con {
  display: flex;
  flex-direction: column;
  // align-items: center;
  padding-bottom: 10px;
  padding-right: 10px;
}
/deep/ .ant-progress-inner {
  background: #383838;
}
/deep/ .ant-progress-success-bg {
  background: #ce6c60;
}
/deep/ .ant-progress-bg {
  background: #1e8ff8;
}
/deep/ .ant-progress-text {
  color: #acacac;
}
</style>