<template>
  <div id="taskSource">
    <page-header></page-header>
    <!-- 操作按钮区域 -->
    <a-button @click="handleAdd" type="primary" class="absoluteBetton greenButton" icon="plus">新增</a-button>
    <a-card class="vueList" :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form :form="form" layout="inline">
          <a-row :gutter="24">
            <a-col :span="4" :xxl="4">
              <a-form-item label="任务源类型">
                <a-select v-decorator="['dictTaskTypeId', {}]"
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="item in dictTaskType" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4" :xxl="4">
              <a-form-item label="任务源状态">
                <a-select v-decorator="['dictTaskStatusId', {}]"
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="item in dictTaskStatus" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4" :xxl="4">
              <a-form-item label="分配状态">
                <a-select v-decorator="['assignStatus', {}]"
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option value="0">未分配</a-select-option>
                  <a-select-option value="1">已分配</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4" :xxl="4">
              <a-form-item label="客户名称">
                <a-select v-decorator="['dictCustomerId', {}]"
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="item in dictCustomer" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4" :xxl="4">
              <a-form-item label="产品名称">
                <a-select v-decorator="['dictProductId', {}]" 
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="item in dictProduct" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- table区域-begin -->
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :rowClassName="rowClassName"
      >
        <template slot="bsImg" slot-scope="text, record">
          <span v-if="record.isAnnotate === 1" class="CommentsSpan">
            <span class="CommentsImgOne" @click="handleCommentsSee(record.id)"></span>
          </span>
        </template>
        <template slot="rowIndex" slot-scope="text, record, index">
            {{parseInt(index) + 1}}
        </template>
        <template slot="dictTaskStatusName" slot-scope="text">
          <span v-if="text === '进行中'" style="color:#F59A23">{{text}}</span>
          <span v-else-if="text === '已完成'" style="color:#04D919">{{text}}</span>
          <span v-else>{{text}}</span>
        </template>
        <template slot="askTime" slot-scope="text">
          <span>{{text ? moment(text).format('YYYY-MM-DD') : ''}}</span>
        </template>
        <template slot="expectTime" slot-scope="text">
          <span>{{text ? moment(text).format('YYYY-MM-DD') : ''}}</span>
        </template>
        <template slot="assignStatus" slot-scope="text">
          <span v-if="text === 0">未分配</span>
          <span v-else-if="text === 1">已分配</span>
          <span v-else>{{text}}</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a style="color:red">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="handleComments(record)" style="color:#1ab092">批示</a>
        </span>
      </a-table>
      <!-- table区域-end -->
      <!-- 表单区域 -->
      <t-s-add-edit ref="TSAddEdit" @ok="loadData(1)"></t-s-add-edit>
      <comments ref="comments" @ok="loadData(1)"></comments>
    </a-card>
  </div>
