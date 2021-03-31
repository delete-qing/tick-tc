<template>
  <div id="homePage">
    <div class="globalTop" v-if="!loginShow">
      <div class="globalCenter">
        <div class="globalTopLeft">
          <div class="globalTopLogo">
            <router-link :to="{ path: '/homePage/index' }" class="globalTopTo">
              <img v-show="tabsTop.systemLogo.value" :src="tabsTop.systemLogo.value" alt="logo" />
            </router-link>
            <span class="TopTitle">{{ tabsTop.systemName.value }}</span>
          </div>
        </div>
        <div class="globalTopRight">
          <div class="globalTopSearch">
            <a-input-search
              v-decorator="['name', {}]"
              class="topSearch"
              placeholder="搜索课程"
              enter-button
              style="height: 100%; width: 100%"
            />
          </div>
        </div>
      </div>
    </div>
    <div :class="loginShow ? '' : 'heightOne'">
      <div class="home_top" ref="homeTop">
        <div class="home_top_carousel clearfix">
          <div class="home_carousel">
            <tick-rotation-chart
              :imgHeight="357"
              :imgWidth="994"
              :imgSource="imgSource"
              ref="TickRotationChart"
              @ok="onBackground"
            ></tick-rotation-chart>
          </div>
          <div class="home_card" v-if="loginShow">
            <div class="home_card_top">
              <div class="cardTop">
                <div class="cardTop_left">
                  <a-avatar shape="square" class="avatar" size="small" :src="listurse.photo" />
                  <!-- getAvatar() -->
                  <span class="namespan">{{ nickname() }}</span>
                </div>
                <a class="cardTop_right" @click="handleLogout">退出</a>
              </div>
              <p class="cardTop_p">
                <a @click="curriculumVideo">{{ listurse.studyCourseNum }}</a>
                <span>门课程</span>
              </p>
            </div>
            <div class="home_card_center">
              <a v-show="listurse.fileCourseChapterVideoName">
                <div @click="goDetail(listurse.enCourseId)" class="cardCenter_top">
                  <img :src="listurse.courseCover" alt="课程图片" />
                  <div class="cardCenter_top_right">
                    <p title="课程名称">{{ listurse.enCourseName }}</p>
                    <span title="上次学习时间">{{ listurse.startTime }}</span>
                  </div>
                </div>
                <div class="cardCenter_bottom">
                  <span class="cardCenter_bottom_span">已学至</span>
                  <p :title="listurse.enCourseChapterName + '>' + listurse.fileCourseChapterVideoName">
                    <span>{{ listurse.enCourseChapterName }}</span
                    ><span>{{ '>' + listurse.fileCourseChapterVideoName }}</span>
                  </p>
                </div>
              </a>
            </div>
            <a-button @click="curriculumVideo" class="cardCenter_button">课程学习</a-button>
          </div>
          <div class="home_card" v-if="!loginShow">
            <div class="logCon">
              <div class="logText">登录查看学习进度</div>
              <div class="logImg">
                <img src="./loginimg.png" alt="" />
              </div>
              <div class="logBut">
                <a-button size="large" @click="login" type="primary">立即登录</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 未登录 -->
      <div class="tabs clearfix">
        <div v-if="!loginShow">
          <a-menu v-model="current" mode="horizontal" @select="menuSelect">
            <!-- <a-menu-item key="">全部</a-menu-item> -->
            <a-menu-item v-for="item in tabstwo" :key="item.id">{{ item.name }}</a-menu-item>
          </a-menu>
        </div>
        <!-- 登录 -->
        <div v-if="loginShow" class="logtab">
          <div class="logtab_menu">
            <a-menu v-model="current" mode="horizontal" @select="menuSelect">
              <!-- <a-menu-item key="">全部</a-menu-item> -->
              <a-menu-item v-for="item in tabsone" :key="item.id">{{ item.name }}</a-menu-item>
            </a-menu>
          </div>
          <div class="logtab_but">
            <a-button @click="interest">修改兴趣</a-button>
          </div>
        </div>
      </div>
      <div class="border"></div>
      <a-spin :spinning="spinning">
        <div class="mianContent clearfix">
          <div class="con_item" v-for="(item, index) in mianData" :key="index" @click="curriculumDetail(item)">
            <img class="item_img" :src="item.courseCover" />
            <div class="item_title">{{ item.courseName }}</div>
            <div class="item_chapter">
              <span>共{{ item.courseChapter }}章</span>
              <a-divider type="vertical" />
              <span>{{ item.lecturerName }}</span>
            </div>
            <div class="item_peopleNum">
              学习人数：<span>{{ item.numberLearn }}人</span>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
    <signIn ref="signIn"></signIn>
    <interest ref="interest" @getSubjectId="course"></interest>
  </div>
