<template>
  <div id="two">
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      width="1300px"
      :destroyOnClose="destroyOnClose"
      :maskClosable="false"
    >
      <template slot="footer">
        <!-- <a-button key="submit" type="primary" :loading="loadings" @click="handleOk(2)">保存</a-button> -->
        <a-button key="back" @click="handleCancel">返回</a-button>
      </template>
      <div class="conter">
        <!-- 头部 -->
        <div class="top">
          <div class="top-right">
            <!-- <a-spin :spinning="spinning"> -->
            <a-form :form="form" :layout="formLayout">
              <a-row :gutter="24">
                <a-col :xl="24">
                  <a-form-item label="章节名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-input
                      placeholder="请输入章节名称"
                      v-decorator="['chapterName', { rules: [{ required: true, message: '请输入章节名称' }] }]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <div class="button">
              <a-button @click="onSbumit" :loading="loading">保存</a-button>
            </div>
          </div>

          <div class="top-left">
            <div @click="relation('视频')" :class="isShow ? 'left-one action' : 'left-one'">
              <img v-if="isShow" src="@assets/image/videoa.png" alt="" />
              <img v-else src="@assets/image/video.png" alt="" />
              <span>关联视频</span>
            </div>
            <div @click="relation('考题')" :class="!isShow ? 'left-two action' : 'left-two'">
              <!-- <img src="@assets/image/22.png" alt="" /> -->
              <img v-if="!isShow" src="@assets/image/tia.png" alt="" />
              <img v-else src="@assets/image/ti.png" alt="" />
              <span>关联考题</span>
            </div>
          </div>
        </div>
        <!-- 中间 -->
        <div class="con" v-if="isShow">
          <div class="border">
            <a-button @click="showModal">新增</a-button>
          </div>

          <div class="player">
            <div class="player-box" v-for="item in videos" :key="item.id">
              <img :src="item.thumbUrl" alt="" />
              <div class="mask">
                <img class="rid" @click="preview(item)" src="@assets/image/shipin.png" />
                <img @click="deletavidoe(item.id)" class="cha" src="@assets/image/cha.png" />
              </div>
              <div class="player-bottom">
                <p class="p-trxt" style="-webkit-box-orient: vertical">
                  {{ item.fileName }}
                </p>
                <span>时长：{{ formatSeconds(item.fileLength) }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 考题 -->
        <div v-else class="con questions">
          <div class="questions_left">
            <div class="questions_but">
              <button @click="batchs">批量添加/修改</button>
              <button @click="questionsSet(1)">添加单选</button>
              <button @click="questionsSet(2)">添加多选</button>
              <button @click="questionsSet(3)">添加判断</button>
              <button @click="questionsSet(4)">试卷设置</button>
            </div>
            <div class="questions_set">
              <div class="questions_num">
                <div>
                  单选：<span>{{ list.radio }}题</span>
                </div>
                <div>
                  多选：<span>{{ list.multipleChoice }}题</span>
                </div>
                <div>
                  判断：<span>{{ list.judge }}题</span>
                </div>
              </div>
              <div class="questions_fraction">
                <div>
                  试卷总分：<span>{{ list.testScore }}分</span>
                </div>
                <div>
                  及格分数：<span>{{ list.passMark }}分</span>
                </div>
              </div>
            </div>
          </div>
          <div class="questions_right">
            <div class="questions_box" v-for="(item, index) in questionsData" :key="item.id">
              <div class="subject">
                <div class="subject_title">
                  <span v-if="item.sign == 1">【单选】</span>
                  <span v-if="item.sign == 2">【多选】</span>
                  <span v-if="item.sign == 3">【判断】</span>
                  <span>{{ index + 1 }}.{{ item.subjectHead }}</span>
                  <!--  -->
                </div>
                <a-popconfirm title="确认要删除该是试题？" ok-text="是" cancel-text="否" @confirm="deleta(item.id)">
                  <div class="subject_delete">
                    <img src="@/assets/image/cha.png" alt="" />
                  </div>
                </a-popconfirm>
              </div>
              <div>
                <div class="option" v-for="(ele, index) in item.topicOptionChildren" :key="ele.id">
                  <div class="option_title">
                    <div
                      :class="item.sign == 2 ? 'multipleChoice option_childer' : 'singleChoice option_childer'"
                    ></div>
                    <div>{{ optionList[index] }}：{{ ele.mulChoice }}</div>
                  </div>
                </div>
              </div>
              <div class="option_but">
                <button @click="questionsSetedit(1, item)">编辑</button>
                <!-- <button @click="questionsSetedit(1, item)">设置答案解析</button> -->
                <!-- <button @click="questionsSetedit(1, item)">知识点</button> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <videoAdd ref="videoAdd" @getvideos="getViodeo"></videoAdd>
    <questionsModules ref="questionsModules" @ok="questionuSbject"></questionsModules>
    <questionsSet ref="questionsSet" @getNum="questionuSbject"></questionsSet>
    <video-popup ref="videoPopup"></video-popup>
    <!-- 视频预览 -->
    <batch ref="batch" @getlode="questionuSbject"></batch>
  </div>
</template>
    
<script>
//组件引用   cancel ModalText attributionId
import { deleteAction, getAction, putAction } from '@/api/manage' //接口方法
import { enCourse, dict } from '@/api/ajaxUrl.config.js' //接口
import uploadFiles from '@/components/uploadFiles'
import videoAdd from './modules/videoAdd'
import questionsModules from './modules/questionsModules'
import questionsSet from './modules/questionsSet'
import batch from './modules/batch'
import pick from 'lodash.pick'
import videoPopup from '@/components/videoPlayer/popup'

export default {
  components: {
    uploadFiles,
    videoAdd,
    questionsModules,
    questionsSet,
    batch,
    videoPopup,
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isShow: true,
      tolink: {},
      dataID: '', //课程ID
      chapterId: '', //章节ID
      videos: [],
      videoID: '', //视频id
      valueinpute: '', //输入框的值
      // 第二个弹窗
      showadd: false,
      title: '',
      formLayout: 'horizontal', //输入框
      attributionId: '', //图片上传
      destroyOnClose: true, //关闭弹窗销毁里面的数据
      questionsData: [], //考题
      optionList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
      vodeoUrl: '', //视频地址
      list: [], //考题数量
      spinning: false, //点击保存缓冲
      loading: false,
      loadings: false,
    }
  },
  //计算属性
  computed: {},
  created() {},
  //实例被挂载后调用
  mounted() {
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {})
  },
  //方法存放处
  methods: {
    // tab切换
    relation(value) {
      if (value == '视频') {
        this.isShow = true
      } else {
        // 考题
        this.questionuSbject()
        this.isShow = false
      }
    },
    // 时间转化
    formatSeconds(value) {
      let result = parseInt(value)
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      let m =
        Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60)
      let s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60)

      let res = ''
      res += `${h}:`
      res += `${m}:`
      res += `${s}`
      return res
    },
    // 添加考题
    questionsSet(value) {
      if (value == 1) {
        this.$refs.questionsModules.add(this.chapterId)
        // console.log(record)
        this.$refs.questionsModules.title = '添加单选'
        this.$refs.questionsModules.isType = value
      } else if (value == 2) {
        this.$refs.questionsModules.add(this.chapterId)
        this.$refs.questionsModules.title = '添加多选'
        this.$refs.questionsModules.isType = value
      } else if (value == 3) {
        this.$refs.questionsModules.add(this.chapterId)
        this.$refs.questionsModules.title = '添加判断'
        this.$refs.questionsModules.isType = value
      } else {
        this.$refs.questionsSet.add(this.chapterId)
      }
    },
    questionsSetedit(value, record) {
      // console.log(record, '获取章节id')
      record.isType = value
      if (value == 1) {
        this.$refs.questionsModules.edit(record)
        this.$refs.questionsModules.title = '编辑选项'
        // this.$refs.questionsModules.isType = value
      } else if (value == 2) {
        this.$refs.questionsModules.edit(record)
        this.$refs.questionsModules.title = '编辑多选'
        console.log(record)
        // this.$refs.questionsModules.isType = value
      } else if (value == 3) {
        this.$refs.questionsModules.edit(record)
        this.$refs.questionsModules.title = '编辑判断'
        // this.$refs.questionsModules.isType = value
      } else {
        this.$refs.questionsSet.edit(record)
      }
    },
    batchs() {
      this.$refs.batch.add(this.chapterId)
      this.$refs.batch.title = '批量添加/修改'
    },
    preview(item) {
      this.$refs.videoPopup.video(item.fileSrc) //传递 视频地址  视频封面地址
      console.log(item.fileSrc)
    },
    // 新增视频
    add(dataID, record) {
      this.videos = []
      this.dataID = dataID //课程id
      this.visible = true
      this.chapterId = record.id //章节id
      // 新增的时候把考题清除了
      this.questionsData = []
      if (this.chapterId) {
        // 如果是编辑获取章节详情，视频，考题
        this.getViodeo(this.chapterId)
        this.$nextTick(() => {
          // chapterName为返回的字段
          this.form.setFieldsValue(pick(record, 'chapterName'))
        })
      }
    },
    // 删除视频
    deletavidoe(id) {
      var params = {
        videoId: id, //视频id
      }
      // console.log(id + '编辑删除')
      deleteAction(enCourse.deleteVideo, params).then((res) => {
        // console.log(res)
        if (res.success == true) {
          this.$message.success('删除成功')
          this.getViodeo(this.chapterId)
          this.$emit('getgetbottom')
        } else {
          this.visible = false
          this.$message.warning(res.message)
        }
      })
    },
    // 点击保存
    onSbumit() {
      // validateFields设置获取表单的值  校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
      this.form.validateFields((err, values) => {
        if (!err) {
          var params = {
            fkEnCourseId: this.dataID, //课程id
            chapterName: values.chapterName, //章节名称
          }
          // 增加字段
          // 判断是否是新增或者章节
          if (this.chapterId) {
            // 编辑
            this.loadings = true
            params.id = this.chapterId
            putAction(enCourse.editChapter, params).then((res) => {
              if (res.success == true) {
                this.$message.success('保存成功--')
                this.loadings = false
                this.$emit('getgetbottom')
                // this.form.resetFields()
                this.isShow = true
              } else {
                this.loadings = false
                this.chapterId = ''
                this.$message.warning(res.message)
              }
            })
          } else {
            this.loading = true
            // 增加章节
            putAction(enCourse.addChapter, params).then((res) => {
              if (res.success == true) {
                this.chapterId = res.result
                this.$message.success('保存成功')
                this.loading = false
                this.$emit('getgetbottom')
                this.isShow = true
              } else {
                // 清空章节ID
                this.loading = false
                this.chapterId = ''
                // this.visible = false
                this.$message.warning(res.message)
              }
            })
          }
        }
      })
    },
    // 第二个弹窗
    showModal() {
      if (this.chapterId) {
        this.$refs.videoAdd.add(this.chapterId)
      } else {
        this.$message.warning('请先填写并保存章节名称')
      }
    },

    // 点击确定按钮
    handleOk() {
      this.onSbumit()
    },
    // 点击返回按钮
    handleCancel(e) {
      this.isShow = true //点击确定和返回强制下个页面为关联视频
      this.visible = false
      this.$emit('getgetbottom')
      // 清空表单的值
      this.form.resetFields()
    },
    // 关联考题
    questionuSbject() {
      // validateFields设置获取表单的值  校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
      this.form.validateFields((err, values) => {
        if (!err) {
          var params = {
            chapterId: this.chapterId, //章节id
          }
          getAction(enCourse.getTopic, params).then((res) => {
            // console.log(res)
            if (res.success == true) {
              this.questionsData = res.result
              this.loadnum()
              // this.loadtop()
              this.$emit('ok')
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    // 获取考题数量 底部
    loadnum() {
      // console.log(data)
      var params = {
        chapterId: this.chapterId,
      }
      getAction(enCourse.sendTestData, params).then((res) => {
        if (res.success == true) {
          this.list = res.result
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 删除考题
    deleta(id) {
      // console.log(id)
      var params = {
        topicId: id,
      }
      getAction(enCourse.deleteTopic, params).then((res) => {
        if (res.success == true) {
          this.$message.success('删除成功')
          this.questionuSbject()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 根据章节获取视频
    getViodeo(id) {
      var params = {
        chapterId: this.chapterId,
      }
      getAction(enCourse.videoByChapterId, params).then((res) => {
        if (res.success == true) {
          this.videos = res.result
          this.vodeoUrl = res.result[0].fileSrc
          this.disabled = 2
          // console.log(this.vodeoUrl)
        } else {
          this.videos = []
          this.$message.warning(res.message)
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.conter {
  overflow: hidden;
  .top {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 70px;
    .top-right {
      display: flex;
      .button {
        margin: 5px;
      }
    }
    .top-left {
      // height: 60px;
      display: flex;
      div {
        cursor: pointer;
      }
      .action {
        color: #23b8ff;
      }
      .left-one {
        font-size: 18px;
        margin-right: 20px;
        img {
          width: 28px;
          height: 28px;
        }
        span {
          margin-left: 2px;
          margin-top: 3px;
          vertical-align: middle;
        }
      }
      .left-two {
        font-size: 18px;
        img {
          width: 22px;
          height: 22px;
        }
        span {
          margin-left: 5px;
          vertical-align: middle;
        }
      }
    }
  }
  .con {
    width: 1239px;
    height: calc(100vh - 350px);
    margin: 0 auto;
    border: 1px solid #e5e6e7;
    border-radius: 5px;
    .border {
      border-bottom: 1px solid #e5e6e7;
    }
    button {
      margin: 15px 21px;
      width: 94px;
      height: 40px;
      border: 1px solid #23b8ff;
      font-size: 20px;
      color: #23b8ff;
      // border-radius: 5px;
    }
    .player {
      display: flex;
      flex-wrap: wrap;
      overflow-y: scroll;
      padding: 20px;
      height: calc(100vh - 420px);
      // justify-content: space-around;
      .player-box {
        width: 225px;
        height: 240px;

        margin-right: 15px;
        margin-bottom: 15px;
        position: relative;

        &:hover .mask {
          display: block;
        }

        .mask {
          width: 225px;
          height: 142px;
          margin: auto;
          position: absolute;
          top: 0;
          right: 0;
          display: none;
          background-color: rgba(0, 0, 0, 0.7);
          transition: width 2s;
          transition-timing-function: linear;
          transition-delay: 1s;
          .cha {
            width: 30px;
            height: 30px;
            position: absolute;
            top: -15px;
            right: -15px;
            cursor: pointer;
          }
          .rid {
            display: block;
            width: 62px;
            height: 62px;
            margin: 37px auto;
          }
        }

        img {
          width: 100%;
          height: 142px;
          overflow: hidden;
        }
        .player-bottom {
          padding: 8px;
          display: flex;
          height: 100px;
          flex-direction: column;
          justify-content: space-between;
          font-size: 15px;
          border-left: 1px solid #e5e6e7;
          border-right: 1px solid #e5e6e7;
          border-bottom: 1px solid #e5e6e7;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          .p-trxt {
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
          }
          span {
            margin-top: 20px;
          }
        }
      }
    }
  }
  .questions {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .questions_left {
      width: 14%;
      height: 100%;
      border: 1px solid #e5e6e7;
      border-radius: 5px;
      box-sizing: border-box;
      padding: 20px 17px;
      display: flex;
      overflow: auto;
      flex-direction: column;
      justify-content: space-between;
      .questions_but {
        button {
          width: 100%;
          cursor: pointer;
          height: 30px;
          font-size: 15px;
          font-weight: 600;
          color: #333333;
          margin: 0 0 10px 0;
          background: #f8f8f8;
          border: 1px dashed #e5e6e7;
          border-radius: 5px;
          outline: none;
        }
      }
      .questions_set {
        background: #f8f8f8;
        border: 1px dashed #e5e6e7;
        border-radius: 5px;
        padding: 20px 0;
        color: #333333;
        font-weight: 600;
        .questions_num {
          border-bottom: 1px solid #e5e6e7;
          div {
            text-align: center;
            margin-bottom: 10px;
          }
          div:nth-child(1) span {
            color: #23b8ff;
          }
          div:nth-child(2) span {
            color: #fd7352;
          }
          div:nth-child(3) span {
            color: #23b8ff;
          }
        }
        .questions_fraction {
          padding-top: 15px;
          div {
            margin-bottom: 5px;
            text-align: center;
          }
          div:nth-child(2) {
            margin-bottom: 0px;
          }
        }
      }
    }
    .questions_right {
      width: 84.5%;
      height: 100%;
      overflow: auto;
      border-radius: 5px;
      box-sizing: border-box;
      .questions_box {
        padding: 14px;
        margin-bottom: 10px;
        border: 1px solid #e5e6e7;
        border-radius: 5px;
        .subject {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8f8f8;
          border-radius: 5px;
          border: 1px dashed #dcdcdc;
          margin-bottom: 15px;
          position: relative;
          .subject_title {
            padding: 20px 15px;
            span {
              font-weight: 600;
            }
            span:nth-child(1) {
              color: #23b8ff;
            }
          }
          .subject_delete {
            position: absolute;
            cursor: pointer;
            top: -11px;
            right: -11px;
            img {
              width: 22px;
              height: 22px;
            }
          }
        }
        .subject:last-child {
          margin-bottom: 0;
        }
        .option {
          background: #f8f8f8;
          border-radius: 5px;
          border: 1px dashed #dcdcdc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          margin-bottom: 10px;
          .option_title {
            display: flex;
            align-items: center;
            .option_childer {
              width: 20px;
              margin-right: 5px;
              height: 20px;
              border: 1px solid #e5e6e7;
              background: #fff;
            }
            .multipleChoice {
              border-radius: 4px;
            }
            .singleChoice {
              border-radius: 50%;
            }
          }
          .option_del {
            cursor: pointer;
            img {
              width: 20px;
              height: 20px;
            }
          }
        }
        // .option:last-child{
        //   margin-bottom: 0;
        // }
        .option_but {
          button {
            margin: 0 15px 0 0;
            width: unset;
            height: unset;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            border-radius: 5px;
            border: unset;
            outline: none;
          }
          button:nth-child(1) {
            background: #e1f0ff;
            color: #23b8ff;
          }
          button:nth-child(2) {
            background: #fde4df;
            color: #fd7352;
          }
          button:nth-child(3) {
            background: #cbf1ef;
            color: #1bc5bd;
          }
        }
      }
      .questions_box:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.box {
  .box-img {
    width: 90px;
    height: 90px;
    // border: 1px solid #ccc;
  }
}
.player-box:nth-child(5n) {
  margin-right: 0 !important;
}
/deep/ .ant-form-item {
  margin-bottom: 15px;
}
</style>