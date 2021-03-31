<template>
  <div id="Revolution">
    <div class="all">
      <page-header></page-header>
      <!-- 头部 -->
      <div class="con">
        <div class="top">
          <a-form :form="form" layout="inline">
            <a-row :gutter="8">
              <a-col :xl="8">
                <a-form-item label="年月">
                  <a-range-picker v-decorator="['startTime', {}]" :size="size" />
                  <!-- <a-date-picker v-decorator="['startTime', {}]" /> -->
                </a-form-item>
              </a-col>
              <a-col :xl="6">
                <a-form-item label="分类">
                  <a-select placeholder="请选择" style="width: 200px" v-decorator="['dictCommonSubjectId', {}]">
                    <a-select-option :value="item.id" v-for="item in subjectData" :key="item.id">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <!-- 按钮 -->
              <div class="buttons">
                <div><a-button type="primary" @click="search">搜索</a-button></div>
                <div class="right-button">
                  <a-button @click="clear">重置</a-button>
                  <a-button @click="leadingOut">导出</a-button>
                  <a-button v-if="!isShow" @click="back"> 返回 </a-button>
                </div>
              </div>
            </a-row>
          </a-form>
        </div>

        <!-- 主表格数据 -->
        <template v-if="isShow">
          <div class="tables">
            <a-table
              :columns="columns"
              :data-source="dataone"
              :pagination="ipagination"
              :loading="loading"
              @change="handleTableChange"
              :scroll="{ y: 'calc(100vh - 420px)' }"
            >
              <a slot="allNum" slot-scope="text, record" @click="display(record.id)">{{ text }}</a>
              <!-- 获取点击事件的id  record.id  这个是方法的调用   要在mothods写方法也就是display方法 -->
            </a-table>
          </div>
        </template>

        <!-- 跳转表格 -->
        <template v-if="!isShow">
          <div class="tables">
            <a-table
              :columns="cols"
              :data-source="datatwo"
              :pagination="ipaginationstwo"
              :loading="loadingtwo"
              @change="handleTableChangetwo"
              :scroll="{ y: 'calc(100vh - 420px)' }"
            >
              <a @click="godatails(record)" slot="classname" slot-scope="text, record">{{ text }}</a>
              <span slot="status" slot-scope="status">
                <span :key="status">{{ status == 20 ? '是' : '否' }}</span>
              </span>
            </a-table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>   
<script>
//组件引用