</template>
<script>
//组件引用
import Vue from 'vue'
import { httpAction, getAction } from '@/api/manage'
import store from '@/store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import TickRotationChart from '@/components/TickRotationChart/index'
import signIn from './modules/signIn'
import interest from './modules/interest'
import { mapActions, mapGetters } from 'vuex'
import { dict, enCourse, dictSysConfig } from '@/api/ajaxUrl.config'
import { imgView } from '@/api/api'
import { uploadFile } from '@/api/uploadUrl.config'
export default {
  //组件注册
  components: {
    TickRotationChart,
    signIn,
    interest,
  },
  data() {
    return {
      loginShow: false,
      spinning: false,
      imgSource: [],
      userData: {
        imgSrc: require('@/views/homePage/1.jpg'),
        name: '刘改改',
        courseNum: 5,
        newCourse: {
          courseImg: require('@/views/homePage/1.jpg'),
          courseName: 'WEB前端开发精品课程',
          lastStudyDate: '2020-11-01',
          chapterName: '第一章节',
          videoName: '01.什么是WEB前端',
        },
      },
      tabs: [], //所有分类
      tabsone: [], //登录后默认分类
      tabstwo: [], //登录前默认分类
      current: [],
      mianData: [], //分类数据   框框
      dictCommonSubjectId: '', //科目id
      cationID: '', //分类多选id
      userID: '', //人员id
      pageSize: 99999,
      SubjectId: '',
      numSubjectId: [], //默认分类id
      listurse: {}, //人员id
      enCourseId: '', //人员课程id
      showtext: true,
      url: {
        list: uploadFile.list,
      },
      menus: [],
      tabsTop: {
        systemLogo: { value: '' },
        systemName: { value: '' },
      },
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)

    if (token != null) {
      // 已登录
      this.userID = this.userInfo().personId
      this.loginShow = true
    } else {
      // 未登录
      this.loginShow = false
    }
  },
  //计算属性
  computed: {},
  //实例被挂载后调用
  mounted() {
    //获取全部分类
    this.getBasicInfo()
    console.log('getTopData')
    if (getIndexObj) {
      this.tabsTop = getIndexObj
    } else {
      this.getTopData()
    }
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {
      if (this.loginShow) {
        this.getUrseInfo()
      }
    })
  },
  //方法存放处
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    getTopData() {
      getAction('/course/dictSysConfig/pageList').then((res) => {
        if (res.success == true) {
          this.tabsTop = res.result
          console.log()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 未登录 获取列表数据 获取的是默认分类
    noLogin() {
      this.spinning = true
      let params = {
        dictCommonSubjectId: this.dictCommonSubjectId, // 科目
        pageSize: this.pageSize,
      }
      getAction(enCourse.pageList, params)
        .then((res) => {
          if (res.success == true) {
            this.mianData = res.result.records
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    // 已登录 获取分类id
    loadData() {
      var params = {
        fkBasicStaffId: this.userID,
      }
      var that = this
      this.tabsone = []
      getAction(dictSysConfig.indexList, params).then((res) => {
        // console.log('ressss', res)
        if (res.success == true) {
          //获取分类
          var obj = res.result.dictCommonSubjectId //这里是对象
          that.numSubjectId = obj.split(',') //分割为数组
          // console.log('ressss')
          that.numSubjectId.forEach((e) => {
            // console.log(that.numSubjectId)
            that.tabs.forEach((i) => {
              if (e == i.id) {
                that.tabsone.push(i)
              }
            })
          })
          if (that.tabstwo.length > 0) {
            this.current = []
            this.current.push(that.tabsone[0].id)
            this.dictCommonSubjectId = that.tabsone[0].id //科目
            this.noLogin()
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 分类多选id
    course(data) {
      this.dictCommonSubjectId = data
      this.loadData()
    },
    // 登录前 获取页面全部数据 这个是首页设置的接口
    loadDataimg() {
      let that = this
      this.tabstwo = []
      var data = IndexObj()
      //获取轮播图
      this.getImgList(data.systemSliden.id)
      //获取分类
      var obj = data.systemSubject.value
      var num = obj.split(',')
      num.forEach((e) => {
        that.tabs.forEach((i) => {
          if (e == i.id) {
            // push是push进去当前当选项进去
            // tabsone是循环的选项
            that.tabstwo.push(i)
            // alert(that.tabstwo.length)
          }
        })
      })
      if (that.tabstwo.length > 0) {
        this.current = []
        this.current.push(that.tabstwo[0].id)
        this.dictCommonSubjectId = that.tabstwo[0].id //科目
        this.noLogin()
      }
    },
    // 登录前 轮播图片数据
    getImgList(id) {
      let that = this
      that.imgSource = []
      getAction(that.url.list, {
        attributionId: id,
        firstPath: 'file',
        secondPath: 'maintenanceWorkTicket',
        tableName: 'file_home',
      }).then((red) => {
        // console.log(red)
        red.result.forEach((e) => {
          // push是push进去当前当前的图片进去  也就是说push是添加选项的
          that.imgSource.push({
            id: e.id,
            src: e.fileSrc,
          })
        })
        this.$refs.TickRotationChart.onImg(that.imgSource)
        // console.log(that.imgSource)
      })
    },
    // 分类
    getBasicInfo() {
      getAction(dict.findDictForSelect, { tableName: 'dict_common_subject' }).then((res) => {
        this.tabs = res.result
        this.loadDataimg()
        if (this.loginShow) {
          this.loadData()
        }
      })
    },
    // 登录人信息
    getUrseInfo() {
      let params = {
        id: this.userID,
      }
      getAction(dictSysConfig.getUserStudyData, params).then((res) => {
        if (res.success == true) {
          this.listurse = res.result.data
          this.enCourseId = res.result.enCourseId
        }
      })
    },
    getAvatar() {
      console.log('url = ' + imgView + this.avatar())
      return imgView + this.avatar()
    },
    onBackground(rgba) {
      this.$refs.homeTop.style.background = rgba
    },
    // 点击菜单
    menuSelect(e) {
      // console.log(e)
      this.dictCommonSubjectId = e.key //科目
      this.spinning = true
      this.noLogin()
      setTimeout(() => {
        this.spinning = false
      }, 300)
    },
    // 课程详情
    curriculumDetail(e) {
      if (this.loginShow) {
        let parmas = {
          tolink: '3',
          id: e.id,
        }
        this.$router.push({ name: 'schooldetails-schooldetails', query: parmas })
      } else {
        this.$message.warning('请登录后查看')
      }
    },
    goDetail(fkEnCourseId) {
      this.$router.push({
        name: 'learning-classroomLearning-index',
        query: { tolink: '2', fkEnCourseId: fkEnCourseId },
      })
      this.$router.push({ name: 'schooldetails-schooldetails', query: parmas })
    },
    // 课程学习
    curriculumVideo() {
      this.$router.push({ name: 'learning-learning' })
    },
    // 登录弹窗
    login() {
      this.$refs.signIn.add()
    },
    //兴趣选择
    interest() {
      this.$refs.interest.edit(this.numSubjectId)
    },
    // 退出
    handleLogout() {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that
            .Logout({})
            .then(() => {
              window.location.reload()
            })
            .catch((err) => {
              that.$message.error({
                title: '错误',
                description: err.message,
              })
            })
        },
        onCancel() {},
      })
    },
  },
}
</script>
<style lang="scss" scoped>
#homePage {
  background: #fff;
  height: 100%;
}
.home_top {
  width: 100%;
  height: 357px;
  transition: background 0.6s;
  -webkit-transition: background 0.6s; /* Safari */
  .home_top_carousel {
    height: 100%;
    width: 1300px;
    margin: 0 auto;
    .home_carousel {
      height: 100%;
      width: 994px;
      float: left;
    }
    .home_card {
      margin: 28px 33px 18px 33px;
      padding: 10px;
      width: 240px;
      height: 311px;
      background-color: #ffffff;
      box-shadow: 0px 0px 35px 0px rgba(136, 136, 136, 0.43);
      border-radius: 5px;
      float: left;
      .home_card_top {
        .cardTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          .cardTop_left {
            .avatar {
              width: 53px;
              height: 53px;
            }
            .namespan {
              font-size: 16px;
              color: #333333;
              margin-left: 10px;
              vertical-align: middle;
            }
          }
          .cardTop_right {
            font-size: 16px;
            color: #b1b1b1;
          }
        }
        .cardTop_p {
          height: 48px;
          margin: 0;
          border-bottom: 2px solid #ececec;
          a {
            font-size: 26px;
            color: #333333;
            line-height: 50px;
          }
          span {
            margin-left: 10px;
            font-size: 16px;
            color: #333333;
            vertical-align: text-bottom;
          }
        }
      }
      .home_card_center {
        padding: 10px 0px 14px 0px;
        height: 125px;
        .cardCenter_top {
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            width: 97px;
            height: 100%;
          }
          .cardCenter_top_right {
            height: 100%;
            width: 110px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 17px;
              color: #333333;
              margin: 0px;
            }
            span {
              font-size: 16px;
              color: #333333;
            }
          }
        }
        .cardCenter_bottom {
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .cardCenter_bottom_span {
            display: inline-block;
            width: 61px;
            height: 29px;
            line-height: 29px;
            background-color: rgba(242, 77, 38, 0.15);
            border-radius: 5px;
            font-size: 15px;
            color: #f24d26;
            text-align: center;
          }
          p {
            margin: 0;
            width: 145px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 15px;
            color: #818181;
          }
        }
      }
      .cardCenter_button {
        width: 100%;
        height: 46px;
        font-size: 17px;
        color: #333333;
      }
      .logCon {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .logText {
        text-align: center;
        letter-spacing: 0px;
        color: #999999;
        font-size: 17px;
      }
      .logImg {
        text-align: center;
        margin: 25px 0;
      }
      .logBut {
        width: 100%;
      }
    }
  }
}
.tabs {
  width: 1300px;
  margin: 0 auto;
  .unrecommend {
    float: left;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    padding: 20px 0;
    margin-right: 142px;
  }
  .active {
    color: #23b8ff;
    border-bottom: 2px solid #23b8ff;
  }
  .logtab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .logtab_menu {
      width: 85%;
    }
    .logtab_but {
      .ant-btn-default {
        width: 135px;
        height: 35px;
      }
    }
  }
}
.unrecommend:nth-child(7) {
  margin-right: 0;
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
.border {
  border: 1px solid #f3f4f5;
}
.mianContent {
  width: 1300px;
  margin: 0 auto;
  padding-top: 30px;
  padding-bottom: 30px;
  .con_item {
    cursor: pointer;
    border: 1px solid #fff;
    box-sizing: border-box;
    width: 248px;
    height: 288px;
    margin-right: 15px;
    padding: 8px;
    float: left;
    .item_img {
      width: 100%;
      height: 154px;
    }
    .item_title {
      padding: 10px;
      color: #131313;
      font-weight: 600;
    }
    .item_chapter {
      padding: 0px 10px 0 10px;
      color: #999999;
      font-weight: 600;
    }
    .item_peopleNum {
      padding: 0px 10px 10px 10px;
      color: #999999;
      font-weight: 600;
      span {
        color: #f64e60;
      }
    }
  }
  .con_item:nth-child(5n) {
    margin: 0;
  }
  .con_item:hover {
    border: 1px solid #ddd;
    box-shadow: 1px 1px 2px 1px #ececec;
  }
}
/deep/ .ant-btn-lg {
  width: 100%;
}
/deep/ .ant-menu-item {
  font-size: 16px;
  font-weight: 600;
  height: 60px;
  line-height: 60px;
}
.globalTop {
  background-color: #ffffff;
  background-repeat: no-repeat;
  background-size: cover;
  height: 79px;
  z-index: 999;
  box-shadow: 0px 0px 13px 0px rgba(136, 136, 136, 0.51);
  .globalCenter {
    margin: 0 auto;
    position: relative;
    max-width: 1300px;
    min-width: 1000px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .globalTopLeft {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .globalTopLogo {
        display: flex;
        align-items: center;
        background-size: contain;
        .globalTopTo {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        img {
          width: 55px;
        }
        .TopTitle {
          font-size: 28px;
          color: #333333;
          margin-left: 18px;
        }
      }
      .globalTopSort {
        display: flex;
        align-items: center;
        background-size: contain;
        margin-left: 85px;
        img {
          width: 27px;
        }
        .TopSpan {
          font-size: 24px;
          color: #8c8c8c;
          margin-left: 9px;
          vertical-align: middle;
        }
      }
    }
    .globalTopRight {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .globalTopSearch {
        width: 350px;
        height: 40px;
      }
      .globalTopHead {
        display: flex;
        align-items: center;
      }
    }
  }
}
.ant-dropdown-link {
  cursor: pointer;
}
.heightOne {
  height: calc(100% - 79px);
  overflow: auto;
}
</style>