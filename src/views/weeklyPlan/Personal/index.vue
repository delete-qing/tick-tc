<template>
  <div id="Personal">
    <page-header></page-header>
    <a-card class="vueList" :bordered="false" style="padding:24px 32px 0px 32px">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper" >
        <a-form :form="form" layout="inline">
          <a-row :gutter="24">
            <a-col :span="4" :xxl="4">
              <a-form-item label="选择月份">
                <a-month-picker
                  placeholder="请选择月份"
                  v-decorator="['yearMonth', {}]"
                  style="width:100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4" :xxl="4">
              <a-form-item label="部门">
                <a-select v-decorator="['officeId', {}]" @change="getStaffNameData"
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="item in officeData" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4" :xxl="4">
              <a-form-item label="人员">
                <a-select v-decorator="['staffName', {}]" 
                  showSearch
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="item in staffNameData" :key="item.id" :value="item.name">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- <a-col :span="4" :xxl="4">
              <a-form-item label="客户名称">
                <a-select v-decorator="['dictCustomerId', {}]" >
                  <a-select-option v-for="item in dictCustomer" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>-->
            <a-col :span="4">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-spin :spinning="loading">
        <div style="overflow: auto;height:calc(100vh - 252px)">
          <table border="1" class="tableBorder">
            <thead class="tableThead">
              <tr>
                <th
                  v-for="(item,index) in columnsData.one"
                  :key="index"
                  :colspan="item.colspan"
                  :rowspan="item.rowspan"
                >{{item.title}}</th>
              </tr>
              <tr>
                <template v-for="(item,index) in columnsData.two">
                  <th
                    v-if="item.title === '任务描述'"
                    style="width:320px;min-width: 320px;"
                    :key="index"
                  >{{item.title}}</th>
                  <th v-else style="width:75px;text-align: center;" :key="index">{{item.title}}</th>
                </template>
              </tr>
            </thead>
            <tbody class="tableTbody">
              <tr v-for="item in rowNewData" :key="item.uuidKey">
                <template v-for="tes in tableColumns">
                  <template v-if="tes.dataIndex === 'officeName'">
                    <template v-if="!item.khRrowspanState">
                      <td :key="tes.uuidKey" :rowspan="item.khRowspan" style="font-weight:bold;text-align:center">{{item[tes.dataIndex]}}</td>
                    </template>
                  </template>
                  <template v-else-if="tes.dataIndex === 'name'">
                    <template v-if="!item.cpRrowspanState">
                      <td :key="tes.uuidKey" :rowspan="item.cpRowspan" style="font-weight:bold;text-align:center">{{item[tes.dataIndex]}}</td>
                    </template>
                  </template>
                  <template v-else>
                    <td :key="tes.uuidKey" v-if="tes.title === '任务状态'" style="text-align:center">
                      <span
                        v-if="item[tes.dataIndex] === '进行中'"
                        style="color:#F59A23"
                      >{{item[tes.dataIndex]}}</span>
                      <span
                        v-else-if="item[tes.dataIndex] === '已完成'"
                        style="color:#04D919"
                      >{{item[tes.dataIndex]}}</span>
                      <span v-else>{{item[tes.dataIndex]}}</span>
                    </td>
                    <td :key="tes.uuidKey" v-else-if="tes.title === '操作'" style="text-align:center">
                      <a-button
                        style="background:rgba(26,118,218,0.29);border-radius:5px;border:1px solid rgba(25,111,203,1);color:rgba(39,133,234,1);font-size:12px"
                        size="small"
                        v-if="item[tes.dataIndex]"
                        @click="onComplete(item[tes.dataIndex])"
                      >完成</a-button>
                    </td>
                    <td
                      :key="tes.uuidKey"
                      v-else-if="tes.title === '任务类型'"
                      style="text-align:center"
                    >{{item[tes.dataIndex]}}</td>
                    <template v-else>
                      <td v-if="item[tes.dataIndex+'Key'] === 1" class="tableRed" :key="tes.uuidKey">
                        <span v-if="item[tes.dataIndex+'Annotate'] === 1" class="CommentsImgOne" @click="handleCommentsSee(item[tes.dataIndex+'Id'])"></span>
                        <span v-if="item[tes.dataIndex+'Delay'] === '1'" class="CommentsImgTwo"></span>
                        {{item[tes.dataIndex]}}
                      </td>
                      <td v-else-if="item[tes.dataIndex+'Urgency'] === 1" class="tableRedOne" :key="tes.uuidKey">
                        <span v-if="item[tes.dataIndex+'Annotate'] === 1" class="CommentsImgOne" @click="handleCommentsSee(item[tes.dataIndex+'Id'])"></span>
                        <span v-if="item[tes.dataIndex+'Delay'] === '1'" class="CommentsImgTwo"></span>
                        {{item[tes.dataIndex]}}
                      </td>
                      <td v-else :key="tes.uuidKey">
                        <span v-if="item[tes.dataIndex+'Annotate'] === 1" class="CommentsImgOne" @click="handleCommentsSee(item[tes.dataIndex+'Id'])"></span>
                        <span v-if="item[tes.dataIndex+'Delay'] === '1'" class="CommentsImgTwo"></span>
                        {{item[tes.dataIndex]}}
                      </td>
                    </template>
                  </template>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </a-spin>
      <!-- table区域-begin -->
      <!-- <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
      ></a-table>-->
      <!-- table区域-end -->
      <!-- 表单区域 -->
      <!-- <t-s-add-edit ref="TSAddEdit" @ok="loadData(1)"></t-s-add-edit> -->
      <comments ref="comments" @ok="loadData(1)"></comments>
    </a-card>
  </div>
