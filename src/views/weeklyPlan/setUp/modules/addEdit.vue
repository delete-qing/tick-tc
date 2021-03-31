<template>
  <a-modal
    :title="title"
    width="80%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    centered
    wrapClassName="navLastWidth nav"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">确定</a-button>
      <a-button key="back" @click="handleCancel">取消</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="spanCol">
            <a-form-item label="客户名称">
              <a-select v-decorator="['dictCustomerId', {}]" style="width:100%"
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
          <a-col :span="spanCol">
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
          <a-col :span="spanCol">
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
          <a-col :span="spanCol">
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
          <a-col :span="8">
            <span
              style="float: left;overflow: hidden;margin-top:43px;"
              class="table-page-search-submitButtons"
            >
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
          <a-col :span="24" class="tableCSS">
            <a-table
              ref="table"
              size="small"
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="ipagination"
              :loading="loading"
              @change="handleTableChange"
              :row-selection="{ selectedRowKeys: selectedRowKeys,onChange:onSelectChange, onSelect: onSelect, onSelectAll: onSelectAll }"
              :rowClassName="rowClassName"
            >
              <template slot="rowIndex" slot-scope="text, record">
                <span
                  v-if="record.isAnnotate === 1"
                  class="CommentsImgOne"
                  @click="handleCommentsSee(record.id)"
                ></span>
              </template>
              <span slot="action" slot-scope="text, record">
                <a @click="fphandleEdit(record)">分配</a>
              </span>
            </a-table>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
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
    <comments ref="comments" @ok="loadData(1)"></comments>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { filterObj } from '@/utils/util'