import PageHeader from '@/components/page/PageHeader.vue'
import { httpAction, getAction } from '@/api/manage'
import { stCourseOrder, dict } from '@/api/ajaxUrl.config'
import { filterObj } from '@/utils/util'
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
      isShow: true,
      form: this.$form.createForm(this),
      names: ['图书馆', '学校', '博物馆'],
      subjectData: [],
      loading: false,
      loadingtwo: false,
      size: 'default',
      dictCommonSubjectId: '', //分类id
      // 第一个分页
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      // 第二个分页
      ipaginationstwo: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      twoID: '',
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 80,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '课程名称',
          align: 'center',
          dataIndex: 'courseName',
          ellipsis: true,
          width: 200,
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'startTime',
          width: 200,
        },
        {
          title: '分类',
          align: 'center',
          dataIndex: 'subjectName',
          width: 150,
        },
        {
          title: '学习总人数',
          align: 'center',
          dataIndex: 'allNum',
          scopedSlots: { customRender: 'allNum' },
          width: 170,
        },
        {
          title: '未完成学习人数',
          align: 'center',
          dataIndex: 'noNum',
          width: 170,
        },
        {
          title: '平均分',
          align: 'center',
          dataIndex: 'avgScore',
          width: 90,
        },
      ],
      cols: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '课程名称',
          align: 'center',
          dataIndex: 'courseName',
          width: 150,
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'startTime',
          width: 160,
        },
        {
          title: '所属机构',
          align: 'center',
          dataIndex: 'officeName',
          width: 150,
        },
        {
          title: '所属职位',
          align: 'center',
          dataIndex: 'positionName',
          width: 100,
        },
        {
          title: '所属年级',
          align: 'center',
          dataIndex: 'className',
          scopedSlots: { customRender: 'className' },
          width: 90,
        },
        {
          title: '分类',
          align: 'center',
          dataIndex: 'subjectName',
          width: 70,
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name',
          width: 70,
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
          dataIndex: 'avgScore',
          width: 90,
        },
      ],
      // 值
      dataone: [],
      datatwo: [],
    }
  },
  //计算属性
  computed: {},
  //实例被挂载后调用
  mounted() {
    this.getBasicInfo()
    this.loadData()
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {})
  },
  //方法存放处
  methods: {
    moment,
    exportExcel,
    // 分类
    getBasicInfo() {
      getAction(dict.findDictForSelect, { tableName: 'dict_common_subject' }).then((res) => {
        this.subjectData = res.result
      })
    },
    // 获取表格数据
    loadData(arg) {
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      var params = this.getQueryParams()
      getAction(stCourseOrder.pageList, params)
        .then((res) => {
          if (res.success) {
            this.dataone = res.result.records
            this.ipagination.total = res.result.total
          } else {
            this.dataone = []
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    getQueryParams() {
      var param = Object.assign({}, {}) //两个对象相加
      param.pageNo = this.ipagination.current //分页默认值
      param.pageSize = this.ipagination.pageSize
      // console.log(param)
      // 获取到的值进行处理  时间传值
      this.form.validateFields((err, values) => {
        param.startTime = values.startTime ? values.startTime[0].format('YYYY-MM-DD') : ''
        param.overTime = values.startTime ? values.startTime[1].format('YYYY-MM-DD') : ''
        // 这里是form表单里的东西  所以在这里设置
        param.dictCommonSubjectId = values.dictCommonSubjectId // 分类
      })

      return filterObj(param)
    },
    // 搜索
    search(arg) {
      if (this.twoID != '') {
        this.display()
      } else {
        this.loadData(1)
      }
    },
    // 重置
    clear() {
      this.form.resetFields()
      this.loadData(1)
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    onChange(date, dateString) {
      // console.log(date, dateString)
    },
    // 第二个
    display(data) {
      this.twoID = data //获取到的id 赋值给twoID
      // console.log(this.twoID)
      this.isShow = false
      var params = this.getParams() //分页的数据给params
      this.gettwodata(this.twoID)
    },
    gettwodata(data) {
      this.loadingtwo = true
      var params = this.getParams()
      params.id = data
      getAction(stCourseOrder.courseStatistics, params)
        .then((res) => {
          if (res.success) {
            this.datatwo = res.result.records
            this.ipaginationstwo.total = res.result.total
          } else {
            this.datatwo = []
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loadingtwo = false
        })
    },
    getParams() {
      var param = Object.assign({}, {}) //两个对象相加
      param.pageNo = this.ipaginationstwo.current //分页默认值
      param.pageSize = this.ipaginationstwo.pageSize
      param.dictCommonSubjectId = this.dictCommonSubjectId // 科目id
      this.form.validateFields((err, values) => {
        param.startTime = values.startTime ? values.startTime[0].format('YYYY-MM-DD') : ''
        param.overTime = values.startTime ? values.startTime[1].format('YYYY-MM-DD') : ''
        // 这里是form表单里的东西  所以在这里设置
        param.dictCommonSubjectId = values.dictCommonSubjectId // 分类
      })
      return filterObj(param)
    },
    //分页、排序、筛选变化时触发
    handleTableChangetwo(pagination, filters, sorter) {
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipaginationstwo = pagination
      this.gettwodata(this.twoID)
    },
    back() {
      this.isShow = true
      this.twoID = ''
    },
    // 跳转
    godatails(record) {
      var param = record
      param.tolink = '2'
      this.$router.push({ name: 'schooldetails-schooldetails', query: param })
    },
    // 导出
    leadingOut() {
      var params = this.getQueryParams()
      params.pageSize = 10000
      this.loading = true
      getAction(stCourseOrder.pageList, params).then((res) => {
        if (res.success) {
          var arr = []
          res.result.records.forEach((ele, index) => {
            arr.push({
              序号: index + 1,
              课程名称: ele.courseName,
              开始时间: ele.startTime,
              分类: ele.subjectName,
              学习总人数: ele.allNum,
              未完成学习人数: ele.noNum,
              平均分: ele.avgScore,
            })
          })
          this.exportExcel(
            [
              {
                title: '序号',
                fieldName: '',
              },
              {
                title: '课程名称',
                fieldName: 'courseName',
              },
              {
                title: '开始时间',
                fieldName: 'startTime',
              },
              {
                title: '分类',
                fieldName: 'subjectName',
              },
              {
                title: '学习总人数',
                fieldName: 'allNum',
              },
              {
                title: '未完成学习人数',
                fieldName: 'noNum',
              },
              {
                title: '平均分',
                fieldName: 'avgScore',
              },
            ],
            arr,
            {
              fileName: '课程统计表',
              // sheetName: '',
            }
          )
          this.loading = false
        }
      })
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
    .con {
      width: 1237px;
      margin: 0 auto;
      .top {
        margin: 31px 0;
        .buttons {
          display: flex;
          // justify-content: flex-end;
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
    }
  }
}
</style>