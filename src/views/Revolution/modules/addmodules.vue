<template>
  <div id="two">
    <!-- <a-button type="primary" @click="add"> </a-button> -->
    <a-modal
      :title="title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      :destroyOnClose="true"
    >
      <!-- 确定按钮在左边插槽 -->
      <!-- 确定按钮在左边插槽 -->
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk(2)">保存</a-button>
        <a-button key="back" @click="handleCancel">返回</a-button>
      </template>
      <!-- 表单 -->
      <a-form :form="form" :layout="formLayout">
        <a-form-item label="课程封面：" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <div class="box-img">
            <uploadFiles
              firstPath="file"
              secondPath="course_cover"
              tableName="file_file"
              @vidoe="videos"
              :attributionId="attributionId"
              ref="uploadfiles"
              :imgLength="1"
            ></uploadFiles>
          </div>
        </a-form-item>
        <a-form-item label="课程名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-input
            placeholder="请输入课程名称"
            v-decorator="['courseName', { rules: [{ required: true, message: '请输入课程名称' }] }]"
          />
        </a-form-item>
        <a-form-item label="讲师" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-input
            placeholder="请输入讲师名称"
            v-decorator="['lecturerName', { rules: [{ required: true, message: '请输入讲师名称' }] }]"
          />
        </a-form-item>
        <a-form-item label="分类" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
          <a-select
            style="width: 235px"
            @change="handleChange"
            v-decorator="['dictCommonSubjectId', { rules: [{ required: true, message: '请选择分类' }] }]"
          >
            <a-select-option v-for="item in classification" :key="item.id" :value="item.id"
              >{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="课程日期" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-range-picker v-decorator="['rangepicker', { rules: [{ required: true, message: '请选择课程日期' }] }]" />
        </a-form-item>
        <a-form-item label="课程简介" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-textarea
            placeholder="请输入课程简介"
            v-decorator="['intro', { rules: [{ required: true, message: '请输入课程简介' }] }]"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
    
<script>
//组件引用
import { deleteAction, getAction, httpAction } from '@/api/manage' //接口方法
import { dict, enCourse } from '@/api/ajaxUrl.config.js' //接口
import uploadFiles from '@/components/uploadFiles/index.vue'
import moment from 'moment'
import pick from 'lodash.pick'
export default {
  components: {
    uploadFiles,
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      model: {},
      formLayout: 'horizontal', //输入框
      form: this.$form.createForm(this),
      attributionId: '', //图片上传id
      classification: [],
      title: '',
      loading: false,
      // dateimg: '', //图片数据
      dataurl: '', //图片url
      imgId: '',
      id: '',
    }
  },
  created() {
    this.getBasicInfo()
  },
  //计算属性
  computed: {},
  //实例被挂载后调用
  mounted() {
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {})
  },
  //方法存放处
  methods: {
    moment,
    // 分类
    getBasicInfo() {
      // 查询分类
      getAction(dict.findDictForSelect, { tableName: 'dict_common_subject' }).then((res) => {
        this.classification = res.result
      })
    },
    // 分类下拉框
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    // 获取图片信息
    videos(datas) {
      var dateimg = datas
      if (datas.length > 0) {
        this.dataurl = datas[0].fileSrc
        this.imgId = datas[0].attributionId //获取组件父id
      }
    },
    // 增加
    add() {
      this.edit({})
    },
    edit(record) {
      // console.log(record)
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        // 这里是修改的时候把课程id给子id 但是要先清空不然会把上次的值带过去
        this.$refs.uploadfiles.reset()
        if (this.model.id) {
          setTimeout(() => {
            this.attributionId = record.id //课程id
            this.$refs.uploadfiles.reset(this.attributionId)
            // console.log(this.attributionId)
          })
          this.$nextTick(() => {
            // setFieldsValue设置一组输入控件的值
            this.form.setFieldsValue(pick(this.model, 'courseName', 'lecturerName', 'intro', 'dictCommonSubjectId'))
          })
          // console.log(this.model)
          this.form.setFieldsValue({
            rangepicker: [moment(this.model.startTime, 'YYYY-MM-DD'), moment(this.model.overTime, 'YYYY-MM-DD')],
          })
        }
      })
    },
    // 增加 修改
    handleOk(e) {
      var that = this
      // 获取表单值
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          let myData = {}
          var params = {
            courseCover: this.dataurl,
          }
          // console.log(formData)
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            // 接口
            httpurl += enCourse.add
            method = 'post'
            params.id = this.imgId //图片父id
          } else {
            httpurl += enCourse.edit
            method = 'put'
            params.id = this.attributionId //图片子id
          }

          let formData = Object.assign(params, values)
          // 分类分割字符串  时间格式
          // formData.dictCommonSubjectId = formData.dictCommonSubjectId.join(',')
          formData.startTime = formData.rangepicker[0].format('YYYY-MM-DD hh:mm:ss')
          formData.overTime = formData.rangepicker[1].format('YYYY-MM-DD hh:mm:ss')

          httpAction(httpurl, formData, method)
            .then((res) => {
              if (res.success) {
                that.$message.success('保存成功！')
                this.attributionId = ''
                that.$emit('ok')
                this.$router.push({ name: 'schooldetails-schooldetails', query: { tolink: '1', id: res.result.id } })
                // this.id = res.result.id
                // console.log(this.id)
              } else {
                this.attributionId = ''
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              this.attributionId = ''
              that.confirmLoading = false
              this.loading = false
              that.handleCancel()
            })
        }
      })
    },
    handleCancel(e) {
      this.visible = false
    },
    onChange(checkedValues) {
      // console.log('checked = ', checkedValues)
    },
  },
}
</script>
<style lang="scss" scoped>
.img {
  display: flex;
  justify-content: start;
  height: 90px;
  line-height: 90px;
  .box-img {
    width: 90px;
    height: 90px;
    border: 1px solid #ccc;
  }
}
/deep/ .ant-form-item {
  margin-top: 0;
  margin-bottom: 10px;
}
/deep/ .ant-col-6 {
  width: 34%;
}
/deep/ .ant-form-item label {
  margin-right: 15px;
}
/deep/.ant-form-item-control {
  line-height: 2;
}
/deep/ .ant-checkbox-group {
  line-height: 2.3;
}
</style>