<template>
  <div id="Revolution">
    <div class="all">
      <page-header></page-header>
      <!-- 头部 -->
      <div class="con">
        <div class="top">
          <a-form :form="form" layout="inline">
            <a-row :gutter="8">
              <!-- <a-col :xl="8">
                <a-form-item label="年月">
                  <a-range-picker v-decorator="['startTime', {}]" :size="size" />
                </a-form-item>
              </a-col> -->
              <!-- 按钮 -->
              <div class="buttons">
                <!-- <div><a-button type="primary">搜索</a-button></div> -->
                <div class="right-button">
                  <a download :href="urls + '/tick-tc/sys/sysOffice/exportWord'">
                    <a-button>导出</a-button>
                  </a>
                  <a-button @click="back" v-show="parentId != 0">返回</a-button>
                </div>
              </div>
            </a-row>
          </a-form>
        </div>
        <div class="godetails">
          <!-- 主表格数据 -->
          <template v-if="showdata == 1">
            <div class="tables">
              <a-table
                rowKey="id"
                :pagination="false"
                :columns="columns"
                :dataSource="dataone"
                :scroll="{ y: 'calc(100vh - 420px)' }"
              >
                <a slot="allNum" slot-scope="text, record" @click="display(record.id)">{{ text }}</a>
              </a-table>
            </div>
          </template>
          <template v-if="showdata == 2">
            <div class="tables">
              <a-table
                rowKey="id"
                :pagination="false"
                :columns="columndata"
                :dataSource="lastdata"
                :scroll="{ y: 'calc(100vh - 420px)' }"
              >
                <span slot="status" slot-scope="status">
                  <span :key="status">{{ status == 30 ? '是' : '否' }}</span>
                </span>
              </a-table>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template> 
<script>
//组件引用
import { httpAction, getAction, postAction } from '@/api/manage'
import { stCourseOrder, dict, partyAffairs, sysOffice, basicStaff } from '@/api/ajaxUrl.config'
import { filterObj } from '@/utils/util'
import PageHeader from '@/components/page/PageHeader.vue'
import moment from 'moment'
import exportExcel from '@/components/ExportExcel'
export default {
  //组件注册
  components: {
    PageHeader,
  },

  data() {
    return {
      formLayout: 'horizontal', //输入框
      // names: ['图书馆', '学校', '博物馆'],
      form: this.$form.createForm(this),
      // subjectData: [],
      isShow: 1,
      size: 'default',
      excelExportData: [],
      columns: [
        {
          title: '上级机构',
          dataIndex: 'parentName',
          width: 100,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '机构名称',
          dataIndex: 'name',
          width: 120,
          align: 'center',
          ellipsis: true,
        },
        // {
        //   title: '时间',
        //   align: 'center',
        //   dataIndex: 'startTime',
        //   width: 80,
        // },

        {
          title: '学习总人次',
          align: 'center',
          dataIndex: 'allNum',
          scopedSlots: { customRender: 'allNum' },
          width: 70,
        },
        {
          title: '学习完成人次',
          align: 'center',
          dataIndex: 'finalNum',
          width: 100,
        },
        {
          title: '未完成学习人次',
          align: 'center',
          dataIndex: 'noFinalNum',
          width: 100,
        },
        // {
        //   title: '平均分',
        //   align: 'center',
        //   dataIndex: 'avg',
        //   width: 70,
        // },
      ],
      columndata: [
        {
          title: '课程名称',
          dataIndex: 'enCourseName',
          width: 120,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '所属机构',
          dataIndex: 'officeName',
          width: 120,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '所属职位',
          dataIndex: 'positionName',
          width: 120,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '所属年级',
          dataIndex: 'className',
          width: 120,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '所授科目',
          dataIndex: 'dcsName',
          width: 120,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'basicName',
          width: 90,
        },

        {
          title: '是否完成学习',
          align: 'center',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          width: 150,
        },
        {
          title: '平均分',
          align: 'center',
          dataIndex: 'avg',
          width: 90,
        },
      ],
      // 值
      dataone: [],
      lastdata: [],
      parentId: 0,
      backId: [],
      backKey: 0,
      urls: this.getUrl(),
      showdata: 1,
    }
  },
  //计算属性
  computed: {},
  //实例被挂载后调用
  mounted() {
    this.getUrl()
    // console.log(this.getUrl())
    this.loadData()
    this.$nextTick(() => {})
  },
  //方法存放处
  methods: {
    moment,
    exportExcel,
    // 第一张表 获取表格数据
    loadData() {
      var params = this.getQueryParams()
      // if (parentId && parentId != '') {
      //   params.parentId = parentId
      // }
      getAction(basicStaff.getOfficeData, params).then((res) => {
        if (res.success) {
          // console.log(res.result.officeData)
          if (res.result.officeData.length > 0) {
            this.dataone = res.result.officeData
          } else {
            this.showdata = 2
            this.lastdata = res.result.courseData
          }
        } else {
          this.dataone = []
          this.$message.warning(res.message)
        }
      })
    },
    getQueryParams() {
      var param = Object.assign({}, {}) //两个对象相加
      // 获取到的值进行处理  时间传值
      this.form.validateFields((err, values) => {
        param.startTime = values.startTime ? values.startTime[0].format('YYYY-MM-DD') : ''
        param.overTime = values.startTime ? values.startTime[1].format('YYYY-MM-DD') : ''
        param.parentId = this.parentId
        // 这里是form表单里的东西  所以在这里设置
      })

      return filterObj(param)
    },
    // 点击事件
    display(parentId) {
      this.backId.push(parentId)
      this.backKey++
      this.parentId = parentId
      this.loadData()
      // console.log(this.backId, this.backKey)
    },
    // 回退到主页
    back() {
      this.parentId = this.backId[this.backKey - 2]
      if (this.backKey - 2 < 0) {
        this.parentId = 0
      }
      this.backKey--
      console.log(this.backId, this.backKey)
      console.log(this.parentId)
      if (this.parentId == 0) {
        this.backId = []
      }
      this.loadData()
      this.showdata = 1
    },
    // 搜索
    search() {
      this.loadData()
    },
    // 导出

    getUrl() {
      var url = window.location.href
      url = url.substring(url.indexOf('//') + 2)
      var str = url.split('/')
      url = 'http://' + str[0]
      this.urls = url
      console.log(this.urls)
    },
  },
}
</script>
<style lang="scss" scoped>
#Revolution {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 30px;
  .all {
    width: 1300px;
    height: 100%;
    margin: 0 auto;
    border-radius: 10px;
    border: solid 1px #e5e6e7;
    // position: relative;
    .con {
      margin: 0 auto;
      width: 1237px;
      .top {
        margin: 31px 0;
        .buttons {
          display: flex;
          margin-top: 4px;
          .right-button {
            button {
              margin-left: 14px;
              border: 1px #23b8ff solid;
              color: #23b8ff;
            }
          }
        }
      }
      .godetails {
        button {
          float: right;
          clear: both;
        }
      }
    }
  }
}
</style>