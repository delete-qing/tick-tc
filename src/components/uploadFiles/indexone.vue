<template>
  <div class="clearfix">
    <a-upload
      :action="url.upload"
      listType="picture-card"
      :fileList="fileList"
      :defaultFileList="fileList"
      :data="ajaxParams"
      :multiple="multipleFlag"
      @preview="handlePreview"
      @change="handleChange"
      :showUploadList="showUploadListFlags"
    >
      <div v-if="this.fileList.length < 1">
        <a-icon type="plus" />
      </div>
    </a-upload>
    <a-modal
      title="提示框"
      :visible="visible"
      @ok="handleDelete"
      :confirmLoading="confirmLoading"
      @cancel="handleDelModalCancel"
    >
      <p>确定删除吗？</p>
    </a-modal>
    <div id="previewImages" style="display: none; height: 0; width: 0">
      <img v-for="(item, index) in previewImages" :src="item.fileSrc" :key="index" :alt="item.filename" />
    </div>
    <video-popup ref="videoPopup"></video-popup>
  </div>
</template>
<script>
import { getAction, deleteAction, postAction } from '@/api/manage'
import videoPopup from '@/components/videoPlayer/popup'
import { uploadFile } from '@/api/uploadUrl.config'
import { UUID } from '@/utils/util'
import Viewer from 'viewerjs'
import fileIcon from './defaultIcon/excel.png'
import fileIconw from './defaultIcon/WORD.png'
export default {
  props: {
    firstPath: {
      type: String,
      required: true,
    },
    secondPath: {
      type: String,
      required: true,
    },
    tableName: {
      type: String,
      required: true,
    },
    uploadType: {
      type: String,
      required: false,
      default: 'image',
      validator: function (value) {
        return ['image', 'file', 'mixin'].indexOf(value) !== -1
      },
    },
    attributionId: {
      type: String,
      default: '',
    },
    multipleFlag: {
      type: Boolean,
      default: false,
    },
    previewFlag: {
      type: Boolean,
      default: true,
    },
    removeFlag: {
      type: Boolean,
      default: true,
    },
    uploadFlag: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      fileList: [],
      ajaxParams: {
        attributionId: UUID.prototype.createUUID(),
        firstPath: this.firstPath,
        secondPath: this.secondPath,
        tableName: this.tableName,
        // disabled: this.disabled,
      },
      previewImages: [],
      uuid: '',
      showUploadListFlags: { showPreviewIcon: this.previewFlag, showRemoveIcon: this.removeFlag },
      url: {
        upload: uploadFile.upload,
        delete: uploadFile.delete,
        fileBaseUrl: '',
        list: uploadFile.list,
      },
      urlone: '', //视频ID
    }
  },
  components: {
    Viewer,
    videoPopup,
  },
  methods: {
    handleDelete() {
      // console.log(this.currentImageId)
      this.confirmLoading = true
      let data = {
        id: this.currentImageId,
        tableName: this.ajaxParams.tableName,
      }
      deleteAction(this.url.delete, data)
        .then((res) => {
          this.$message.success(res.message)
          this.urlone = ''
          this.$emit('vidoe', [])
          this.loadData()
        })
        .catch((err) => {
          console.log(err)
        })
      this.visible = false
      this.confirmLoading = false
    },
    handleDelModalCancel() {
      this.visible = false
    },
    handlePreview(file) {
      console.log(file)
      //图片
      if ('.jpg|.jpeg|.gif|.png|.bmp|.JPG|.JPEG|.GIF|.PNG|.BMP'.indexOf(file.fileSuffix) > -1) {
        //图片在线弹出窗口预览（viewerjs）
        this.gallery && this.gallery.destroy()
        this.gallery = new Viewer(document.getElementById('previewImages'))
        this.gallery.view()
        // console.log(this.gallery)
      } else {
        //使用downLoadjs，下载对应的文件（通过file.url获取对应的地址）
        // window.open(file.fileSrc)
        // console.log(file)
        this.$refs.videoPopup.video(file.fileSrc, file.thumbUrl) //传递 视频地址  视频封面地址
      }
    },
    handleChange(info) {
      this.urlone = ''
      if (info.file.status == 'removed') {
        this.visible = true
        this.currentImageId = info.file.uid
      }
      if (info.file.status == 'uploading') {
        this.fileList = [...info.fileList]
      }
      if (info.file.status == 'done') {
        console.log(info)
        this.urlone = info.file.response.id
        this.loadData()
      }
    },
    delect(item) {
      this.visible = true
      this.item = item
    },
    reset(mid) {
      console.log(mid)
      if (mid) {
        this.ajaxParams.attributionId = mid
        this.loadData()
      } else {
        this.ajaxParams.attributionId = UUID.prototype.createUUID()
        this.fileList = []
      }
    },
    loadData() {
      let _this = this
      this.previewImages = []
      if (this.urlone) {
        this.ajaxParams.id = this.urlone
        console.log(this.ajaxParams)
        getAction(this.url.list, this.ajaxParams)
          .then((res) => {
            console.log(res)
            this.fileList = res.result
            this.$emit('vidoe', this.fileList)
            // this.$emit('imgUrl', this.fileList)
            // console.log(this.fileList)
            this.fileList.forEach((v) => {
              v.uid = v.id
              var thumbUrl = v.fileSrc
              if (v.thumbUrl) {
                v.thumbUrl = _this.url.fileBaseUrl + v.thumbUrl
              } else if (thumbUrl.indexOf('.xls') > -1 || thumbUrl.indexOf('.xlsx') > -1) {
                v.thumbUrl = fileIcon
              } else if (thumbUrl.indexOf('.doc') > -1 || thumbUrl.indexOf('.docx') > -1) {
                v.thumbUrl = fileIconw
              } else if (thumbUrl.indexOf('.ppt') > -1 || thumbUrl.indexOf('.pptx') > -1) {
                v.thumbUrl = getUrl() + '/fileImg/ppt.jpg'
              } else {
                v.thumbUrl = getUrl() + '/fileImg/file.jpg'
              }
              v.fileSrc = _this.url.fileBaseUrl + v.fileSrc
              let len = thumbUrl.split('.').length
              if ('.jpg|.jpeg|.gif|.png|.bmp|.JPG|.JPEG|.GIF|.PNG|.BMP'.indexOf(thumbUrl.split('.')[len - 1]) > -1) {
                this.previewImages.push(v)
              }

              // console.log(this.previewImages)
            })
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        this.fileList = []
      }
    },
  },
  mounted() {
    this.attributionId && (this.ajaxParams.attributionId = this.attributionId)
  },
  created() {
    this.loadData()
    this.urlone = ''
  },
}
</script>
<style lang="scss">
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
