<template>
  <div id="Revolution">
    <div class="all">
      <page-header></page-header>
      <!-- 头部 -->
      <div class="con">
        <div class="top">
          <a-form :form="form" layout="inline">
            <a-row :gutter="8">
              <a-col :xl="6">
                <a-form-item label="机构名称">
                  <a-tree-select
                    show-search
                    style="width: 200px"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="departTree"
                    allow-clear
                    placeholder="请选择"
                    v-decorator="['officeName', {}]"
                    @change="onselect"
                  ></a-tree-select>
                </a-form-item>
              </a-col>
              <!-- 按钮 -->
              <div class="buttons">
                <a-popconfirm title="是否确认批量通过?" ok-text="是" cancel-text="否" @confirm="batchAudit">
                  <a-button type="primary" icon="plus">通过审核</a-button>
                </a-popconfirm>
                <!-- <a-button type="primary">通过审核</a-button>   -->
                <div class="right-button">
                  <a-popconfirm title="是否确认批量退回?" ok-text="是" cancel-text="否" @confirm="backs">
                    <a-button icon="minus">退回</a-button>
                  </a-popconfirm>
                  <!-- <a-button @click="backs">退回</a-button> -->
                </div>
              </div>
            </a-row>
          </a-form>
        </div>
        <!-- 表格 -->
        <template>
          <div class="tables">
            <a-table
              :columns="columns"
              :data-source="datas"
              :pagination="ipagination"
              :loading="confirmLoading"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
              <template slot="officeName" slot-scope="text">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ text }}</span>
                  </template>
                  <span class="myOverFlow" style="-webkit-box-orient: vertical">{{ text }}</span>
                </a-tooltip>
              </template>
              <template slot="operation" slot-scope="text, scopeID">
                <div class="box-img">
                  <div class="imgone" @click="handleOk(scopeID)">
                    <img src="@assets/image/33.png" style="margin-right: 10px" />
                  </div>
                  <div class="imgtwo" @click="handleback(scopeID)">
                    <img src="@assets/image/44.png" />
                  </div>
                </div>
              </template>
            </a-table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>   
<script>
//组件引用
import { httpAction, getAction, postAction, putAction } from '@/api/manage'
import { stCourseOrder, dict, partyAffairs, sysOffice, basicStaff } from '@/api/ajaxUrl.config'
import { filterObj } from '@/utils/util'
import PageHeader from '@/components/page/PageHeader.vue'
export default {
  //组件注册
  components: {
    PageHeader,
  },

  data() {
    return {
      // names: ['图书馆', '学校', '博物馆'],
      form: this.$form.createForm(this),
      departTree: [], //树结构
      selectedRowKeys: [], //多选
      confirmLoading: false,
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
          width: 50,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '机构',
          dataIndex: 'officeName',
          align: 'center',
          width: 80,
          scopedSlots: { customRender: 'officeName' },
        },
        {
          title: '职务',
          dataIndex: 'dictStaffTechnicalPositionName',
          align: 'center',
          width: 80,
        },
        {
          title: '职称',
          dataIndex: 'dictStaffTechnicalPositionQualificationName',
          align: 'center',
          width: 80,
        },
        {
          title: '所属年级',
          dataIndex: 'dictStaffClassName',
          align: 'center',
          width: 80,
        },
        {
          title: '所授科目',
          dataIndex: 'dictCommonSubjectName',
          align: 'center',
          width: 80,
        },
        {
          title: '姓名',
          dataIndex: 'name',
          align: 'center',
          width: 80,
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          align: 'center',
          width: 120,
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: 60,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      datas: [],
      officeId: '', //机构id\
    }
  },
  //计算属性
  computed: {},
  //   computed: {},
  //实例被挂载后调用
  mounted() {
    this.loadData()
    this.getBasicInfo()
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {})
  },

  //方法存放处
  methods: {
    // 查询机构  树结构
    getBasicInfo() {
      getAction(sysOffice.findShopAreaTree).then((res) => {
        console.log(res)
        this.departTree = res.result
      })
    },
    // 输入框变化的时候
    onselect(value, node, extra) {
      this.officeId = value
      this.loadData(1)
    },

    //获取表格数据
    loadData(arg) {
      this.loading = true
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()
      getAction(basicStaff.accountAudit, params)
        .then((res) => {
          if (res.success) {
            this.loading = false
            this.datas = res.result.records
            this.ipagination.total = res.result.total
          } else {
            this.loading = false
            this.datas = []
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
      param.officeId = this.officeId
      // this.form.validateFields((err, values) => {
      //   param = Object.assign(param, values)
      // })
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
    // 表格多选
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      var arr = []
      selectedRows.forEach((item) => {
        arr.push(item.id)
      })
      this.selectedRows = arr
    },
    // 批量审核
    batchAudit() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请至少选择一项数据')
      } else {
        var selectedRows = this.selectedRows.join(',')
        putAction(basicStaff.batchPass, { id: selectedRows }).then((res) => {
          if (res.success) {
            this.$message.success('审核成功')
            this.loadData(1)
            this.selectedRowKeys = []
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
    // 批量退回
    backs() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请至少选择一项数据')
      } else {
        var selectedRows = this.selectedRows.join(',')
        putAction(basicStaff.batchSendBack, { id: selectedRows }).then((res) => {
          if (res.success) {
            this.$message.success('退回成功')
            this.loadData(1)
            this.selectedRowKeys = []
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
    // 单个审核通过
    handleOk(scopeID) {
      const that = this
      that.confirmLoading = true
      let myData = {}
      myData = Object.assign({}, scopeID)
      myData.id = scopeID.id
      // console.log(myData.id)
      // 发送请求
      putAction(basicStaff.pass, myData)
        .then((res) => {
          if (res.success) {
            that.$message.success('审核成功')
            // that.$emit('ok')
            this.loadData(1)
          } else {
            that.$message.warning(res.message)
          }
        })
        .finally(() => {
          that.confirmLoading = false
        })
    },
    // 单个退回
    handleback(scopeID) {
      const that = this
      that.confirmLoading = true
      let myData = {}
      myData = Object.assign({}, scopeID)
      myData.id = scopeID.id
      // console.log(myData.id)
      // 发送请求
      putAction(basicStaff.sendBack, myData)
        .then((res) => {
          if (res.success) {
            that.$message.success('退回成功')
            // that.$emit('ok')
            this.loadData(1)
          } else {
            that.$message.warning(res.message)
          }
        })
        .finally(() => {
          that.confirmLoading = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
#Revolution {
  width: 100%;
  height: 100%;
  padding: 30px;
  background-color: #ffffff;
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
          justify-content: flex-end;
          margin-top: 4px;
          margin-right: 8px;
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
    .tables {
      img {
        cursor: pointer;
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
.box-img {
  margin: 0 auto;
  width: 0;
  display: flex;
  justify-content: space-around;
}
</style>