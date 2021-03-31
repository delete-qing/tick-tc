<template>
  <div id="Revolution">
    <div class="all">
      <page-header></page-header>
      <!-- 头部 -->
      <div class="con">
        <div class="top">
          <a-form :form="form" layout="inline">
            <a-row :gutter="8">
              <a-col :xl="5">
                <a-form-item label="年月">
                  <a-date-picker @change="onChange" v-decorator="['startTime', {}]" />
                </a-form-item>
              </a-col>
              <!-- 按钮 -->
              <div class="buttons">
                <div><a-button type="primary" @click="search">搜索</a-button></div>
                <div class="right-button">
                  <a-button @click="clear">重置</a-button>
                  <a-button>导出</a-button>
                  <a-button v-if="isShow > 1" @click="back">返回</a-button>
                </div>
              </div>
            </a-row>
          </a-form>
        </div>
        <div class="godetails">
          <!-- 主表格数据 -->
          <template :class="{ to_active: isShow === 1 }" v-if="isShow === 1">
            <div class="tables">
              <a-table
                :columns="columns"
                :dataSource="dataone"
                :loading="loading"
                :pagination="ipagination"
                @change="handleTableChange"
                :scroll="{ y: 'calc(100vh - 420px)' }"
              >
                <template slot="officeName" slot-scope="text">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ text }}</span>
                    </template>
                    <span class="myOverFlow" style="-webkit-box-orient: vertical">{{ text }}</span>
                  </a-tooltip>
                </template>
                <a slot="allNum" slot-scope="text" @click="display(2)">{{ text }}</a>
              </a-table>
            </div>
          </template>

          <!-- 点击机构名称跳转表格 -->
          <template :class="{ to_active: isShow === 2 }" v-if="isShow === 2">
            <div class="tables">
              <a-table :columns="col" :data-source="datas" :scroll="{ y: 'calc(100vh - 420px)' }" :pagination="false">
                <a slot="totle" slot-scope="text" @click="display(3)">{{ text }}</a>
                <template slot="upper" slot-scope="text">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ text }}</span>
                    </template>
                    <span class="myOverFlow" style="-webkit-box-orient: vertical">{{ text }}</span>
                  </a-tooltip>
                </template>
              </a-table>
            </div>
          </template>
          <!-- 点击学习总人数跳转 -->
          <template :class="{ to_active: isShow === 3 }" v-if="isShow === 3">
            <div class="tables">
              <a-table :columns="totles" :data-source="totlesdata" :scroll="{ y: 'calc(100vh - 420px)' }">
                <a slot="totle" slot-scope="text" @click="display(4)">{{ text }}</a>
              </a-table>
            </div>
          </template>
          <!-- 学习详情 -->
          <template :class="{ to_active: isShow === 4 }" v-if="isShow === 4">
            <div class="tables">
              <a-table :columns="detailed" :data-source="detaileddata" :scroll="{ y: 'calc(100vh - 420px)' }">
                <a slot="classNum" slot-scope="text, record">
                  <span @click="godatails(record)">{{ text }}</span>
                </a>
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
import { stCourseOrder, dict, partyAffairs, sysOffice } from '@/api/ajaxUrl.config'
import { filterObj } from '@/utils/util'
import PageHeader from '@/components/page/PageHeader.vue'
import moment from 'moment'
export default {
  //组件注册
  components: {
    PageHeader,
  },

  data() {
    return {
      formLayout: 'horizontal', //输入框
      loading: false,
      // names: ['图书馆', '学校', '博物馆'],
      form: this.$form.createForm(this),
      // subjectData: [],
      isShow: 1,
      departTree: [], // 树结构
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return ' 共' + total + '条'
          //  range[0] + '-' + range[1] +
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      columns: [
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
          title: '机构名称',
          align: 'center',
          dataIndex: 'officeName',
          width: 30,
          ellipsis: true,
          scopedSlots: { customRender: 'officeName' },
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'startTime',
          width: 100,
        },
        {
          title: '分类',
          align: 'center',
          dataIndex: 'courseName',
          width: 70,
        },
        {
          title: '学习总人数',
          align: 'center',
          dataIndex: 'allNum',
          scopedSlots: { customRender: 'allNum' },
          width: 70,
        },
        {
          title: '学习完成人数',
          align: 'center',
          dataIndex: 'overNum',
          width: 100,
        },
        {
          title: '未完成学习人数',
          align: 'center',
          dataIndex: 'noOverNum',
          width: 100,
        },
        {
          title: '平均分',
          align: 'center',
          dataIndex: 'courseAvg',
          width: 70,
        },
      ],
      col: [
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
          title: '上级机构',
          align: 'center',
          dataIndex: 'upper',
          scopedSlots: { customRender: 'upper' },
          width: 70,
        },
        {
          title: '机构名称',
          align: 'center',
          dataIndex: 'classname',
          width: 100,
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'stattime',
          width: 100,
        },
        {
          title: '学习总人数',
          align: 'center',
          dataIndex: 'totle',
          scopedSlots: { customRender: 'totle' },
          width: 70,
        },
        {
          title: '完成学习人数',
          align: 'center',
          dataIndex: 'finish',
          width: 70,
        },
        {
          title: '未完成学习人数',
          align: 'center',
          dataIndex: 'unfinish',
          width: 80,
        },
        {
          title: '平均分',
          align: 'center',
          dataIndex: 'average',
          width: 70,
        },
      ],
      totles: [
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
          title: '机构名称',
          align: 'center',
          dataIndex: 'classname',
          scopedSlots: { customRender: 'classname' },
          width: 100,
        },
        {
          title: '课程名称',
          align: 'center',
          dataIndex: 'classNum',
          scopedSlots: { customRender: 'classNum' },
          width: 100,
        },
        {
          title: '课程类型',
          align: 'center',
          dataIndex: 'calsstype',
          width: 70,
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'stattime',
          width: 70,
        },
        {
          title: '学习总人数',
          align: 'center',
          dataIndex: 'totle',
          scopedSlots: { customRender: 'totle' },
          width: 80,
        },
        {
          title: '完成学习人数',
          align: 'center',
          dataIndex: 'finish',
          width: 80,
        },
        {
          title: '未完成学习人数',
          align: 'center',
          dataIndex: 'unfinish',
          width: 90,
        },
        {
          title: '平均分',
          align: 'center',
          dataIndex: 'average',
          width: 70,
        },
      ],
      detailed: [
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
          dataIndex: 'classNum',
          scopedSlots: { customRender: 'classNum' },
          width: 100,
        },
        {
          title: '所属机构',
          align: 'center',
          dataIndex: 'calsstype',
          scopedSlots: { customRender: 'calsstype' },
          width: 70,
        },
        {
          title: '所属职位',
          align: 'center',
          dataIndex: 'job',
          width: 70,
        },
        {
          title: '所属年级',
          align: 'center',
          dataIndex: 'class',
          width: 80,
        },
        {
          title: '所授科目',
          align: 'center',
          dataIndex: 'classtype',
          width: 80,
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name',
          width: 90,
        },
        {
          title: '是否完成学习',
          align: 'center',
          dataIndex: 'unfinish',
          width: 90,
        },
        {
          title: '平均分',
          align: 'center',
          dataIndex: 'average',
          width: 70,
        },
      ],

      // 值
      dataone: [],
      datas: [
        {
          key: '1',
          upper: '晋中市教育局',
          classname: '基础教育科',
          stattime: '2020-08-01',
          totle: 500,
          finish: 300,
          unfinish: 200,
          average: 20,
        },
        {
          key: '2',
          upper: '晋中市教育局ooooooooooooooo',
          classname: '师资培训科',
          stattime: '2020-08-01',
          totle: 800,
          finish: 300,
          unfinish: 200,
          average: 20,
        },
        {
          key: '3',
          upper: '晋中市教育局',
          classname: '学前教育科',
          stattime: '2020-08-01',
          totle: 100,
          finish: 300,
          unfinish: 200,
          average: 20,
        },
        {
          key: '4',
          upper: '晋中市教育局',
          classname: '安全法制科',
          stattime: '2020-08-01',
          totle: 800,
          finish: 300,
          unfinish: 200,
          average: 20,
        },
      ],
      totlesdata: [
        {
          key: '1',
          classname: '晋中市教育局',
          classNum: '语文',
          calsstype: '文史',
          stattime: '2020-08-01',
          type: '计算机',
          totle: 500,
          finish: 30,
          unfinish: 10,
          average: 20,
        },
        {
          key: '2',
          classname: '晋中市教育局',
          classNum: '数学',
          calsstype: '数理化',
          stattime: '2020-08-01',
          type: '计算机',
          totle: 800,
          finish: 30,
          unfinish: 10,
          average: 20,
        },
        {
          key: '3',
          classname: '晋中市教育局',
          classNum: '英语',
          calsstype: '语言',
          stattime: '2020-08-01',
          type: '计算机',
          totle: 100,
          finish: 30,
          unfinish: 10,
          average: 20,
        },
        {
          key: '4',
          classname: '晋中市教育局',
          classNum: '历史',
          calsstype: '文史',
          stattime: '2020-08-01',
          type: '计算机',
          totle: 800,
          finish: 30,
          unfinish: 10,
          average: 20,
        },
      ],
      detaileddata: [
        {
          key: '1',
          classNum: '语文',
          calsstype: '基础教育科',
          job: '教师',
          class: '九年级',
          classtype: '语文',
          unfinish: '已完成',
          name: '张老师',
          average: 20,
        },
        {
          key: '2',
          classNum: '数学',
          calsstype: '基础教育科',
          job: '教师',
          class: '八年级',
          classtype: '数学',
          unfinish: '李老师',
          name: '小明',
          average: 20,
        },
        {
          key: '3',
          classNum: '英语',
          calsstype: '基础教育科',
          job: '教师',
          class: '六年级',
          classtype: '英语',
          unfinish: '已完成',
          name: '万老师',
          average: 20,
        },
        {
          key: '4',
          classNum: '历史',
          calsstype: '基础教育科',
          job: '教师',
          class: '五年级',
          classtype: '历史',
          unfinish: '已完成',
          name: '赵老师',
          average: 20,
        },
      ],
    }
  },
  //计算属性
  computed: {},
  //实例被挂载后调用
  mounted() {
    this.loadData()
    this.getBasicInfo()
    // this.getBasicTree()
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {})
  },
  //方法存放处
  methods: {
    moment,
    // 学科分类
    // getBasicInfo() {
    //   getAction(dict.findDictForSelect, { tableName: 'dict_common_subject' }).then((res) => {
    //     this.subjectData = res.result
    //   })
    // },

    // 第一张表 获取表格数据
    loadData(arg) {
      this.loading = true
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()
      postAction(stCourseOrder.getList, params)
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
      this.form.validateFields((err, values) => {
        param = Object.assign(param, values)
        param.startTime = param.startTime ? param.startTime.format('YYYY-MM-DD') : ''
      })
      // param.dictCommonSubjectId = this.dictCommonSubjectId // 科目
      return filterObj(param)
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
    // 搜索
    search(arg) {
      this.loadData(1)
    },
    // 重置
    clear() {
      // resetFields 重置一组输入控件的值与状态，如不传入参数，则重置所有组件
      this.form.resetFields()
      this.loadData(1)
    },
    onChange(date, dateString) {
      // console.log(date, dateString)
    },
    display(val) {
      this.isShow = val
    },
    back() {
      if (this.isShow > 1) {
        this.isShow--
      }
    },
    godatails(record) {
      var param = record
      param.tolink = '3'
      this.$router.push({ name: 'schooldetails-schooldetails', query: param })
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

          // margin-top: -40px;
          // position: absolute;
          // top: 92px;
          // right: 86px;
        }
      }
    }
  }
}
.myOverFlow {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
}
</style>