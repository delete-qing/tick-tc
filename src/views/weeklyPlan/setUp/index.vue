<template>
  <div id="setUp">
    <page-header></page-header>
    <div class="absoluteBetton">
      <a-week-picker :default-value="moment()" @change="onWeekPicker" style="width:125px" />
      <a-button
        @click="handleAdd"
        type="primary"
        icon="plus"
        class="greenButton"
        style="margin-left:15px;"
      >任务下发</a-button>
    </div>
    <a-card class="vueList" :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form :form="form" layout="inline">
          <a-row :gutter="24">
            <a-col :span="5" :xxl="4">
              <a-form-item label="客户名称">
                <a-select
                  v-decorator="['dictCustomerId', {}]"
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option
                    v-for="item in dictCustomer"
                    :key="item.id"
                    :value="item.id"
                  >{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="5" :xxl="4">
              <a-form-item label="产品名称">
                <a-select v-decorator="['dictProductId', {}]"
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option
                    v-for="item in dictProduct"
                    :key="item.id"
                    :value="item.id"
                  >{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="5" :xxl="4">
              <a-form-item label="任务源类型">
                <a-select v-decorator="['dictTaskTypeId', {}]"
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option
                    v-for="item in dictTaskType"
                    :key="item.id"
                    :value="item.id"
                  >{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="5" :xxl="4">
              <a-form-item label="来源类型">
                <a-select v-decorator="['dictTaskFromTypeId', {}]"
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option
                    v-for="item in dictTaskFromType"
                    :key="item.id"
                    :value="item.id"
                  >{{item.name}}</a-select-option>
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
          <span v-if="record.isDelay === '1'" class="CommentsSpan">
            <span class="CommentsImgTwo"></span>
          </span>
        </template>
        <template slot="rowIndex" slot-scope="text, record, index">{{parseInt(index) + 1}}</template>
        <span slot="action" slot-scope="text, record">
          <a @click="fphandleEdit(record)">分配</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a style="color:red">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <!-- table区域-end -->
      <a-modal
        :title="null"
        :width="700"
        :visible="ryvisible"
        @ok="ryhandleOk"
        @cancel="ryhandleCancel"
        cancelText="关闭"
        :maskClosable="false"
        wrapClassName="navLastWidth"
        :destroyOnClose="true"
      >
        <template slot="footer">
          <a-button key="submit" type="primary" @click="ryhandleOk">确定</a-button>
          <a-button key="back" @click="ryhandleCancel">取消</a-button>
        </template>
        <a-checkbox-group style="width:100%;" @change="onCheckbox">
          <div v-for="item in departmentStaff" :key="item.id">
            <h1 class="workShopH1">{{item.workShop}}</h1>
            <div v-for="items in item.children" :key="items.id" class="paddingLeft">
              <p class="workShopP">{{items.workArea}}</p>
              <div class="paddingLeft">
                <a-row>
                  <a-col v-for="itemT in items.children" :key="itemT.id" :span="4">
                    <a-checkbox :value="itemT.id" style="color: #adadad;">{{itemT.name}}</a-checkbox>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
        </a-checkbox-group>
      </a-modal>
      <!-- 表单区域 -->
      <s-u-add-edit ref="SUAddEdit" @ok="loadData(1)"></s-u-add-edit>
      <comments ref="comments" @ok="loadData(1)"></comments>
    </a-card>
  </div>
</template>
<script>
//组件引用
import moment from 'moment'
import { filterObj } from '@/utils/util'
import PageHeader from '@/components/page/PageHeader.vue'
import { getAction, deleteAction, httpAction } from '@/api/manage'
import { UUID } from '@/utils/util'
import { dict, enTaskInfo, basic, enTaskUser } from '@/api/ajaxUrl.config'
//import {} from "@/api/ajaxUrl.config"
import SUAddEdit from './modules/addEdit.vue'
import comments from '@/views/taskSource/modules/comments.vue'
const renderContent = (value) => {
  const obj = {
    children: value,
    attrs: {},
  }
  return obj
}
export default {
  //组件注册
  components: {
    PageHeader,
    SUAddEdit,
    comments,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      startTime: moment().day(1).format('YYYY-MM-DD'), // 周一日期
      endTime: moment().day(7).format('YYYY-MM-DD'), // 周日日期
      // 查询条件
      queryParam: [],
      // 表格加载动画
      loading: false,
      //客户名称
      dictCustomer: [],
      //产品名称
      dictProduct: [],
      //任务源类型
      dictTaskType: [],
      //来源类型
      dictTaskFromType: [],
      ryvisible: false, //人员分配弹窗是否显示
      departmentStaff: [], //全部部门人员
      newCheckboxData: [], //当前选中的人员
      newCheckList: {}, //当前选中列表行
      //表格数据
      dataSource: [],
      // 表头
      columns: [
        {
          title: '标识',
          dataIndex: 'bsImg',
          width: 80,
          align: 'center',
          scopedSlots: { customRender: 'bsImg' },
        },
        {
          title: '序号',
          dataIndex: '',
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
          width: 80,
          align: 'center',
          dataIndex: 'dictTaskTypeName',
          scopedSlots: { customRender: 'dictTaskTypeName' },
        },
        {
          title: '任务描述',
          dataIndex: 'taskContent',
          scopedSlots: { customRender: 'taskContent' },
        },
        {
          title: '任务接收人',
          width: 170,
          align: 'center',
          dataIndex: 'taskUser',
          scopedSlots: { customRender: 'taskUser' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 100,
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
    }
  },
  //计算属性
  computed: {},
  //实例被挂载后调用
  mounted() {
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {
      this.loadData(1)
      this.getBasicInfo()
      this.getBasicPageList()
    })
  },
  //方法存放处
  methods: {
    moment,
    // 页面加载获取下拉列表数据
    getBasicInfo() {
      //客户名称字典
      getAction(dict.findDictForSelect, { tableName: 'dict_customer' })
        .then((res) => {
          this.dictCustomer = res.result
        })
        .catch((err) => {
          console.log('客户名称字典:', err)
        })
      //产品名称设置字典
      getAction(dict.findDictForSelect, { tableName: 'dict_product' })
        .then((res) => {
          this.dictProduct = res.result
        })
        .catch((err) => {
          console.log('产品名称设置字典:', err)
        })
      //任务源类型设置字典
      getAction(dict.findDictForSelect, { tableName: 'dict_task_type' })
        .then((res) => {
          this.dictTaskType = res.result
        })
        .catch((err) => {
          console.log('任务源类型设置字典:', err)
        })
      //来源类型
      getAction(dict.findDictForSelect, { tableName: 'dict_task_from_type' })
        .then((res) => {
          this.dictTaskFromType = res.result
        })
        .catch((err) => {
          console.log('来源类型:', err)
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
      console.log(params)
      getAction(enTaskInfo.queryWeekPageList, params)
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
          this.$message.warning(err)
        })
    },
    getQueryParams() {
      this.form.validateFields((err, values) => {
        this.queryParam = values
      })
      var param = Object.assign({}, this.queryParam)
      param.startTime = this.startTime
      param.endTime = this.endTime
      param.assignStatus = 1
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    //新增
    handleAdd() {
      this.$refs.SUAddEdit.title = '任务下发'
      this.$refs.SUAddEdit.add(this.startTime, this.endTime)
    },
    //编辑
    handleEdit(record) {
      // this.$refs.addEdit.title = "编辑"
      // this.$refs.addEdit.edit(record)
    },
    //删除
    handleDelete(id) {
      deleteAction(enTaskInfo.remove, { id: id })
        .then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.loadData(1)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          that.$message.warning(err)
        })
    },
    onWeekPicker(date, dateString) {
      var date = date ? date : new Date()
      this.startTime = moment(date).day(1).format('YYYY-MM-DD') // 周一日期
      this.endTime = moment(date).day(7).format('YYYY-MM-DD') // 周日日期
      this.searchReset()
    },
    //查看批示
    handleCommentsSee(record) {
      this.$refs.comments.title = '批示查看'
      this.$refs.comments.edit(record, 'SEE')
    },
    fphandleEdit(record) {
      this.newCheckList = record //当前选中列表行
      this.ryvisible = true
      this.newCheckboxData = []
    },
    ryhandleOk() {
      let formData = {}
      if (this.newCheckboxData.length === 0) {
        this.$message.warning('任务接收人不能为空!')
        return
      }
      formData.fkBasicStaffId = this.newCheckboxData.join(',')
      formData.fkEnTaskInfoId = this.newCheckList.fkEnTaskInfoId
      var that = this
      httpAction(enTaskUser.edit, formData, 'put')
        .then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            that.ryhandleCancel()
            that.loadData()
          } else {
            that.$message.warning(res.message)
          }
        })
        .catch((err) => {
          that.$message.warning(err)
          that.ryhandleCancel()
        })
    },
    ryhandleCancel() {
      this.ryvisible = false
      this.newCheckList = {} //当前选中列表行
      this.newCheckboxData = []
    },
    onCheckbox(checkedValues) {
      this.newCheckboxData = checkedValues
    },
    getBasicPageList() {
      //获取全部人员
      getAction(basic.pageList, { pageSize: '99999' })
        .then((res) => {
          // this.dictTaskFromType = res.result
          if (res.success) {
            this.recordsList = res.result.records ? res.result.records : []
            //获取有多少部门
            const rey = new Map()
            const resData = this.recordsList.filter((arr) => !rey.has(arr.workShop) && rey.set(arr.workShop, 1))
            var resObj = []
            resData.forEach((e) => {
              let obj = {
                id: UUID.prototype.createUUID(),
                workShop: e.workShop,
                children: [],
              }
              resObj.push(obj)
            })
            console.log(resObj)
            //获取有多少组 1.先把所有是该部门的得到
            var AreaObj = []
            resObj.forEach((e) => {
              this.recordsList.forEach((b) => {
                if (e.workShop === b.workShop) {
                  e.children.push(b)
                }
              })
            })
            //2.在去重得到有多少组
            resObj.forEach((e) => {
              const rey1 = new Map()
              const resData1 = e.children.filter((arr) => !rey1.has(arr.workArea) && rey1.set(arr.workArea, 1))
              e.children = []
              resData1.forEach((b) => {
                let obj = {
                  id: UUID.prototype.createUUID(),
                  workArea: b.workArea,
                  children: [],
                }
                e.children.push(obj)
              })
            })
            //获取每组有多少人
            resObj.forEach((a) => {
              this.recordsList.forEach((b) => {
                if (a.workShop === b.workShop) {
                  a.children.forEach((ac) => {
                    if (ac.workArea === b.workArea) {
                      ac.children.push(b)
                    }
                  })
                }
              })
            })
            this.departmentStaff = resObj
          } else {
            this.$message.warning('来源类型:', err)
          }
        })
        .catch((err) => {
          this.$message.warning('来源类型:', err)
        })
    },
    rowClassName(record, index) {
      if (record.keyWork === 1) {
        return 'tableRedTd'
      } else if (record.isUrgency === 1) {
        return 'tableRedTdOne'
      } else {
        return ''
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>
<style lang="scss" scoped>
#setUp {
  position: relative;
  .absoluteBetton {
    position: absolute;
    top: 14px;
    left: 146px;
  }
}
.workShopH1 {
  font-size: 18px;
  font-weight: 900;
  margin: 0;
  line-height: 38px;
  color: #adadad;
}
.paddingLeft {
  padding-left: 24px;
  margin-bottom: 12px;
}
.workShopP {
  color: #adadad;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 32px;
}
</style>