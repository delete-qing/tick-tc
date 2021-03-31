<template>
  <div class="result tick-black">
    <div style="display: flex; height: 100%">
      <div class="kenter">
        <ul>
          <li
            v-for="(item, index) in kuter"
            :key="index"
            @click="getDictListByTableName(item, index)"
            :class="{ selected: flag == index }"
          >
            {{ item.tableComment }}
          </li>
        </ul>
      </div>
      <div class="keeltar">
        <template>
          <div class="tate" v-if="state === false">
            <a-card class="dictCarRepairPartsList" :bordered="false">
              <!-- 查询区域 -->
              <div class="table-page-search-wrapper">
                <a-form layout="inline">
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <a-form-item label>
                        <a-input placeholder="请输入名称查询" v-model="queryParam.name"></a-input>
                      </a-form-item>
                    </a-col>

                    <a-col :span="8">
                      <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
                        <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                        <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                      </span>
                    </a-col>
                  </a-row>
                </a-form>
              </div>

              <!-- 操作按钮区域 -->
              <div class="table-operator">
                <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
              </div>

              <!-- table区域-begin -->
              <div>
                <a-table
                  ref="table"
                  size="middle"
                  rowKey="id"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  :loading="loading"
                  @change="handleTableChange"
                >
                  <span slot="action" slot-scope="text, record">
                    <a @click="handleEdit(record)">编辑</a>

                    <a-divider type="vertical" />
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                </a-table>
              </div>
              <!-- table区域-end -->

              <!-- 表单区域 -->
              <DictEdit ref="DictEdit" :dictId="dictId" @ok="modalFormOk"></DictEdit>
            </a-card>
          </div>
          <div v-if="state === true">
            <allocation ref="allocation"></allocation>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import DictEdit from './DictEdit'
import allocation from './allocation'
import { filterObj } from '@/utils/util'
import { deleteAction, getAction } from '@/api/manage'
import { dict } from '@/api/ajaxUrl.config'
export default {
  components: {
    DictEdit,
    allocation,
  },
  props: {
    dictType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      state: false,
      flag: 0,
      dictId: '',
      description: '字典数据管理页面',
      // 查询条件
      queryParam: {},
      kuter: [],
      // 表头
      columns: [
        {
          title: '名称',
          align: 'center',
          dataIndex: 'name',
          width: 200,
        },
        {
          title: '说明',
          align: 'center',
          dataIndex: 'remark',
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort',
          width: 100,
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 150,
        },
      ],
      //数据集
      dataSource: [],
      // 分页参数
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      isorter: {},
      loading: false,
      selectedRowKeys: [],
      selectedRows: [],
      url: {
        list: dict.list,
        delete: dict.delete,
        // deleteBatch: '/ov/dictCarRepairParts/deleteBatch'
      },
    }
  },
  created() {
    getAction(dict.manageList, { moduleGroup: this.dictType })
      .then((res) => {
        this.kuter = res.result
        this.dictId = this.kuter[0].tableName
        this.loadData()
      })
      .catch((err) => {
        console.log(err)
      })
  },
  methods: {
    getDictListByTableName(item, index) {
      if (item.tableComment === '量化指标配置') {
        this.state = true
        this.flag = index
      } else {
        this.state = false
        this.dictId = item.tableName
        if (item.tableName == 'dict_risk_level') {
          this.columns[1].title = '金额'
        } else {
          this.columns[1].title = '说明'
        }
        getAction(this.url.list, { tableName: item.tableName })
          .then((res) => {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
          })
          .catch((err) => {
            console.log(err)
          })
        this.flag = index
      }
    },
    loadData(arg) {
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() //查询条件
      this.loading = true
      // console.log(this.kuter[0])
      params.tableName = this.dictId
      getAction(this.url.list, params).then((res) => {
        // console.log(res)
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
          this.loading = false
        }
      })
    },
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)

      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    getQueryField() {
      //TODO 字段权限控制
      var str = 'id,'
      for (var a = 0; a < this.columns.length; a++) {
        str += ',' + this.columns[a].dataIndex
      }
      return str
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    searchQuery() {
      this.loadData(1)
      var that = this
      that.queryParam = {}
    },
    searchReset() {
      var that = this
      that.queryParam = {}
      that.loadData(1)
    },
    handleDelete: function (id) {
      var that = this
      var met = {
        id: id,
        tableName: this.dictId,
      }
      deleteAction(that.url.delete, met).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleEdit: function (record) {
      this.$refs.DictEdit.edit(record, this.dictId)
      this.$refs.DictEdit.title = '编辑字典配置'
    },
    handleAdd: function () {
      this.$refs.DictEdit.add(this.dictId)
      this.$refs.DictEdit.title = '新增字典配置'
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData()
    },
  },
}
</script>

<style lang="scss" scoped>
.result {
  height: calc(100vh - 171px);
  .antiSlip {
    width: 100%;
    height: calc(100vh - 158px);
  }
  .myRow {
    display: flex;
    align-items: center;
  }
  .ant-divider-horizontal {
    margin: 0 !important;
  }
  .myForm {
    margin: 0 !important;
    padding: 12px 0 12px 24px;
  }
}
.table-page-search-wrapper {
  padding: 20px;
  padding-left: 0;
  padding-bottom: 0px;
}
.ant-card-body .table-operator {
  margin-bottom: 18px;
}
.ant-layout-content {
  margin: 12px 16px 0 !important;
}
.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}
.anty-row-operator button {
  margin: 0 5px;
}
// .ant-btn-danger {
//   background-color: #ffffff;
// }

.ant-modal-cust-warp {
  height: 100%;
}
.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}
.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

.dictCarRepairPartsList {
  height: calc(100vh - 220px);
}
.kenter {
  width: 15%;
  // border-right: 1px solid #eee;
  height: 100%;
  overflow-y: scroll;
  ul {
    padding: 0px;
    margin: 0px;
    margin-top: 10px;
  }
  ul li {
    list-style: none;
    cursor: pointer;
    padding: 10px 5px 10px 10px;
    color: #adadad;
  }
}
.keeltar {
  width: 85%;
  height: calc(100vh - 220px);
  overflow: auto;
}
.selected {
  background-color: #40a9ff;
  color: #ffffff !important;
}
</style>