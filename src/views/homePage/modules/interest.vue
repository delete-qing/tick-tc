<template>
  <a-modal
    title="兴趣选择"
    :width="450"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    centered
    wrapClassName="login"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button key="submit" type="primary" @click="handleOk(2)">保存</a-button>
      <a-button key="back" @click="handleCancel">返回</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="vertical">
        <a-row :gutter="24">
          <a-col :span="spanCol">
            <a-form-item>
              <a-checkbox-group @change="change" v-decorator="['dictCommonSubjectId', {}]" style="width: 100%">
                <a-row :gutter="25">
                  <a-col :span="8" v-for="item in dictData" :key="item.id">
                    <a-checkbox :value="item.id">{{ item.name }}</a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { httpAction, getAction } from '@/api/manage'
import { dict, dictSysConfig } from '@/api/ajaxUrl.config'
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      title: '新增', //当前弹窗标题
      visible: false, //当前弹窗是否显示
      disableSubmit: false, //确定按钮是否显示
      form: this.$form.createForm(this),
      spanCol: 24,
      confirmLoading: false, //页面和确定按钮的加载动画
      dictData: [], //分类数据
      userID: '', //人员id
      datanum: {}, //兴趣数据选中的id
      dictCommonSubjectId: [], //分类id
    }
  },
  mounted() {
    this.getBasicInfo()
  },
  methods: {
    ...mapGetters(['userInfo']), //获取用户id
    change(value) {
      // console.log(value.length)
      // var numdata = value.length
    },
    // 分类
    getBasicInfo() {
      getAction(dict.findDictForSelect, { tableName: 'dict_common_subject' }).then((res) => {
        this.dictData = res.result
      })
    },
    add() {
      this.edit()
    },
    edit(data) {
      this.visible = true
      this.model = { dictCommonSubjectId: data }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'dictCommonSubjectId'))
      })
    },
    close() {
      this.form.resetFields()
      this.confirmLoading = false
      this.disableSubmit = false
      this.visible = false
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        this.confirmLoading = true
        var listid = values
        if (listid.dictCommonSubjectId.length > 8) {
          this.$message.warning('兴趣选择不可超过八项')
          this.confirmLoading = false
          return
        } else {
          this.userID = this.userInfo().personId
          listid.dictCommonSubjectId = listid.dictCommonSubjectId.join(',')
          var params = {
            dictCommonSubjectId: listid.dictCommonSubjectId,
            fkBasicStaffId: this.userID,
          }
          getAction(dictSysConfig.interest, params).then((res) => {
            if (res.success == true) {
              this.datanum = res.result.success.dictCommonSubjectId
              this.$emit('getSubjectId', this.datanum)
              this.confirmLoading = false
              this.visible = false
            } else {
              this.$message.warning(res.message)
              this.confirmLoading = false
            }
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>
<style lang="scss" scoped>
.logbut {
  margin: 5px 0 10px 0;
}
.register {
  text-align: center;
}
.registertext {
  color: #23b8ff;
  cursor: pointer;
}
.underReview {
  .logCon {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .logText {
    text-align: center;
    letter-spacing: 0px;
    color: #999999;
    font-size: 17px;
  }
  .logImg {
    text-align: center;
    margin: 25px 0;
  }
  .logBut {
    text-align: center;
  }
}
/deep/ .ant-modal-title {
  font-weight: 600 !important;
  color: #333333;
}
/deep/ .ant-btn {
  width: 100%;
}
/deep/ .ant-form-vertical .ant-form-item {
  margin-bottom: 5px;
}
/deep/ .ant-col-5 {
  width: 20%;
  margin-bottom: 15px;
}
</style>