<template>
  <div id="Revolution">
    <div class="all">
      <page-header></page-header>
      <!-- 分类 -->
      <div class="type">
        <div></div>
        <span>分类：</span>
        <div class="type-text">
          <span :class="flsteta == '' ? 'sty' : ''" @click="onsteta('')">全部</span>
          <!-- 分类 -->
          <span
            :class="flsteta == item.id ? 'sty' : ''"
            @click="onsteta(item.id)"
            v-for="item in colors"
            :key="item.id"
            >{{ item.name }}</span
          >
        </div>
        <span class="butt" @click="addNum"><a-button v-has="'user:kcadd'">新增</a-button></span>
      </div>
      <!-- 块 -->
      <a-spin :spinning="spinning">
        <div class="conter">
          <div class="con-top" v-for="(item, index) in listdata" :key="index">
            <div class="con-img">
              <img :src="item.courseCover" />
            </div>
            <!-- 文字部分 -->
            <div class="con-text">
              <p class="text-top">
                <!-- 路由跳转 -->
                <router-link :to="{ path: '/schooldetails/schooldetails', query: { tolink: '1', id: item.id } }">
                  <span> {{ item.courseName }}</span>
                  <!-- @click="linkto(item)" -->
                </router-link>
              </p>
              <!-- <span class="right-top">{{ item.dictCommonSubjectName }}</span> -->
              <p class="text-con">
                <span> 课程简介：{{ item.intro }}</span
                ><br />
                <span> 课程章节：{{ item.courseChapter }}章</span>
              </p>
              <p class="text-bottom">
                <span class="techname">讲师：{{ item.lecturerName }}</span>
                <span class="totlenum"
                  >学习人数：<a href="#" class="num">{{ item.numberLearn }}</a></span
                >
                <span class="start-time">开始时间：{{ item.startTime }}</span>
                <span class="end-time">结束时间：{{ item.overTime }}</span>
              </p>
            </div>
            <!-- icon -->

            <div class="text-icon">
              <div class="rigth-topiocn" style="width: 90px">
                <span>{{ item.dictCommonSubjectName }}</span>
              </div>

              <div class="rigth-botiocn" v-has="'user:kcadd'">
                <div class="icon-box" @click="edit(item)">
                  <a-icon type="form" />
                </div>
                <a-popconfirm title="确认删除" ok-text="是" cancel-text="否" @confirm="clear(item)">
                  <div class="icon-box deteleImg">
                    <img src="@assets/image/9.png" alt="" />
                  </div>
                </a-popconfirm>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
      <!-- 分页 -->
      <div class="page">
        <a-pagination
          show-quick-jumper
          :default-current="ipagination.current"
          :current="ipagination.current"
          :total="ipagination.total"
          :pageSize="ipagination.pageSize"
          @change="onChange"
        />
        <div class="page-right">
          <p>
            共<span class="color-num">{{ ipagination.total }}</span
            >条数据<span class="line-num">单页显示</span>
            <a-select default-value="30" @change="handleChange" size="small">
              <a-select-option :value="item" v-for="item in pageSize" :key="item">{{ item }}</a-select-option>
            </a-select>
            条
          </p>
        </div>
      </div>
      <!-- 引入 -->
      <addmodules ref="addmodules" @ok="loadData"></addmodules>
    </div>
  </div>
</template>
    