</template>
<script>
//组件引用
import moment from 'moment'
import { filterObj } from '@/utils/util'
import { UUID } from "@/utils/util";
import PageHeader from '@/components/page/PageHeader.vue'
import { getAction, deleteAction, httpAction } from '@/api/manage'
import { enTaskInfo, dict, basic, sysOffice } from '@/api/ajaxUrl.config'
import comments from '@/views/taskSource/modules/comments.vue'
// import TSAddEdit from "./modules/addEdit.vue"
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
      columns: [],
      //转换完的手工表格表头
      columnsData: {
        one: [],
        two: [],
      },
      //转换完的数据顺序
      tableColumns: [],
      //转换完的数据结构
      rowNewData: [],
      //任务源状态
      dictTaskStatus: [],
      //客户名称
      dictCustomer: [],
      //部门下拉
      officeData:[],
      //人员下拉
      staffNameData:[]
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
    getBasicInfo() {
      //任务源状态设置字典
      getAction(dict.findDictForSelect, { tableName: 'dict_task_status' })
        .then((res) => {
          this.dictTaskStatus = res.result
        })
        .catch((err) => {
          
        })
      //客户名称字典
      getAction(dict.findDictForSelect, { tableName: 'dict_customer' })
        .then((res) => {
          this.dictCustomer = res.result
        })
        .catch((err) => {
          
        })
      //部门下拉
      getAction(sysOffice.list, { parentId:'1', pageSize: '99999' })
        .then((res) => {
          this.officeData = res.result.records
        })
        .catch((err) => {
          
        })
      //人员下拉
      // getAction(basic.pageList, { pageSize: '99999' })
      //   .then((res) => {
      //     this.staffNameData = res.result.records
      //   })
      //   .catch((err) => {
          
      //   })
      
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
    loadData() {
      this.loading = true
      this.dataSource = []
      //加载数据 若传入参数1则加载第一页的内容
      var params = this.getQueryParams() //查询条件
      getAction(enTaskInfo.findTaskPersonal, params)
        .then((res) => {
          if (res.success) {
            this.columns = res.result.colsList
            this.dataSource = res.result.data
            this.columnsData = {
              one: [],
              two: [],
            }
            this.columns.forEach((e) => {
              let arr = e
              if (e.children) {
                arr.rowspan = 1
                arr.colspan = e.children.length
              } else {
                arr.rowspan = 2
                arr.colspan = 1
              }
              this.columnsData.one.push(arr)
            })
            this.tableColumns = []
            this.columns.forEach((e) => {
              if (e.children) {
                e.children.forEach((c) => {
                  c.uuidKey = UUID.prototype.createUUID()
                  this.columnsData.two.push(c)
                  this.tableColumns.push(c)
                })
              } else {
                e.uuidKey = UUID.prototype.createUUID()
                this.tableColumns.push(e)
              }
            })
            this.getNewDataSource()
            this.loading = false
          } else {
            this.$message.error(res.message)
            this.loading = false
          }
        })
        .catch((err) => {
          this.$message.warning(err)
          this.loading = false
        })
    },
    getQueryParams() {
      this.form.validateFields((err, values) => {
        this.queryParam = values
      })
      var param = Object.assign({}, this.queryParam)
      param.yearMonth = moment(param.yearMonth).format('YYYY-MM')
      return filterObj(param)
    },
    //新增
    handleAdd() {
      // this.$refs.TSAddEdit.title = "新增"
      // this.$refs.TSAddEdit.add()
    },
    //编辑
    handleEdit(record) {
      // this.$refs.addEdit.title = "编辑"
      // this.$refs.addEdit.edit(record)
    },
    //删除
    handleDelete(id) {
      // deleteAction("", { id: id }).then(res => {
      //   if (res.success) {
      //     this.$message.success(res.message)
      //     this.loadData(1)
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // }).catch((err) => {
      // that.$message.warning(err)
      // })
    },
    // 合并单元格，这里我抽出了一个函数，调用的时候只需要将dataIndex作为参数传入即可
    rowSpan(key) {
      let arr = this.dataSource
        .reduce((result, item) => {
          if (result.indexOf(item[key]) < 0) {
            result.push(item[key])
          }
          return result
        }, [])
        .reduce((result, keys) => {
          const children = this.dataSource.filter((item) => item[key] === keys)
          result = result.concat(
            children.map((item, index) => ({
              ...item,
              [`${key}RowSpan`]: index === 0 ? children.length : 0,
            }))
          )
          return result
        }, [])
      this.dataSource = arr
    },
    //把得到的数据转成我需要的样子
    getNewDataSource() {
      //获取有多少客户
      const rey = new Map()
      const resData = this.dataSource.filter((arr) => !rey.has(arr.officeName) && rey.set(arr.officeName, 1))
      var resObj = []
      resData.forEach((e) => {
        let obj = {
          officeName: e.officeName,
          num: 0,
          children: [],
        }
        resObj.push(obj)
      })
      //获取有多少组 1.先把所有是该部门的得到
      var AreaObj = []
      resObj.forEach((e) => {
        this.dataSource.forEach((b) => {
          if (e.officeName === b.officeName) {
            e.children.push(b)
            e.num++
          }
        })
      })
      //2.在去重得到有多少组
      resObj.forEach((e) => {
        const rey1 = new Map()
        const resData1 = e.children.filter((arr) => !rey1.has(arr.name) && rey1.set(arr.name, 1))
        e.children = []
        resData1.forEach((b) => {
          let obj = {
            name: b.name,
            children: [],
          }
          e.children.push(obj)
        })
      })
      //获取每组有多少人
      resObj.forEach((a) => {
        this.dataSource.forEach((b) => {
          if (a.officeName === b.officeName) {
            a.children.forEach((ac) => {
              if (ac.name === b.name) {
                ac.children.push(b)
              }
            })
          }
        })
      })
      this.rowNewData = []
      resObj.forEach((a) => {
        var ai = 0
        a.children.forEach((b, bi) => {
          b.children.forEach((c, ci) => {
            if (ai === 0) {
              c.khRowspan = a.num //客户需要合并多少行
            } else {
              c.khRrowspanState = true
            }
            if (ci === 0) {
              c.cpRowspan = b.children.length //产品需要合并多少行
            } else {
              c.cpRrowspanState = true
            }
            c.uuidKey = UUID.prototype.createUUID()
            this.rowNewData.push(c)
            ai++
          })
        })
      })
    },
    //点击完成
    onComplete(id) {
      this.loading = true
      var formData = {
        id: id,
        dictTaskStatusId: 3,
      }
      httpAction(enTaskInfo.edit, formData, 'put')
        .then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.loadData()
          } else {
            this.$message.warning(res.message)
            this.loadData()
          }
        })
        .catch((err) => {
          this.$message.warning(err)
          this.loadData()
        })
    },
    //查看批示
    handleCommentsSee(record) {
      this.$refs.comments.title = "批示查看"
      this.$refs.comments.edit(record,'SEE')
    },
    //根据部门查人员
    getStaffNameData(value) {
      this.staffNameData = []
      this.form.resetFields(['staffName']);
      getAction(basic.queryByOfficeId, { officeId: value })
        .then((res) => {
          this.staffNameData = res
        })
        .catch((err) => {
          
        })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>
<style lang="scss" scoped>
#Personal {
  .ant-card-body {
    padding: 0px !important;
  }
}
.tableBorder {
  border: 1px solid #e8e8e8;
  width: 100%;
  font-size: .875rem;
}
.tableThead {
  th {
    padding: .5rem;
    text-align: center;
    font-size: .875rem;
    min-width: 80px;
    max-width: 80px;
    width: 80px;
    color: #ffffff;
    background: #353737;
    border: 1px solid #555555;
  }
}
.tableTbody {
  tr:hover > td {
    background: rgba(10, 212, 148, 0.17);
  }
  td {
    padding: .5rem;
    border: 1px solid #555555;
    color: #adadad;
  }
  td:nth-of-type(1) {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  tr > td:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  tr:nth-child(even) {
    background: rgba(53, 55, 55, 0.33);
  }
  .oneTdTable {
    padding: 0px;
    table {
      width: 100%;
      tr:not(:last-child) {
        border-bottom: 1px solid #e8e8e8;
      }
    }
  }
}
</style>