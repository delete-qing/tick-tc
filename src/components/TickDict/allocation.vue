<template>
  <div>
    <div style="padding:0 30px;">
      <div style="margin-bottom:20px;margin-top:10px;">
        <a-select style="width: 20%">
          <a-select-option
            v-for="item in Data"
            :key="item.id"
            @click="QueryList(item.id)"
          >{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <a-table
        :columns="columns"
        :dataSource="data"
        bordered
        size="default"
        :scroll="{ y: 'calc(100vh - 420px)' }"
      >
        <template slot="dailyPerformanceIndex" slot-scope="text, record">
          <div>
            <a-input style="margin: -7px 0" v-model="record.dailyPerformanceIndex" />
          </div>
        </template>
        <template slot="deductionStandard" slot-scope="text, record">
          <div>
            <a-input style="margin: -7px 0" v-model="record.deductionStandard" />
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a @click="save(record)">保存</a>
            </span>
          </div>
        </template>
      </a-table>
      <!-- <div>
        <a-tabs defaultActiveKey="1" :tabPosition="mode" @change="fn">
          <a-tab-pane v-for="item in Data" :key="item.id" :tab="item.name">
            <div v-if="state === true" class="example">
              <a-spin />
            </div>
            <a-table
              :columns="columns"
              :dataSource="data"
              bordered
              size="default"
              :scroll="{ y: 'calc(100vh - 420px)' }"
              v-if="state === false"
            >
              <template slot="dailyPerformanceIndex" slot-scope="text, record">
                <div>
                  <a-input style="margin: -7px 0" v-model="record.dailyPerformanceIndex" />
                </div>
              </template>
              <template slot="deductionStandard" slot-scope="text, record">
                <div>
                  <a-input style="margin: -7px 0" v-model="record.deductionStandard" />
                </div>
              </template>
              <template slot="operation" slot-scope="text, record">
                <div class="editable-row-operations">
                  <span>
                    <a @click="save(record)">保存</a>
                  </span>
                </div>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>-->
    </div>
  </div>
</template>
<script>
import { postAction, getAction } from '@/api/manage'
import { dict } from '@/api/ajaxUrl.config'
const columns = [
  {
    title: '量化指标名称',
    dataIndex: 'dailyPerformanceTitle',
    width: '25%'
  },
  {
    title: '指标数量',
    dataIndex: 'dailyPerformanceIndex',
    width: '30%',
    scopedSlots: { customRender: 'dailyPerformanceIndex' }
  },
  {
    title: '扣分标准',
    dataIndex: 'deductionStandard',
    width: '30%',
    scopedSlots: { customRender: 'deductionStandard' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '15%',
    scopedSlots: { customRender: 'operation' }
  }
]
var data = []
export default {
  created() {
    getAction(dict.list, { tableName: 'dict_quantify_index' })
      .then(res => {
        this.Data = res.result.records
        this.QueryList(this.Data[0].id)
      })
      .catch(err => {
        console.log(err)
      })
  },
  data() {
    this.cacheData = data.map(item => ({ ...item }))
    return {
      data,
      columns,
      state: true,
      Data: [],
      current: [],
      mode: 'top'
    }
  },
  methods: {
    QueryList(id) {
      // console.log(id)
      this.state = true
      this.current = []
      this.current.push(id)
      getAction('/performance/performanceDailyConfigSub/findAllList', {
        fkDictQuantifyIndexId: id
      }).then(res => {
        this.data = res.result
        this.state = false
      })
    },
    save(value) {
      postAction('/performance/performanceDailyConfigSub/updateSingle', {
        id: value.id,
        dailyPerformanceIndex: value.dailyPerformanceIndex,
        deductionStandard: value.deductionStandard
      }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
        }
      })
    },
    fn(activeKey) {
      this.QueryList(this.Data[activeKey].id)
    }
  }
}
</script>
<style lang="scss" scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.example {
  text-align: center;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}
</style>