<script>
//组件引用
import { deleteAction, getAction } from '@/api/manage' //接口方法
import { enCourse, dict } from '@/api/ajaxUrl.config.js' //接口
import PageHeader from '@/components/page/PageHeader.vue'
import addmodules from './modules/addmodules'
import { filterObj } from '@/utils/util' //公共方法
export default {
  //组件注册
  components: {
    PageHeader,
    addmodules,
  },
  data() {
    return {
      // color: false,
      flsteta: '', //当前选中分类
      dictCommonSubjectId: '', //科目id
      listdata: [],
      spinning: false,
      pageSize: ['10', '20', '30', '40', '50', '100'],
      // 分页参数
      ipagination: {
        current: 1,
        pageSize: 30,
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      colors: [], //分类
      courseName: '', //传过来课程名称
    }
  },
  //计算属性
  computed: {},
  // 监视路由变化  这里是点击上面输入框触发的事件
  watch: {
    $route(to, from) {
      // console.log(from)
      // console.log(to)
      this.getNameID()
    },
  },
  // 页面初始化
  created() {
    this.getBasicInfo()
  },
  //实例被挂载后调用
  mounted() {
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {
      // console.log('this.$route.query', this.$route.query)
      // 这里是点击上部分搜索框的时候执行的
      this.getNameID()
    })
  },
  //方法存放处
  methods: {
    getNameID() {
      // 如果这里传过来的是id就执行点击事件
      if (this.$route.query.id) {
        this.onsteta(this.$route.query.id)
      }
      // 如果这里传过来的是字 就把name赋值给课程名称
      if (this.$route.query.name) {
        this.courseName = this.$route.query.name
      } else {
        this.courseName = ''
      }
      this.loadData()
    },
    // 添加
    addNum() {
      this.$refs.addmodules.add()
      this.$refs.addmodules.title = '新增课程'
    },
    // 编辑
    edit(data) {
      this.$refs.addmodules.edit(data)
      this.$refs.addmodules.title = '编辑课程'
    },
    // 动态切换
    onsteta(id) {
      this.dictCommonSubjectId = id //科目
      this.flsteta = id
      this.loadData()
    },
    onChange(page, pageSize) {
      this.ipagination.current = page
      this.ipagination.pageSize = pageSize
      this.loadData()
    },
    handleChange(value) {
      this.ipagination.current = 1
      this.ipagination.pageSize = value
      this.loadData()
    },
    // 获取数据  数据要初始化
    loadData(arg) {
      // alert(1)
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.spinning = true
      var params = this.getQueryParams()
      getAction(enCourse.pageList, params)
        .then((res) => {
          if (res.success == true) {
            this.listdata = res.result.records
            this.ipagination.total = res.result.total
            console.log(res)
          } else {
            this.listdata = []
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    // 分页数据接口
    getQueryParams() {
      var param = Object.assign({}, {}) //两个对象相加
      param.pageNo = this.ipagination.current //分页默认值
      param.pageSize = this.ipagination.pageSize
      param.dictCommonSubjectId = this.dictCommonSubjectId // 科目
      param.courseName = this.courseName //搜索名称
      return filterObj(param)
    },
    // 删除数据
    clear(e) {
      this.confirmLoading = true
      let myData = {}
      myData = Object.assign({}, e)
      myData.id = e.id
      getAction(enCourse.delete, myData)
        .then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
            this.loadData(1)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    // 分类 数据要初始化
    getBasicInfo() {
      // 查询分类  要用到字典表
      getAction(dict.findDictForSelect, { tableName: 'dict_common_subject' }).then((res) => {
        this.colors = res.result
        // console.log(res)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
#Revolution {
  width: 100%;
  background-color: #ffffff;
  padding: 30px;
  .all {
    width: 1300px;
    // height: 100%;
    overflow: hidden;
    margin: 0 auto;
    border-radius: 10px;
    border: solid 1px #e5e6e7;
    .type {
      width: 1238px;
      margin: 15px 31px;
      display: flex;
      cursor: pointer;
      span {
        line-height: 45px;
        font-size: 18px;
        width: 80px;
      }
      .butt {
        width: 120px;
        button {
          width: 93px;
          height: 36px;
          // margin-right: 20px;
          // margin-top: -3px;
          font-size: 18px;
          color: #23b8ff;
          border: 1px solid #23b8ff;
        }
      }
      .type-text {
        width: 100%;
        line-height: 45px;
        font-size: 18px;
        span {
          margin-left: 30px;
          // display: inline-block;
          // width: 90px;
        }
      }
      .sty {
        color: #2692ff;
      }
    }
    .conter {
      min-height: calc(100vh - 400px);
      margin: 0 30px;
      .con-top {
        width: 1230px;
        background-color: #ffffff;
        border-radius: 5px;
        border: solid 1px #e5e6e7;
        display: flex;
        flex-direction: row;
        margin-top: 5px;
        justify-content: space-between;
        .con-img img {
          margin: 21px;
          width: 138px;
          height: 87px;
          background-color: #1880ed;
        }
        .con-text {
          width: 100%;
          height: 107px;
          margin-top: 20px;
          .text-top {
            width: 700px;
            font-size: 18px;
            color: #333333;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-bottom: 0px;
            cursor: pointer;
            span {
              color: #1880ed;
              text-decoration: underline;
            }
          }

          .text-con {
            width: 750px;
            font-size: 14px;
            margin: 0;
            color: #333333;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-bottom: 2px;
          }
          .text-bottom {
            display: flex;
            .techname {
              width: 140px;
            }
            .totlenum {
              width: 140px;
            }
            color: #808080;
            a {
              color: #fd7352;
              text-decoration: none;
            }
            .start-time {
              width: 200px;
              color: #fd7352;
            }
            .end-time {
              color: #23b8ff;
            }
          }
        }
        .text-icon {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-right: 15px;
          .rigth-topiocn {
            margin: 5px;
            text-align: right;
            font-size: 18px;
            color: #999999;
          }
          .rigth-botiocn {
            display: flex;
            cursor: pointer;
            // flex-direction: column;
            align-items: flex-end;
            margin-left: 15px;
          }
          .icon-box {
            margin: 10px;
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
    }
    .page {
      // position: fixed;
      bottom: 3%;
      display: flex;
      justify-content: space-between;
      margin: 15px 30px;
      .page-right {
        float: right;
        clear: both;
        display: flex;
        justify-content: center;
        p {
          font-size: 14px;
          margin-top: 5px;
          .color-num {
            color: #23b8ff;
            margin: 0 5px;
          }
          .line-num {
            margin: 0 10px;
          }
        }
      }
    }
  }
}
.deteleImg {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0 !important;
  img {
    width: 20px;
    height: 20px;
  }
}
</style>