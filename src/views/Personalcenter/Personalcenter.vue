<template>
  <div id="Revolution">
    <div class="all">
      <page-header></page-header>
      <!-- 头部 -->
      <div class="con detail_con" v-show="show">
        <div class="tick-grzx-table">
          <table border="1" cellspacing="0" cellpadding="0">
            <tr>
              <td rowspan="3" class="trTitle">头像：</td>
              <td rowspan="3"><img :src="formnum.photo" alt="" /></td>
              <td class="trTitle">姓名：</td>
              <td>{{ formnum.name }}</td>
            </tr>
            <tr>
              <td class="trTitle">学历：</td>
              <td>{{ formnum.dictStaffEducationName }}</td>
            </tr>
            <tr>
              <td class="trTitle">出生年月：</td>
              <td>{{ formnum.birthDate }}</td>
            </tr>
            <tr>
              <td class="trTitle">手机号码：</td>
              <td>{{ formnum.phone }}</td>
              <td class="trTitle">邮箱地址：</td>
              <td>{{ formnum.email }}</td>
            </tr>
            <tr>
              <td class="trTitle">所属机构：</td>
              <td>{{ formnum.officeName }}</td>
              <td class="trTitle">职务：</td>
              <td>{{ formnum.dictStaffTechnicalPositionName }}</td>
            </tr>
            <tr>
              <td class="trTitle">所属年级：</td>
              <td>{{ formnum.dictStaffClassName }}</td>
              <td class="trTitle">职称：</td>
              <td>{{ formnum.dictStaffTechnicalPositionQualificationName }}</td>
            </tr>
            <tr>
              <td class="trTitle">所授科目：</td>
              <td>{{ formnum.dictCommonSubjectName }}</td>
              <td class="trTitle"></td>
              <td></td>
            </tr>
          </table>
        </div>
        <div class="right-botton">
          <div class="right-box">
            <a-button type="primary" @click="isshow(1)"> 编辑 </a-button>
          </div>
        </div>
      </div>
      <!-- 表单 -->
      <div class="con" v-show="!show">
        <a-form :form="form" :layout="formLayout">
          <a-form-item label="头像" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
            <div class="box-img">
              <uploadFiles
                firstPath="file"
                secondPath="course_cover"
                tableName="file_file"
                :attributionId="attributionId"
                @vidoe="userlogo"
                ref="uploadfiles"
                :imgLength="1"
              ></uploadFiles>
            </div>
          </a-form-item>
          <a-form-item label="姓名" :label-col="{ span: 2 }" :wrapper-col="{ span: 9 }">
            <a-input v-decorator="['name', {}]" />
          </a-form-item>
          <a-form-item label="手机号码" :label-col="{ span: 2 }" :wrapper-col="{ span: 9 }">
            <a-input :disabled="true" v-decorator="['phone', { rules: [{}] }]" />
          </a-form-item>
          <a-form-item label="邮箱地址" :label-col="{ span: 2 }" :wrapper-col="{ span: 9 }">
            <a-input :disabled="true" v-decorator="['email', { rules: [{}] }]" />
          </a-form-item>
          <a-form-item label="学历" :label-col="{ span: 2 }" :wrapper-col="{ span: 9 }">
            <a-select
              style="width: 100%"
              placeholder="请选择学历"
              v-decorator="['dictStaffEducationId', { rules: [{}] }]"
            >
              <a-select-option v-for="item in dictStaffEducationName" :key="item.id" :value="item.id">{{
                item.name
              }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="出生年月" :label-col="{ span: 2 }" :wrapper-col="{ span: 9 }">
            <a-date-picker @change="onChange" v-decorator="['birthDate', {}]" />
          </a-form-item>
        </a-form>
        <div class="con-bottom">
          <a-form :form="form" :layout="formLayout">
            <a-form-item label="所属机构" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }">
              <a-tree-select
                show-search
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="treeData"
                placeholder="请选择所属机构"
                v-decorator="['officeId', { rules: [{ required: true, message: '请选择机构' }] }]"
                :filterTreeNode="filterTreeNodeData"
                @select="onselect"
              ></a-tree-select>
            </a-form-item>
            <a-form-item label="职务" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }">
              <a-select
                style="width: 100%"
                placeholder="请选择职务"
                v-decorator="['dictStaffTechnicalPositionId', { rules: [{ required: true, message: '请选择职务' }] }]"
              >
                <a-select-option v-for="item in dictStaffTechnicalPositionName" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="职称" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }">
              <a-select
                style="width: 100%"
                placeholder="请选择职称"
                v-decorator="[
                  'dictStaffTechnicalPositionQualificationId',
                  { rules: [{ required: true, message: '请选择职称' }] },
                ]"
              >
                <a-select-option v-for="item in academic" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="所属年级" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }">
              <a-select
                style="width: 100%"
                placeholder="请选择所属年级"
                v-decorator="['dictStaffClassId', { rules: [{ required: true, message: '请选择所属年级' }] }]"
              >
                <a-select-option v-for="item in dictStaffClassName" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="所授科目" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }">
              <a-select
                style="width: 100%"
                placeholder="请选择所授科目"
                v-decorator="['dictCommonSubjectId', { rules: [{ required: true, message: '请选择所授科目' }] }]"
              >
                <a-select-option v-for="item in subject" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </div>
        <div class="right-botton">
          <div class="right-box">
            <a-button type="primary" @click="isshow(2)"> 确定 </a-button>
            <a-button @click="isshow">取消</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>   
