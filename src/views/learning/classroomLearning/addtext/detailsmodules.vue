<template>
  <div>
    <a-modal
      title="章节考试（课程名称-章节名称）"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      width="1300px"
      :footer="null"
    >
      <div class="con">
        <div class="left">
          <div class="top-box">
            <div class="subject">
              <img src="@assets/image/1.png" alt="" />
              <span>题目</span>
            </div>
            <div
              v-for="item in colors"
              :key="item.id"
              :class="fnState == item.id ? 'colState cursor' : 'cursor'"
              @click="onsteta(item.id)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="bottom-box">
            <p>单选：<span class="single">3/5</span></p>
            <p>多选: <span class="choice">7/8</span></p>
            <p>判断: <span class="judge">2/5</span></p>
          </div>
        </div>

        <div class="conter">
          <div class="box">
            <div class="right">
              <div class="text-top">
                <p>
                  <span class="title" style="color: #23b8ff">【单选】</span>
                  <span
                    >1. 题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题
                    目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目。</span
                  >
                </p>
                <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-form-item>
                    <a-radio-group name="radioGroup" :default-value="1">
                      <a-row>
                        <a-col :span="24">
                          <a-radio :value="1"> A：答案A答案A答案A答案A答案A答案A答案A </a-radio>
                        </a-col>
                        <a-col :span="24"> <a-radio :value="2"> B：答案B答案B答案B答案B答案B答案B答案B</a-radio></a-col>
                        <a-col :span="24"><a-radio :value="3"> C：答案C答案C答案C答案C答案C答案C答案C</a-radio></a-col>
                        <a-col :span="24"> <a-radio :value="4"> D：答案D答案D答案D答案D答案D答案D答案D</a-radio></a-col>
                      </a-row>
                    </a-radio-group>
                  </a-form-item>
                </a-form>
                <div class="text-bottom">
                  <p>正确答案：<span style="color: #23b8ff; font-size: 22px">A</span></p>
                  <p>答案解析：答案解析答案解析答案解析答案解析答案解析答案解析答案解析</p>
                  <p>知识点：知识点知识点知识点知识点知识点知识点知识点</p>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="text-top">
                <p>
                  <span class="titles" style="color: #fd7352">【多选】</span>
                  <span
                    >1. 题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题
                    目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目。</span
                  >
                </p>
                <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-form-item>
                    <a-checkbox-group @change="onChange">
                      <a-row>
                        <a-col :span="24" class="more">
                          <a-checkbox value="A"> A：答案A答案A答案A答案A答案A答案A答案A </a-checkbox>
                        </a-col>
                        <a-col :span="24" class="more">
                          <a-checkbox value="B"> B：答案B答案B答案B答案B答案B答案B答案B </a-checkbox>
                        </a-col>
                        <a-col :span="24" class="more">
                          <a-checkbox value="C"> C：答案C答案C答案C答案C答案C答案C答案C </a-checkbox>
                        </a-col>
                        <a-col :span="24" class="more">
                          <a-checkbox value="D"> D：答案D答案D答案D答案D答案D答案D答案D </a-checkbox>
                        </a-col>
                        <a-col :span="24" class="more">
                          <a-checkbox value="E"> E：答案E答案E答案E答案E答案E答案E答案E </a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkbox-group>
                  </a-form-item>
                </a-form>
                <div class="text-bottom">
                  <p>正确答案：<span style="color: #23b8ff; font-size: 22px">A</span></p>
                  <p>答案解析：答案解析答案解析答案解析答案解析答案解析答案解析答案解析</p>
                  <p>知识点：知识点知识点知识点知识点知识点知识点知识点</p>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="text-top">
                <p>
                  <span class="judge" style="color: #27c3bc">【判断】</span>
                  <span
                    >1. 题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题
                    目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目题目。</span
                  >
                </p>
                <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                  <a-form-item>
                    <a-radio-group name="radioGroup" :default-value="1">
                      <a-row>
                        <a-col :span="24">
                          <a-radio :value="1"> 对 </a-radio>
                        </a-col>
                        <a-col :span="24"> <a-radio :value="2"> 错 </a-radio></a-col>
                      </a-row>
                    </a-radio-group>
                  </a-form-item>
                </a-form>
                <div class="text-bottom">
                  <p>正确答案：<span style="color: #23b8ff; font-size: 22px">对</span></p>
                  <p>答案解析：答案解析答案解析答案解析答案解析答案解析答案解析答案解析</p>
                  <p>知识点：知识点知识点知识点知识点知识点知识点知识点</p>
                </div>
              </div>
            </div>
          </div>
          <div class="right-botton">
            <div class="right-box">
              <a-button type="primary" @click="referring"> 确定 </a-button>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      fnState: '',
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      colors: [
        { id: '111', name: '1~5' },
        { id: '222', name: '6~10' },
        { id: '333', name: '11~15' },
      ],
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    referring() {
      this.visible = false
    },
    handleCancel(e) {
      this.visible = false
    },
    add() {
      this.visible = true
    },
    onsteta(id) {
      this.fnState = id
    },
    onChange(checkedValues) {
      console.log('checked = ', checkedValues)
    },
  },
}
</script>
<style lang="scss" scoped>
// confirmLoading form  handleSubmit
.con {
  width: 1237px;
  display: flex;
  justify-content: space-between;
  .left {
    width: 159px;
    border: 1px #e5e6e7 solid;
    margin-right: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .top-box {
      width: 100%;
      height: 51px;
      line-height: 51px;
      text-align: center;
      font-size: 16px;
      // margin-top: 13px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      // cursor: pointer;
      .subject {
        background: #f8f8f8;
        margin-bottom: 10px;
      }
      .cursor {
        cursor: pointer;
      }
      img {
        width: 20px;
        height: 21px;
      }
      span {
        margin-left: 5px;
        // font-size: 22px;
        vertical-align: middle;
      }
    }
    .colState {
      background: #e1f0ff;
      border-left: 2px solid #21b5fb;
    }
    .bottom-box {
      margin: 21px 17px;
      width: 125px;
      height: 159px;
      background: #f8f8f8;
      border: 1px solid #e5e6e7;
      border-radius: 5px;
      p {
        margin-top: 17px;
        text-align: center;
        font-size: 19px;
        .single {
          color: #23b8ff;
        }
        .choice {
          color: #fd7352;
        }
        .judge {
          color: #27c3bc;
        }
      }
    }
  }
  .conter {
    border: 1px solid #e5e6e7;
    position: relative;
    .box {
      margin: 20px;
      height: calc(100vh - 300px);
      overflow: auto;
      padding-bottom: 50px;
      .right {
        width: 1019px;
        // height: 230px;
        padding: 10px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        border: 1px solid #e5e6e7;
        border-radius: 10px;
        font-size: 18px;
        font-weight: 600;
        color: #333333;
        .more {
          margin-bottom: 30px;
        }
        .text-bottom {
          font-size: 15px;
          padding: 10px;
          width: 100%;
          background: #f8f8f8;
          border: 1px solid #dcdcdc;
          border-radius: 5px;
          font-weight: 500;
        }
      }
    }
    .right-botton {
      width: 100%;
      height: 62px;
      display: flex;
      background: #f8f8f8;
      border-radius: 0px 0px 5px 5px;
      position: absolute;
      left: 0;
      bottom: 0;
      .right-box {
        position: absolute;
        top: 0;
        right: 0;
        button {
          width: 80px;
          height: 40px;
          margin: 12px 20px;
        }
      }
    }
  }
}
</style>