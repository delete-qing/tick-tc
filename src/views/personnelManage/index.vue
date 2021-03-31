<template>
  <div id="tick-Ren">
    <div class="all">
      <div>
        <page-header></page-header>
        <a-card class="vueList" :bordered="false">
          <!-- 查询区域 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item label="姓名">
                    <a-input placeholder="请输入姓名" v-model="queryParam.name"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="部门">
                    <a-tree-select
                      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                      :treeData="department"
                      placeholder="请选择部门"
                      v-model="queryParam.officeId"
                      allowClear
                      :treeDefaultExpandedKeys="['0-1']"
                      showSearch
                    >
                      <span style="color: #08c" slot="title" slot-scope="{ key, value }" v-if="(key = '0-0-1')">{{
                        value
                      }}</span>
                    </a-tree-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
                    <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                    <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                    <a
                      download
                      :href="
                        urls +
                        '/tick-tc/basic/basicStaff/exportWord?pageSize=' +
                        this.ipagination.pageSize +
                        '&pageNo=' +
                        this.ipagination.current +
                        '&name=' +
                        queryParam.name +
                        '&officeId=' +
                        queryParam.officeId
                      "
                    >
                      <a-button type="primary" icon="arrow-down" style="margin-left: 8px">导出</a-button>
                    </a>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div>
            <a-table
              ref="table"
              size="middle"
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="ipagination"
              :loading="loading"
              :scroll="{ x: 1500, y: 'calc(100vh - 350px)' }"
              @change="handleTableChange"
            >
              <template slot="action" slot-scope="text, record">
                <span>
                  <a @click="handleEdit(record)">编辑</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              </template>
            </a-table>
          </div>
          <!-- table区域-end -->

          <!-- 表单区域 -->
          <basicStaff-modal ref="basicStaffModal" @ok="loadData"></basicStaff-modal>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import BasicStaffModal from './modules/BasicStaffModal'
import { filterObj } from '@/utils/util'
import { doMian } from '@/api/api'
import { deleteAction, getAction } from '@/api/manage'
import PageHeader from '@/components/page/PageHeader.vue'
import { basic, postManagement, sysOffice } from '@/api/ajaxUrl.config.js'
import exportExcel from '@/components/ExportExcel'
import { mapGetters } from 'vuex'
export default {
  name: 'BasicStaffList',
  components: {
    BasicStaffModal,
    PageHeader,
  },
  data() {
    return {
      description: '职工表管理页面',
      department: [], //部门数据  树结构
      // 查询条件
      queryParam: {
        // name: this.name,
        // officeId: this.officeId,
      },
      // 表头
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
          title: '姓名',
          align: 'center',
          dataIndex: 'name',
          width: 90,
        },
        {
          title: '所属部门',
          align: 'center',
          dataIndex: 'officeName',
          width: 120,
        },
        {
          title: '上级机构',
          align: 'center',
          dataIndex: 'parentName',
          width: 120,
        },
        {
          title: '出生年月',
          align: 'center',
          dataIndex: 'birthDate',
          width: 100,
        },
        {
          title: '邮箱地址',
          align: 'center',
          dataIndex: 'email',
          width: 160,
        },
        {
          title: '职务',
          align: 'center',
          dataIndex: 'dictStaffTechnicalPositionName',
          width: 90,
        },
        {
          title: '职称',
          align: 'center',
          dataIndex: 'dictStaffTechnicalPositionQualificationName',
          width: 100,
        },

        {
          title: '所授科目',
          align: 'center',
          dataIndex: 'dictCommonSubjectName',
          width: 80,
        },
        {
          title: '所属年级',
          align: 'center',
          dataIndex: 'dictStaffClassName',
          width: 80,
        },
        {
          title: '学历',
          align: 'center',
          dataIndex: 'dictStaffEducationName',
          width: 80,
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 110,
        },
      ],
      //数据集
      dataSource: [],
      // 分页参数
      ipagination: {
        current: 1,
        pageSize: 30,
        pageSizeOptions: ['10', '20', '30', '50', '0'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      // 排序
      isorter: {
        column: 'createTime',
        order: 'desc',
      },
      loading: false,
      url: {
        pageList: '/basic/basicStaff/pageList', //人员数据
        del: 'basic/basicStaff/del', //删除
        imgerver: '',
      },
      urls: this.getUrl(),
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.getUrl()
      this.loadData()
      this.getBasicInfo()
    })
  },
  methods: {
    ...mapGetters(['userInfo']),
    exportExcel,

    // 获取数据
    loadData(arg) {
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() //查询条件
      console.log(params)
      getAction(this.url.pageList, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
          this.loading = false
        } else {
          this.loading = false
        }
      })
    },
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },

    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      console.log(sorter)
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    // 搜索、
    searchQuery() {
      this.loadData(1)
    },
    // 重置
    searchReset() {
      var that = this
      that.queryParam = {}
      that.loadData(1)
    },
    // 删除
    handleDelete: function (id) {
      var that = this
      deleteAction(that.url.del, { id: id }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    getBasicInfo() {
      getAction(sysOffice.findShopAreaTree).then((res) => {
        // console.log(res)
        this.department = res.result
      })
    },
    // 修改
    handleEdit: function (record) {
      this.$refs.basicStaffModal.edit(record)
      this.$refs.basicStaffModal.title = '编辑'
    },
    // 导入模板
    getUrl() {
      var url = window.location.href
      url = url.substring(url.indexOf('//') + 2)
      var str = url.split('/')
      url = 'http://' + str[0]
      this.urls = url
      // console.log(this.urls)
    },
  },
}
</script>
<style lang="scss" scoped>
#tick-Ren {
  width: 100%;
  background-color: #ffffff;
  padding: 30px;
}
.all {
  width: 1300px;
  margin: 0 auto;
  border-radius: 10px;
  border: solid 1px #e5e6e7;
  min-height: calc(100vh - 140px);
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

.ant-btn-danger {
  background-color: #ffffff;
}

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

// .vueList {
//   height: calc(100vh - 158px);
// }

table {
  margin: 0 !important;
}

.anty-img-wrap {
  height: 25px;
  position: relative;
}

.anty-img-wrap > img {
  max-height: 100%;
}
</style>