import { httpAction, getAction } from '@/api/manage'
import { dict, enTaskInfo, basic, buPlanWeek } from '@/api/ajaxUrl.config'
import { UUID } from '@/utils/util'
import pick from 'lodash.pick'
import comments from '@/views/taskSource/modules/comments.vue'
export default {
  name: 'SUAddEdit',
  components: {
    comments,
  },
  data() {
    return {
      title: '新增', //当前弹窗标题
      visible: false, //当前弹窗是否显示
      ryvisible: false, //人员分配弹窗是否显示
      disableSubmit: false, //确定按钮是否显示
      form: this.$form.createForm(this),
      spanCol: 4,
      confirmLoading: false, //页面和确定按钮的加载动画
      departmentStaff: [], //全部部门人员
      newCheckboxData: [], //当前选中的人员
      newDataId: [], //当前点击分配的数据id
      recordsList: [], //全部人
      selectedRows: [], //选中的list
      selectedRowKeys:[],
      startTime: '', //开始时间
      endTime: '', //结束时间
      //客户名称
      dictCustomer: [],
      //产品名称
      dictProduct: [],
      //任务源类型
      dictTaskType: [],
      //来源类型
      dictTaskFromType: [],
      // 查询条件
      queryParam: [],
      // 表格加载动画
      loading: false,
      //表格数据
      dataSource: [],
      // 表头
      columns: [
        {
          title: '批示',
          dataIndex: '',
          key: 'rowIndex',
          width: 50,
          align: 'center',
          scopedSlots: { customRender: 'rowIndex' },
        },
        {
          title: '客户名称',
          width: 90,
          dataIndex: 'dictCustomerName',
          scopedSlots: { customRender: 'dictCustomerName' },
        },
        {
          title: '产品名称',
          width: 90,
          dataIndex: 'dictProductName',
          scopedSlots: { customRender: 'dictProductName' },
        },
        {
          title: '来源类型',
          width: 85,
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
          title: '任务描述',
          dataIndex: 'taskContent',
          scopedSlots: { customRender: 'taskContent' },
        },
        {
          title: '任务接收人',
          width: 110,
          dataIndex: 'staffName',
          scopedSlots: { customRender: 'staffName' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 60,
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 分页参数
      ipagination: {
        current: 1,
        pageSize: 500,
        pageSizeOptions: ['10', '30', '50', '100', '300', '400', '500'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
    }
  },
  mounted() {
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {
      this.getBasicInfo()
      this.getBasicPageList()
    })
  },
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
          this.$message.warning('客户名称字典:', err)
        })
      //产品名称设置字典
      getAction(dict.findDictForSelect, { tableName: 'dict_product' })
        .then((res) => {
          this.dictProduct = res.result
        })
        .catch((err) => {
          this.$message.warning('产品名称设置字典:', err)
        })
      //任务源类型设置字典
      getAction(dict.findDictForSelect, { tableName: 'dict_task_type' })
        .then((res) => {
          this.dictTaskType = res.result
        })
        .catch((err) => {
          this.$message.warning('任务源类型设置字典:', err)
        })
      //来源类型
      getAction(dict.findDictForSelect, { tableName: 'dict_task_from_type' })
        .then((res) => {
          this.dictTaskFromType = res.result
        })
        .catch((err) => {
          this.$message.warning('来源类型:', err)
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
        this.queryParam = values
      })
      var param = Object.assign({}, this.queryParam)
      param.assignStatus = 0 //查询未分配的
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    add(startTime, endTime) {
      this.startTime = startTime ? startTime : moment().day(1).format('YYYY-MM-DD') // 周一日期
      this.endTime = endTime ? endTime : moment().day(7).format('YYYY-MM-DD') // 周日日期
      this.visible = true
      this.loadData(1)
    },
    close() {
      this.form.resetFields()
      this.selectedRowKeys = []
      this.selectedRows = []
      this.disableSubmit = false
      this.confirmLoading = false
      this.visible = false
    },
    handleOk() {
      this.confirmLoading = true
      if (this.selectedRows.length === 0) {
        this.$message.warning('请勾选任务!')
        this.confirmLoading = false
        return
      }
      for (var i = 0; i < this.selectedRows.length; i++) {
        if (this.selectedRows[i].staffIds) {
          this.selectedRows[i].startTime = this.startTime
          this.selectedRows[i].endTime = this.endTime
        } else {
          this.$message.warning('任务接收人不能为空!')
          this.confirmLoading = false
          return
        }
      }
      let formData = this.selectedRows
      formData.forEach(e => {
        e.fkEnTaskInfoId = e.id
      })
      httpAction(buPlanWeek.add, formData, 'post')
        .then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.close()
          } else {
            this.$message.warning(res.message)
            this.form.resetFields()
            this.disableSubmit = false
            this.confirmLoading = false
          }
        })
        .catch((err) => {
          this.confirmLoading = false
          this.$message.warning(err)
          this.close()
        })
    },
    handleCancel() {
      this.close()
    },
    fphandleEdit(record) {
      var recordObj = []
      recordObj.push(record)
      var Keys = []
      var obj = this.uniqueMerge(this.selectedRows,recordObj)
      obj.forEach(e => {
        Keys.push(e.id)
      })
      this.selectedRowKeys = Keys
      this.selectedRows = obj
      this.EditFP(record)
      
    },
    EditFP(record) {
      this.ryvisible = true
      this.newCheckboxData = []
      this.newDataId = record.id
    },
    ryhandleOk() {
      //把表格数据赋上接收人
      this.dataSource.forEach((e) => {
        if (e.id === this.newDataId) {
          var nameS = []
          this.newCheckboxData.forEach((c) => {
            let res = this.recordsList.filter((d) => d.id === c)
            nameS.push(res[0].name)
          })
          e.staffIds = this.newCheckboxData.join(',')
          e.staffName = nameS.join(',')
        }
      })
      //更新选中的数据
      this.selectedRows.forEach((e) => {
        this.dataSource.forEach((b) => {
          if (e.id === b.id) {
            e = b
          }
        })
      })
      this.ryvisible = false
      this.newCheckboxData = []
      this.newDataId = ''
    },
    ryhandleCancel() {
      this.ryvisible = false
      this.newCheckboxData = []
      this.newDataId = ''
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
    //数组去重返回不一样的
    unique(a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].id == b[i].id) {
            a.splice(j, 1)
            j = j - 1
          }
        }
      }
      return a
    },
    //数组合并去重
    uniqueMerge(arr1, arr2) {
      var _arr = new Array()
      for (var i = 0; i < arr1.length; i++) {
        _arr.push(arr1[i])
      }
      for (var i = 0; i < arr2.length; i++) {
        var flag = true
        for (var j = 0; j < arr1.length; j++) {
          if (arr2[i].id == arr1[j].id) {
            flag = false
            break
          }
        }
        if (flag) {
          _arr.push(arr2[i])
        }
      }
      return _arr
    },
    //查看批示
    handleCommentsSee(record) {
      this.$refs.comments.title = '批示查看'
      this.$refs.comments.edit(record, 'SEE')
    },
    onSelect(record, selected) {
      if (selected) {
        this.selectedRows.push(record)
      } else {
        let arr = []
        this.selectedRows.forEach((e) => {
          if (e.id != record.id) {
            arr.push(e)
          }
        })
        this.selectedRows = arr
      }
    },
    onSelectAll(selected, selectedRows, changeRows) {
      if (selected) {
        changeRows.forEach((e) => {
          this.selectedRows.push(e)
        })
      } else {
        this.selectedRows = this.unique(this.selectedRows, changeRows)
      }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
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
    },
  },
}
</script>

<style scoped>
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