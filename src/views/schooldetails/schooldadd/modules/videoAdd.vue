<template>
  <a-modal
    title="新增视频"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: { disabled: disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    centered
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk"> 确定 </a-button>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="horizontal">
        <a-form-item label="视频上传：" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <div class="box-img">
            <uploadFiles
              firstPath="file"
              secondPath="meeting_book"
              tableName="file_chapter_video"
              @vidoe="videos"
              :attributionId="attribution"
              ref="uploadfiles"
            ></uploadFiles>
          </div>
        </a-form-item>
        <a-form-item label="视频名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-input v-decorator="['fileName', { rules: [{ required: true, message: '请输入视频名称' }] }]" />
        </a-form-item>
        <a-form-item label="排序" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-input-number
            style="width: 100%"
            :min="0"
            :precision="0"
            v-decorator="['sort', { initialValue: 1, rules: [{ required: true, message: '请选择数字' }] }]"
          />
        </a-form-item>
        <!-- <a-form-item label="视频简介：" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-textarea :rows="4" v-decorator="['remark', { rules: [{ required: true, message: '请输入文件简介' }] }]" />
        </a-form-item> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import uploadFiles from '@/components/uploadFiles/indexone.vue'
import { httpAction, getAction, postAction } from '@/api/manage'
import { enCourse, dict } from '@/api/ajaxUrl.config.js' //接口
import pick from 'lodash.pick'
export default {
  name: 'TSAddEdit',
  components: {
    uploadFiles,
  },
  data() {
    return {
      title: '新增', //当前弹窗标题
      visible: false, //当前弹窗是否显示
      disableSubmit: false, //确定按钮是否显示
      form: this.$form.createForm(this),
      spanCol: 24,
      attribution: '',
      confirmLoading: false, //页面和确定按钮的加载动画
      model: {}, //页面传来的数据
      chapterId: '', //章节ID
      vidoear: {},
      vodeoUrl: '', //视频地址
      thumbUrl: '', //缩略图地址
    }
  },
  methods: {
    add(nums) {
      this.chapterId = nums
      this.attribution = nums //清空视频
      // console.log(this.chapterId)
      this.visible = true
    },
    edit(model) {
      this.visible = true
      this.model = model
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'sort', 'fileName'))
      })
    },
    close() {
      this.form.resetFields()
      this.confirmLoading = false
      this.disableSubmit = false
      this.visible = false
    },
    // 新增视频 点击确定 enCourse
    handleOk() {
      // 判断视频id是否存在  如果有执行  如果没有让用户上传
      if (this.vidoear.id) {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            var params = {
              attributionId: this.chapterId, //绑定章节ID
              fileName: values.fileName, //视频名称
              remark: values.remark, //视频简介
              id: this.vidoear.id, //视频id
              thumbUrl: this.thumbUrl,
              sort: values.sort,
            }
            postAction(enCourse.addVideo, params).then((res) => {
              if (res.success == true) {
                this.$message.success('保存成功')
                this.confirmLoading = false
                this.$emit('getvideos')
                this.visible = false
              } else {
                this.visible = false
                this.$message.warning(res.message)
              }
            })
          }
        })
      } else {
        this.$message.warning('请上传视频')
      }
    },

    handleCancel() {
      this.close()
    },
    // 这里是获取图片信息、判断图片上传对否为1张
    videos(datas) {
      this.thumbUrl = datas[0].thumbUrl
      console.log(datas)
      if (datas.length == 0) {
        this.vidoear = {}
      } else {
        this.vidoear = datas[0]
        this.form.setFieldsValue(pick(this.vidoear, 'sort', 'fileName'))
      }
    },
  },
}
</script>
<style lang='scss' scoped>
/deep/ .ant-form-item {
  margin-bottom: 6px;
}
</style>