</template>
<script>
//组件引用
import moment from "moment";
import { filterObj } from '@/utils/util'
import PageHeader from '@/components/page/PageHeader.vue'
import { getAction, deleteAction } from '@/api/manage'
import { enTaskInfo,dict,buCustomerPordcut } from '@/api/ajaxUrl.config'
import TSAddEdit from './modules/addEdit.vue'
import comments from './modules/comments.vue'
export default {
  //组件注册
  components: {
    PageHeader,
    TSAddEdit,
    comments
  },
  data() {
    return {
      form: this.$form.createForm(this),
      // 查询条件
      queryParam: [],
      // 表格加载动画
      loading: false,
      //表格数据
      dataSource: [],
      // 表头
      columns: [
        {
          title: '标识',
          dataIndex: 'bsImg',
          width: 60,
          align: 'center',
          scopedSlots: { customRender: 'bsImg' },
        },
        {
          title: '序号',
          dataIndex: 'rowIndex',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          scopedSlots: { customRender: 'rowIndex' },
        },
        {
          title: '客户名称',
          width: 100,
          dataIndex: 'dictCustomerName',
          scopedSlots: { customRender: 'dictCustomerName' },
        },
        {
          title: '产品名称',
          width: 100,
          dataIndex: 'dictProductName',
          scopedSlots: { customRender: 'dictProductName' },
        },
        {
          title: '来源类型',
          width: 75,
          align: 'center',
          dataIndex: 'dictTaskFromTypeName',
          scopedSlots: { customRender: 'dictTaskFromTypeName' },
        },
        {
          title: '任务源类型',
          width: 70,
          align: 'center',
          dataIndex: 'dictTaskTypeName',
          scopedSlots: { customRender: 'dictTaskTypeName' },
        },
        {
          title: '提出问题时间',
          width: 105,
          align: 'center',
          dataIndex: 'askTime',
          scopedSlots: { customRender: 'askTime' },
        },
        {
          title: '期望解决时间',
          width: 105,
          align: 'center',
          dataIndex: 'expectTime',
          scopedSlots: { customRender: 'expectTime' },
        },
        {
          title: '任务源状态',
          width: 70,
          align: 'center',
          dataIndex: 'dictTaskStatusName',
          scopedSlots: { customRender: 'dictTaskStatusName' },
        },
        {
          title: '分配状态',
          width: 75,
          align: 'center',
          dataIndex: 'assignStatus',
          scopedSlots: { customRender: 'assignStatus' },
        },
        {
          title: '任务描述',
          dataIndex: 'taskContent',
          scopedSlots: { customRender: 'taskContent' },
        },
        {
          title: '新增人',
          width: 60,
          dataIndex: 'createBy',
          scopedSlots: { customRender: 'createBy' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 140,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 分页参数
      ipagination: {
        current: 1,
        pageSize: 500,
        pageSizeOptions: ['10', '30', '50', '100', '300', '500'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      //任务源类型
      dictTaskType:[],
      //任务源状态
      dictTaskStatus:[],
      //客户名称
      dictCustomer:[],
      //产品名称
      dictProduct:[],
    }
  },
  //计算属性
  computed: {},
  //实例被挂载后调用
  mounted() {
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {
      this.getBasicInfo()
      this.loadData(1)
    })
  },
  //方法存放处
  methods: {
    moment,
    // 页面加载获取下拉列表数据
    getBasicInfo () {
      //任务源类型设置字典
      getAction(dict.findDictForSelect, { tableName: 'dict_task_type' }).then(res => {
        this.dictTaskType = res.result
      }).catch((err) => {
        console.log('任务源类型设置字典:',err)
      })
      //任务源状态设置字典
      getAction(dict.findDictForSelect, { tableName: 'dict_task_status' }).then(res => {
        this.dictTaskStatus = res.result
      }).catch((err) => {
        console.log('任务源状态设置字典:',err)
      })
      //客户名称字典
      getAction(dict.findDictForSelect, { tableName: 'dict_customer' }).then(res => {
        this.dictCustomer = res.result
      }).catch((err) => {
        console.log('客户名称字典:',err)
      })
      //产品名称设置字典
      getAction(dict.findDictForSelect, { tableName: 'dict_product' }).then(res => {
        this.dictProduct = res.result
      }).catch((err) => {
        console.log('产品名称设置字典:',err)
      })
    },
    //查询方法
    searchQuery() {
      this.loadData(1)
    },
    //重置方法
    searchReset() {
      this.form.resetFields()
      this.queryParam = []
      this.loadData(1)
    },
    handleTableChange(pagination, filters, sorter) {
      //分页变化时触发
      this.ipagination = pagination
      this.loadData()
    },
    loadData(arg) {
      this.loading = true
      this.dataSource = []
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() //查询条件
      getAction(enTaskInfo.pageList, params)
        .then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
            this.loading = false
          } else {
            this.$message.error(res.message)
            this.loading = false
          }
        })
        .catch((err) => {
          that.$message.warning(err)
          this.loading = false
        })
    },
    getQueryParams() {
      this.form.validateFields((err, values) => {
        console.log(values)
        this.queryParam = values
      })
      var param = Object.assign({}, this.queryParam)
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    //新增
    handleAdd() {
      this.$refs.TSAddEdit.title = '新增'
      this.$refs.TSAddEdit.add()
    },
    //编辑
    handleEdit(record) {
      this.$refs.TSAddEdit.title = "编辑"
      this.$refs.TSAddEdit.edit(record)
    },
    //批示
    handleComments(record) {
      this.$refs.comments.title = "批示"
      this.$refs.comments.edit(record.id,'edit')
    },
    //查看批示
    handleCommentsSee(record) {
      this.$refs.comments.title = "批示查看"
      this.$refs.comments.edit(record,'SEE')
    },
    //删除
    handleDelete(id) {
      deleteAction(enTaskInfo.delete, { id: id }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData(1)
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        this.$message.warning(err)
      })
    },
    rowClassName(record, index) {
      if(record.keyWork === 1) {
        return 'tableRedTd'
      } else if(record.isUrgency === 1) {
        return 'tableRedTdOne'
      } else {
        return ''
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  },
}
</script>
<style lang="scss" scoped>
#taskSource {
  position: relative;
  .absoluteBetton  {
    position: absolute;
    top: 14px;
    left: 146px;
  }
}
</style>