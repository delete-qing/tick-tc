<template>
  <div id="pageset">
    <div class="content">
      <div class="pageheader">
        <pageHeader></pageHeader>
      </div>
      <div class="conform">
        <a-spin :spinning="confirmLoading">
          <a-form :form="form" layout="horizontal">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="系统名称：" :label-col="{ span: 2 }" :wrapper-col="{ span: 4 }">
                  <!-- 改为inpute框 -->
                  <a-input
                    placeholder="请输入名称"
                    v-decorator="['lecturerName', { rules: [{ required: true, message: '请输入名称' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="系统logo：" :label-col="{ span: 2 }" :wrapper-col="{ span: 18 }">
                  <uploads
                    ref="uploadFileslogo"
                    firstPath="file"
                    secondPath="home"
                    tableName="file_home"
                    @vidoe="imgdata"
                    :attributionId="systemLogoID"
                    :imgLength="1"
                  >
                    <!-- :attributionId="systemLogoID" 绑定id-->
                  </uploads>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="轮播图设置：" :label-col="{ span: 2 }" :wrapper-col="{ span: 18 }">
                  <uploads-imgs
                    ref="uploadFilesimgs"
                    firstPath="file"
                    secondPath="maintenanceWorkTicket"
                    tableName="file_home"
                    :attributionIds="systemSlidenID"
                  ></uploads-imgs>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="默认显示分类：" :label-col="{ span: 2 }" :wrapper-col="{ span: 4 }">
                  <a-select
                    mode="multiple"
                    v-decorator="[
                      'selectMultiple',
                      {
                        rules: [{ required: true, message: '请选择分类', type: 'array' }],
                      },
                    ]"
                    placeholder="请选择默认显示分类"
                  >
                    <a-select-option :value="item.id" v-for="item in dictData" :key="item.id">{{
                      item.name
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </div>
      <div class="footer clearfix">
        <div class="foobutton">
          <a-button @click="submit" type="primary" style="margin-right: 15px"> 确定 </a-button>
          <a-button>取消</a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//组件引用
import pageHeader from '@/components/page/PageHeader.vue'
import { httpAction, getAction, putAction } from '@/api/manage'
// import uploadFiles from '@/components/uploadFiles'
import uploads from '@/components/uploadFiles/index.vue' //logo图
import uploadsImgs from '@/components/uploadFiles/indeximgs.vue' //logo图
import videoPlayer from '@/components/videoPlayer'
import { dict, dictSysConfig, basicStaff } from '@/api/ajaxUrl.config'
import pick from 'lodash.pick'
// import name from ""
export default {
  //组件注册
  components: {
    pageHeader,
    // uploadFiles,
    uploads,
    uploadsImgs,
    videoPlayer,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      confirmLoading: false,
      attributionId: '',
      attributionIds: '',
      dictData: [],
      systemLogoID: '', //系统logo
      systemSlidenID: '', //轮播图
      objnum: [],
      lododata: '',
    }
  },
  //计算属性
  computed: {},
  //实例被挂载后调用
  mounted() {
    this.getBasicInfo()
    this.loadData()
    //整个视图都渲染完毕调用 $ 后空格去掉
    //this.$nextTick(() => {
    //})
  },
  //方法存放处
  methods: {
    // 赋值获取数据
    loadData() {
      getAction(dictSysConfig.pageList).then((res) => {
        if (res.success == true) {
          this.systemLogoID = res.result.systemLogo.id //logo  id
          this.$refs.uploadFileslogo.reset(this.systemLogoID) //绑定 logo id
          console.log('this.systemLogoID  logoid', this.systemLogoID)
          this.systemSlidenID = res.result.systemSliden.id //轮播图id
          this.$refs.uploadFilesimgs.reset(this.systemSlidenID)
          console.log('this.systemSlidenID sildeis', this.systemSlidenID)
          var objnum = res.result.systemSubject.value.split(',') //分类
          this.form.setFieldsValue({
            lecturerName: res.result.systemName.value,
            selectMultiple: objnum,
          })
          // console.log(objnum)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 修改
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            logoUrl: this.lododata,
          }
          let formData = Object.assign(params, values)
          // console.log(formData)
          if (formData.selectMultiple.length > 6) {
            this.$message.warning('默认显示分类不可超过六项')
            return
          }
          formData.selectMultiple = formData.selectMultiple.join(',')

          putAction(dictSysConfig.edit, formData).then((res) => {
            if (res.success) {
              this.$message.success('保存成功！')
              // this.loadData()
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    getBasicInfo() {
      getAction(dict.findDictForSelect, { tableName: 'dict_common_subject' }).then((res) => {
        this.dictData = res.result
      })
    },
    // 图片信息
    imgdata(dataurl) {
      this.lododata = dataurl[0].fileSrc
      // console.log(this.lododata)
    },
  },
}
</script>
<style lang="scss" scoped>
#pageset {
  background: #fff;
  padding: 30px;
  // height: calc(100vh - 150px);
  height: 100%;
}
.content {
  width: 1300px;
  height: 100%;
  z-index: 99;
  margin: 0 auto;
  // background: #fff;
  border: 1px solid #e5e6e7;
  border-radius: 10px;
  position: relative;
  .conform {
    padding: 30px;
    height: calc(100vh - 225px);
    overflow: auto;
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #f8f8f8;
    padding: 12px 20px;
    .foobutton {
      float: right;
    }
  }
}
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
/deep/ .ant-calendar-picker {
  width: 485px;
}
/deep/ .ant-select-selection--single {
  width: 485px;
}
</style>