<template>
  <a-modal
    title="批量添加/修改"
    :width="1200"
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
    <!-- 内容 vidoe-->
    <a-spin :spinning="spinning">
      <div class="top">
        <p>导入试卷信息，如需更改，请先导出试卷信息，在导出表格里进行修改。</p>
      </div>
      <div class="conter">
        <div class="switchTop">
          <div
            class="textone"
            @click="relation(1)"
            :class="isShow ? 'isShow active' : 'isShow'"
            style="border-radius: 27px 0 0 27px"
          >
            <span>批量导入</span>
          </div>
          <div
            class="texttwo"
            @click="relation(2)"
            :class="!isShow ? 'isShow active' : 'isShow'"
            style="border-radius: 0 27px 27px 0"
          >
            <span>批量导出/修改</span>
          </div>
        </div>
        <!-- 下面 导入-->
        <div class="below" v-show="isShow">
          <div class="left">
            <p>1.下载模板，填写考题信息</p>
            <div class="box-img">
              <img src="@assets/image/shangchuan.png" />
            </div>
            <div class="text-botm">
              <p>请按照模板格式填写</p>
            </div>
            <a download :href="urls + '/tick-tc/course/enCourseChapterTopic/exportWord?size=' + 3">
              <div class="box">
                <p>下载文件</p>
              </div>
            </a>
          </div>
          <div class="left">
            <div class="text">
              <p>2.上传填好的文件</p>
            </div>
            <div class="box-img">
              <img src="@assets/image/wenjan.png" />
            </div>
            <div class="text-botm"><p>仅支持xls格式文件</p></div>
            <a-upload
              name="file"
              :multiple="false"
              :action="importModelUrl"
              :headers="headers"
              :showUploadList="false"
              @change="handleChange"
              :data="{ topicId: this.chapterId }"
            >
              <div class="box">
                <p>上传文件</p>
              </div>
            </a-upload>
          </div>
        </div>
        <!-- 切换 导出-->
        <div class="below" v-show="!isShow">
          <div class="left">
            <p>1.下载全部数据</p>
            <div class="box-img">
              <img src="@assets/image/shangchuan.png" />
            </div>
            <div class="text-botm">
              <p>导出数据再次上传会覆盖原有数据</p>
            </div>
            <a download :href="urls + '/tick-tc/course/enCourseChapterTopic/exportWord?topicId=' + this.chapterId">
              <div class="box">
                <p>下载文件</p>
              </div>
            </a>
          </div>
          <div class="left">
            <div class="text">
              <p>2.上传填好的文件</p>
            </div>
            <div class="box-img">
              <img src="@assets/image/wenjan.png" />
            </div>
            <div class="text-botm"><p>仅支持xls格式文件</p></div>
            <a-upload
              name="file"
              :multiple="false"
              :action="importModelUrl"
              :headers="headers"
              :showUploadList="false"
              @change="handleChange"
              :data="{ topicId: this.chapterId }"
            >
              <div class="box">
                <p>上传文件</p>
              </div>
            </a-upload>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import { httpAction, getAction } from '@/api/manage'
import { enCourseChapterTopic } from '@/api/ajaxUrl.config.js' //接口
import uploadFiles from '@/components/uploadFiles/indexone.vue'
import pick from 'lodash.pick'
import exportExcel from '@/components/ExportExcel'
import { mapGetters } from 'vuex'
export default {
  name: 'TSAddEdit',
  components: {
    uploadFiles,
  },
  data() {
    return {
      visible: false, //当前弹窗是否显示
      disableSubmit: false, //确定按钮是否显示
      // attribution: '',
      //   form: this.$form.createForm(this),
      confirmLoading: false, //页面和确定按钮的加载动画
      model: {}, //页面传来的数据
      isShow: true,
      chapterId: '', //章节id
      urls: this.getUrl(),
      spinning: false,
      // 这是导入路径
      importModelUrl: getUrl() + '/tick-tc/course/enCourseChapterTopic/import',

      headers: {
        'X-Access-Token': this.userInfo().token,
        authorization: 'authorization-text',
      },
      url: {
        add: '',
        edit: '',
      },
    }
  },
  mounted() {
    this.getUrl()
    console.log(this.userInfo())
  },
  methods: {
    ...mapGetters(['userInfo']),
    exportExcel,
    relation(value) {
      if (value == 1) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    // 导入试题
    handleChange(info) {
      console.log(info)
      if (info.file.status == 'uploading') {
        this.spinning = true
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        // this.$message.success(`${info.file.name} 上传成功！`);
        if (info.file.response.success) {
          this.$confirm({
            title: info.file.response.message,
            class: 'test',
          })
          this.$emit('getlode')
          // this.loadData()
          // 这里要把上传的数据返回个页面
        } else {
          this.$confirm({
            title: info.file.response.message,
            class: 'test',
          })
        }
        this.spinning = false
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败！`)
        this.spinning = false
      }
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
    add(data) {
      console.log(data)
      this.chapterId = data
      this.visible = true
    },
    // edit(model) {
    //   this.model = model
    //   this.$nextTick(() => {
    //     this.form.setFieldsValue(pick(this.model, 'name', 'sign', 'sort'))
    //   })
    // },
    close() {
      this.confirmLoading = false
      this.disableSubmit = false
      this.visible = false
    },
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>
<style lang='scss' scoped>
.top {
  // width: 1235px;
  height: 46px;
  margin: 0px auto;
  color: #1fb2f8;
  background-color: #deefff;
  border-radius: 5px;
  line-height: 46px;
  p {
    font-size: 15px;
    margin-left: 20px;
  }
}
.conter {
  .switchTop {
    width: 330px;
    height: 54px;
    line-height: 54px;
    border: 1px solid #ebeced;
    border-radius: 27px;
    display: flex;
    margin: 20px auto;
    text-align: center;
    margin-bottom: 50px;
    justify-content: space-around;
    div {
      width: 165px;
      cursor: pointer;
    }
  }
}
.isShow {
  font-size: 18px;
  color: #23b8ff;
}
.active {
  background: #23b8ff;
  color: #ffffff;
}
.below {
  display: flex;
  justify-content: space-around;
  font-size: 20px;
  font-weight: 500;
  color: #333333;
  .left {
    display: flex;
    flex-direction: column;
    width: 400px;
    text-align: center;
    .box-img {
      margin: 20px auto 30px;
      // width: 157px;
      // height: 187px;
      border: 1px solid #c2c2c2;
      border-radius: 10px;
      img {
        margin: 50px;

        // width: 30px;
        // height: 80px;
      }
    }
    .text-botm {
      font-size: 17px;
      color: #999999;
      span {
        color: #23b8ff;
        cursor: pointer;
        margin-left: 3px;
        text-decoration: underline;
      }
    }
    .box {
      width: 145px;
      height: 44px;
      background: #23b8ff;
      color: #ffffff;
      border-radius: 22px;
      margin: 30px auto 80px;
      line-height: 44px;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>