<script>
//组件引用
import { deleteAction, getAction, putAction } from '@/api/manage' //接口方法
import { basicStaff, dict, sysOffice } from '@/api/ajaxUrl.config.js' //接口
import PageHeader from '@/components/page/PageHeader.vue'
import uploadFiles from '@/components/uploadFiles/index.vue'
import { mapGetters } from 'vuex'
import moment from 'moment'
import pick from 'lodash.pick'
export default {
  //组件注册
  components: {
    PageHeader,
    uploadFiles,
  },

  data() {
    return {
      show: true,
      form: this.$form.createForm(this),
      formLayout: 'horizontal',
      value: '',
      userID: '', //用户ID
      treeData: [], //机构
      dictStaffClassName: [], //所属年级
      dictStaffTechnicalPositionName: [], //职务
      academic: [], //职称
      subject: [], //科目
      officeName: [], //机构
      attributionId: '', //图片上传
      formnum: {}, //获取数据
      dictStaffEducationName: [], //学历
      model: {},
      officeId: '', //所属机构id
      dictStaffTechnicalPositionId: '', //职务id
      dictStaffTechnicalPositionQualificationId: '', //职称id
      dictStaffClassId: '', //年级id
      dictCommonSubjectId: '', //科目
      dictStaffEducationId: [], //学历
      dataurl: '', //图片路径
    }
  },
  //计算属性  remove
  computed: {},
  //   computed: {},
  //实例被挂载后调用
  mounted() {
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {})
  },
  created() {
    this.userID = this.userInfo().personId
    this.attributionId = this.userInfo().personId
    this.loadData()
    this.getBasicInfo()
  },
  //方法存放处
  methods: {
    moment,
    ...mapGetters(['userInfo']), //获取用户id
    // 获取
    loadData() {
      var params = {
        id: this.userID,
      }
      getAction(basicStaff.list, params).then((res) => {
        if (res.success == true) {
          this.formnum = Object.assign({}, res.result.data)
          // console.log(this.formnum
          // 赋值上去
          this.form.setFieldsValue(
            pick(
              this.formnum,
              'name',
              'phone',
              'email',
              'dictStaffEducationId',
              'officeId',
              'dictStaffTechnicalPositionId',
              'dictStaffClassId',
              'dictCommonSubjectId',
              'dictStaffTechnicalPositionQualificationId'
            )
          )
          // this.form.setFieldsValue({
          //   name: this.formnum.name, //名字
          //   phone: this.formnum.phone,
          //   email: this.formnum.email,
          //   dictStaffEducationName: this.formnum.dictStaffEducationName, //学历
          //   officeName: this.formnum.officeName,
          //   dictStaffTechnicalPositionName: this.formnum.dictStaffTechnicalPositionName,
          //   dictStaffClassName: this.formnum.dictStaffClassName,
          //   dictCommonSubjectName: this.formnum.dictCommonSubjectName,
          // })
          // 日期赋值
          this.form.setFieldsValue({
            birthDate: moment(this.formnum.birthDate),
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 编辑下拉框
    getBasicInfo() {
      getAction(sysOffice.findShopAreaTree).then((res) => {
        this.treeData = res.result
      }) //机构
      getAction(dict.findDictForSelect, { tableName: 'dict_staff_class' }).then((res) => {
        this.dictStaffClassName = res.result
      }) //年级
      getAction(dict.findDictForSelect, { tableName: 'dict_staff_technical_position' }).then((res) => {
        this.dictStaffTechnicalPositionName = res.result
      }) //职务
      getAction(dict.findDictForSelect, { tableName: 'dict_staff_technical_position_qualification' }).then((res) => {
        this.academic = res.result
      }) //职称
      getAction(dict.findDictForSelect, { tableName: 'dict_common_subject' }).then((res) => {
        this.subject = res.result
      }) //科目
      getAction(dict.findDictForSelect, { tableName: 'dict_staff_education' }).then((res) => {
        this.dictStaffEducationName = res.result
      }) //学历
    },
    filterTreeNodeData(inputValue, treeNode) {
      return treeNode.data.props.title.indexOf(inputValue) > -1
    },
    onselect(value, node, extra) {
      let record = extra.node.dataRef
    },
    handleChange(value) {
      // console.log(`selected ${value}`)
    },
    onChange(date, dateString) {
      // console.log(date, dateString)
    },
    isshow(state) {
      // console.log(state)
      this.show = !this.show
      if (state == 2) {
        // 确定
        this.edit()
      }
    },
    // 获取图片信息
    userlogo(datas) {
      var dateimg = datas
      console.log(dateimg)
      this.dataurl = dateimg[0].fileSrc
      // console.log(this.dataurl)
      // this.imgId = datas[0].attributionId //获取组件id
    },
    edit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          var forms = values
          console.log(forms)
          var params = {
            id: this.userID,
            photo: this.dataurl,
          }
          this.model = Object.assign(params, forms)
          putAction(basicStaff.edit, this.model).then((res) => {
            if (res.success) {
              this.$message.success('保存成功！')
              this.loadData()
              this.getBasicInfo()
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
#Revolution {
  width: 100%;
  padding: 30px;
  // height: 100%;
  background-color: #ffffff;
  .all {
    width: 1300px;
    height: 100%;
    margin: 0 auto;
    border-radius: 10px;
    border: solid 1px #e5e6e7;
    .con {
      width: 100%;
      height: 100%;
      // min-height: calc(100vh - 210px);
      padding-top: 30px;
      .con-bottom {
        width: 100%;
        padding-top: 30px;
        padding-bottom: 0;
        border-top: 1px #e5e6e7 solid;
      }
      .right-botton {
        width: 100%;
        height: 62px;
        display: flex;
        background: #f8f8f8;
        border-radius: 0px 0px 5px 5px;
        position: relative;
        left: 0;
        bottom: 0;
        .right-box {
          position: absolute;
          top: 0;
          right: 0;
          button {
            width: 80px;
            height: 40px;
            margin: 12px 10px;
          }
        }
      }
    }
  }

  .ant-col-2 {
    margin-right: 28px;
    // font-size: 22px;
  }
  .ant-form-item {
    margin-bottom: 18px;
  }
  .ant-form-item-control {
    width: 494px;
  }
  .tick-grzx-table {
    padding: 0px 30px 30px 0px;
    table {
      width: 100%;
      border: 1px solid #e5e6e7;
      tr {
        background: #ffffff;
        td {
          padding: 16px;
          font-size: 16px;
          color: #000000;
          img {
            width: 120px;
            height: 120px;
          }
        }
      }
      tr:nth-child(even) {
        background: #ffffff;
      }
      .trTitle {
        width: 120px;
        background: #fafafa;
        color: #999999;
      }
    }
  }
}
.detail_con {
  div {
    margin-left: 30px;
    margin-bottom: 15px;
    color: #999999;
    span {
      color: #000000;
    }
  }
  img {
    width: 75px;
    height: 75px;
  }
  .right-botton {
    margin-left: 0;
    margin-bottom: 0;
  }
  .con-bottom {
    margin-left: 0;
  }
}
.backCss {
  background: #fff;
}

/deep/ .ant-calendar-picker {
  width: 485px;
}
/deep/.ant-select-selection--single {
  width: 485px;
}
</style>