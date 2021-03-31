<template>
  <div id="tick-mechanism">
    <div class="all">
      <div class="result">
        <page-header></page-header>
        <a-layout style="height: 100%; background: #fff" :class="{ 'anty-node-layout': true }">
          <a-layout-header class="header">
            <div class="anty-opt-btn">
              <!-- 按钮操作区域 -->
              <a-button @click="handleAdd(2)" style="margin-left: 18px" type="primary" icon="plus">添加子部门</a-button>
              <a-button @click="handleAdd(1)" type="default" icon="plus">添加一级部门</a-button>
              <a-button title="删除多条数据" @click="batchDel" type="default" icon="delete">批量删除</a-button>
              <a-button @click="refresh" type="default" icon="reload" :loading="loading">刷新</a-button>
            </div>
          </a-layout-header>

          <a-layout-content>
            <a-layout style="background: #fff">
              <a-layout-sider width="400" style="background: #fff; padding-left: 16px; height: 100%">
                <a-alert type="info" :showIcon="true">
                  <div slot="message">
                    当前选择：
                    <a v-if="this.currSelected.name">{{ getCurrSelectedTitle() }}</a>
                    <a v-if="this.currSelected.name" style="margin-left: 10px" @click="onClearSelected">取消选择</a>
                  </div>
                </a-alert>
                <a-input-search
                  @search="onSearch"
                  style="width: 100%; margin-top: 10px"
                  placeholder="请输入部门名称进行搜索"
                />
                <!-- 树-->
                <a-tree
                  checkable
                  multiple
                  @select="onSelect"
                  @check="onCheck"
                  :selectedKeys="selectedKeys"
                  :checkedKeys="checkedKeys"
                  :treeData="departTree"
                  :checkStrictly="true"
                  :expandedKeys="iExpandedKeys"
                  :autoExpandParent="autoExpandParent"
                  @expand="onExpand"
                  class="myTree"
                  :loading="loading"
                />
              </a-layout-sider>

              <a-layout-content :style="{ padding: '30px 24px 30px 24px', height: '100%' }">
                <a-form :form="form">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级部门">
                    <a-tree-select
                      style="width: 100%"
                      :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                      :treeData="treeData"
                      v-model="model.parentId"
                      placeholder="无"
                    ></a-tree-select>
                  </a-form-item>
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构名称">
                    <a-input placeholder="请输入机构/部门名称" v-decorator="['name', validatorRules.title]" />
                  </a-form-item>
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构编码">
                    <a-select placeholder="请选择" v-decorator="['dictOfficeProfessionId', {}]">
                      <a-select-option v-for="item in officeProfession" :key="item.id" :value="item.id">{{
                        item.name
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="教育程度">
                <a-input placeholder="请输入教育程度" v-decorator="['name', validatorRules.title]" />
              </a-form-item> -->
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单位层级">
                    <a-select placeholder="请选择" v-decorator="['officeDirectorId', {}]">
                      <a-select-option v-for="(item, index) in personal" :key="index" :value="item.id">{{
                        item.name
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-form>

                <div class="anty-form-btn">
                  <a-button @click="emptyCurrForm" type="default" htmlType="button" icon="sync">重置</a-button>
                  <a-button @click="submitCurrForm" type="primary" htmlType="button" icon="form">修改并保存</a-button>
                </div>
              </a-layout-content>
            </a-layout>
          </a-layout-content>

          <Depart-modal ref="DepartModal" @ok="loadTree"></Depart-modal>
        </a-layout>
      </div>
    </div>
  </div>
</template>
<script>
import DepartModal from './modules/DepartModal'
import pick from 'lodash.pick'
import { queryDepartTreeList, searchByKeywords } from '@/api/api'
import { httpAction, deleteAction, getAction } from '@/api/manage'
import PageHeader from '@/components/page/PageHeader.vue'
import { basicData, dict, sysOffice } from '@/api/ajaxUrl.config.js'

// 表头  queryByOfficeId
const columns = [
  {
    title: '机构名称',
    dataIndex: 'departName',
  },
  {
    title: '机构类型',
    align: 'center',
    dataIndex: 'orgType',
  },
  {
    title: '机构编码',
    dataIndex: 'orgCode',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    title: '传真',
    dataIndex: 'fax',
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
  {
    title: '排序',
    align: 'center',
    dataIndex: 'sort',
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'DepartList',
  components: {
    DepartModal,
    PageHeader,
  },
  data() {
    return {
      iExpandedKeys: [],
      loading: false,
      autoExpandParent: true,
      currFlowId: '',
      currFlowName: '',
      disable: true,
      treeData: [],
      departTree: [],
      hiding: true,
      model: {},
      depart: {},
      columns: columns,
      disableSubmit: false,
      checkedKeys: [],
      selectedKeys: [],
      currSelected: {},
      form: this.$form.createForm(this),
      personal: [],
      officeProfession: [],
      deleteTempArr: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      graphDatasource: {
        nodes: [],
        edges: [],
      },
      validatorRules: {
        title: {
          rules: [{ required: true, message: '请输入机构/部门名称!' }],
        },
        orgCode: { rules: [{ required: true, message: '请输入机构编码!' }] },
        mobile: { rules: [{ validator: this.validateMobile }] },
      },
      url: {
        delete: '/sysdepart/sysDepart/delete',
        edit: '/sys/sysOffice/edit',
        deleteBatch: '/sys/sysOffice/deleteBatch',
      },
    }
  },
  methods: {
    loadTree() {
      var that = this
      that.treeData = []
      that.departTree = []
      that.loading = true
      queryDepartTreeList().then((res) => {
        if (res.success) {
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            that.treeData.push(temp)
            that.departTree.push(temp)
            that.setThisExpandedKeys(temp)
            // console.log(temp.id)
            that.loading = false
          }
          this.loading = false
        }
      })
    },
    setThisExpandedKeys(node) {
      if (node.children && node.children.length > 0) {
        this.iExpandedKeys.push(node.key)
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },
    refresh() {
      this.loading = true
      this.loadTree()
    },
    onExpand(expandedKeys) {
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    backFlowList() {
      this.$router.back(-1)
    },
    addRootNode() {
      this.$refs.nodeModal.add(this.currFlowId, '')
    },
    batchDel: function () {
      // console.log(this.checkedKeys)
      if (this.checkedKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
      } else {
        let ids = this.deleteTempArr.join(',')
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '确定要删除所选中的 ' + this.checkedKeys.length + ' 条数据?',
          onOk: function () {
            deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadTree()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          },
        })
      }
    },
    onSearch(value) {
      let that = this
      if (value) {
        queryDepartTreeList({ keyWord: value }).then((res) => {
          if (res.success) {
            that.departTree = []
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.departTree.push(temp)
            }
          } else {
            that.$message.warning(res.message)
          }
        })
      } else {
        that.loadTree()
      }
    },
    nodeModalOk() {
      this.loadTree()
    },
    nodeModalClose() {},
    onCheck(checkedKeys, info) {
      // console.log(checkedKeys)
      this.hiding = false
      this.checkedKeys = checkedKeys.checked
      let tempArr = []
      this.checkedKeys.forEach((v) => {
        let tempValue = ''
        if (v.length == 3) {
          tempValue = v.substr(-1)
        } else if (v.length < 64) {
          tempValue = v.substr(2)
        } else {
          tempValue = v.substr(33)
        }
        tempArr.push(tempValue)
      })
      this.deleteTempArr = tempArr
    },
    onSelect(selectedKeys, e) {
      // console.log(e.node.dataRef.key)
      getAction(sysOffice.queryById, { id: e.node.dataRef.value }).then((res) => {
        this.hiding = false
        let record = res.result
        record.key = e.node.dataRef.key
        this.currSelected = Object.assign({}, record)
        this.model = this.currSelected
        this.selectedKeys = [record.key]
        this.model.parentId = record.parentId
        // console.log(this.model)
        // this.personalList(record.parentId)
        this.$nextTick(() => {
          this.form.setFieldsValue(
            pick(
              record,
              'name',
              'sort',
              'mobile',
              'phone',
              'memo',
              'dictOfficeProfessionId',
              'differentiate',
              'officeDirectorId',
              'highSpeedRail',
              'depType'
            )
          )
        })
      })
    },
    // personalList: function (officeId) {
    //   // 人员
    //   getAction('/basic/basicStaff/queryByOfficeId', { officeId: officeId })
    //     .then((res) => {
    //       // console.log(res)
    //       this.personal = res
    //     })
    //     .catch((err) => {
    //       // console.log(err)
    //     })
    // },
    // 左侧文字
    getCurrSelectedTitle() {
      return !this.currSelected.name ? '' : this.currSelected.name
    },
    onClearSelected() {
      this.hiding = true
      this.model = {}
      this.checkedKeys = {}
      this.currSelected = {}
      this.selectedKeys = []
    },
    handleNodeTypeChange(val) {
      this.currSelected.nodeType = val
    },
    notifyTriggerTypeChange(value) {
      this.currSelected.notifyTriggerType = value
    },
    receiptTriggerTypeChange(value) {
      this.currSelected.receiptTriggerType = value
    },
    submitCurrForm() {
      this.form.validateFields((err, values) => {
        console.log(err)
        if (!err) {
          // console.log(this.currSelected)
          if (!this.currSelected.name) {
            this.$message.warning('请点击选择要修改部门!')
            return
          }

          let formData = Object.assign(this.currSelected, values)

          // console.log('Received values of form: ', formData)
          httpAction(this.url.edit, formData, 'put').then((res) => {
            if (res.success) {
              this.$message.success('保存成功!')
              this.loadTree()
              this.selectedKeys = []
            }
          })
        }
      })
    },
    // 重置
    emptyCurrForm() {
      this.model.parentId = ''
      // resetFields	重置一组输入控件的值（为 initialValue）与状态，如不传入参数，则重置所有组件
      this.form.resetFields()
    },
    nodeSettingFormSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values)
        }
      })
    },
    openSelect() {
      this.$refs.sysDirectiveModal.show()
    },
    handleAdd(num) {
      if (num == 1) {
        this.$refs.DepartModal.add()
        this.$refs.DepartModal.title = '新增'
      } else {
        let key = this.currSelected.key
        if (!key) {
          this.$message.warning('请先选中一条记录!')
          return false
        }
        this.$refs.DepartModal.add(this.selectedKeys)
        this.$refs.DepartModal.title = '新增'
      }
    },
    selectDirectiveOk(record) {
      // console.log('选中指令数据', record)
      this.nodeSettingForm.setFieldsValue({
        directiveCode: record.directiveCode,
      })
      this.currSelected.sysCode = record.sysCode
    },
    getFlowGraphData(node) {
      this.graphDatasource.nodes.push({
        id: node.id,
        text: node.flowNodeName,
      })
      if (node.children.length > 0) {
        for (let a = 0; a < node.children.length; a++) {
          let temp = node.children[a]
          this.graphDatasource.edges.push({
            source: node.id,
            target: temp.id,
          })
          this.getFlowGraphData(temp)
        }
      }
    },
  },
  created() {
    this.currFlowId = this.$route.params.id
    this.currFlowName = this.$route.params.name
    this.loadTree()
    // 归属专业
    getAction(dict.officeProfession).then((res) => {
      this.officeProfession = res.result
    })
  },
}
</script>
<style scoped>
#tick-mechanism {
  width: 100%;
  background-color: #ffffff;
  padding: 30px;
}
.all {
  width: 1300px;
  /* height: 100%; */
  margin: 0 auto;
  border-radius: 10px;
  border: solid 1px #e5e6e7;
  min-height: calc(100vh - 140px);
}
.layout .header {
  background: #fff !important;
}
.anty-form-btn {
  width: 100%;
  text-align: center;
}
.anty-form-btn button {
  margin: 0 10px;
}
.ant-form-item-control {
  margin-bottom: 22px;
}
.anty-node-layout .ant-layout-content {
  margin: 0 !important;
}
.anty-node-layout .ant-layout-header {
  padding-right: 0;
}
.header {
  padding: 0 8px;
}
.header button {
  margin: 0 3px;
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
#app .desktop {
  height: auto !important;
}

.myTree {
  height: calc(100vh - 290px);
  overflow: auto;
}
</style>