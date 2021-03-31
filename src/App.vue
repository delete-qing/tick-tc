<template>
  <a-locale-provider :locale="locale">
    <div id="app" :class="Home">
      <router-view />
    </div>
  </a-locale-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import enquireScreen from '@/utils/device'

export default {
  data() {
    return {
      locale: zhCN,
      Home: 'homepage',
    }
  },
  created() {
    let that = this
    enquireScreen((deviceType) => {
      // tablet1
      if (deviceType === 0) {
        that.$store.commit('TOGGLE_DEVICE', 'mobile')
        that.$store.dispatch('setSidebar', false)
      }
      // mobile
      else if (deviceType === 1) {
        that.$store.commit('TOGGLE_DEVICE', 'mobile')
        that.$store.dispatch('setSidebar', false)
      } else {
        that.$store.commit('TOGGLE_DEVICE', 'desktop')
        that.$store.dispatch('setSidebar', true)
      }
    })
  },
}
</script>
<style lang="scss">
@media screen and (max-width: 1920px) {
  /*当屏幕尺寸小于600px时，应用下面的CSS样式*/
  html,
  body {
    font-size: 16px;
  }
}
@media screen and (max-width: 1366px) {
  /*当屏幕尺寸小于600px时，应用下面的CSS样式*/
  html,
  body {
    font-size: 10px;
  }
}
#app {
  height: 100%;
}
body::-webkit-scrollbar {
  display: none;
}
body::-moz-scrollbar {
  display: none;
}
body:-moz-scrollbar {
  display: none;
}
body:-ms-body-scrollbar {
  display: none;
}
.nav {
  .ant-modal {
    overflow: hidden;
    .ant-modal-body {
      height: calc(100vh - 190px);
      overflow: auto;
    }
  }
}
.navs {
  .ant-modal {
    overflow: hidden;
    .ant-modal-body {
      height: calc(100vh - 358px);
      overflow: auto;
    }
  }
}
.video {
  .ant-modal {
    overflow: hidden;
    .ant-modal-close {
      color: #999999;
    }
    .ant-modal-body {
      padding: 0px;
    }
  }
}

.login {
  .ant-modal-title {
    font-weight: 600 !important;
    color: #333333;
  }
}
.result {
  .ant-form-item {
    margin-bottom: 0px !important;
  }
}
.ment-poot {
  .ant-form-item {
    margin-bottom: 0px !important;
  }
}
.clearfix:before,
.clearfix:after {
  /* 清除浮动 */
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1;
}
/* 登录样式  开始 */
.tick-input {
  width: 383px !important;
  height: 66px;
  background: url('./assets/input_bg.png') !important;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
  // border: 0px !important;
  background-color: rgba(255, 255, 255, 0.13) !important;
  border-radius: 10px !important;
  .ant-input {
    background: transparent !important;
    border: 0px !important;
    border-radius: 10px !important;
    color: rgba(153, 153, 153, 1);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 2px;
  }
  .ant-input:focus {
    box-shadow: 0 0 0 !important;
  }
  .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 18px !important;
  }
}
.tick-login-button {
  position: absolute !important;
  top: 0px !important;
  right: 10px !important;
  width: 32px !important;
  height: 22px !important;
  border: 0px !important;
  background: url('./assets/image/go.png') !important;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
}
/* 登录样式  结束 */
/* 跑马灯样式 开始 */
.ant-carousel .slick-track .slick-slide {
  transition: opacity 600ms linear 0s, visibility 600ms linear 0s !important;
}
.ant-carousel,
.slick-slider,
.slick-list {
  height: 100% !important;
}
/* 跑马灯样式 结束 */
/* 头部搜索框样式 开始 */
.topSearch {
  .ant-input {
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    font-size: 16px;
  }
  .ant-input-suffix {
    height: 100%;
    .ant-btn {
      width: 79px;
      height: 100%;
      border-radius: 10px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      .anticon-search {
        font-size: 21px !important;
      }
    }
  }
}
// 表格改变样式
#Revolution {
  .ant-table-thead > tr > th {
    background: #beeaff;
    font-size: 17px;
    color: #333333;
  }
  tr:nth-child(even) {
    background: #eefaff;
  }
  .ant-btn ant-btn-primary {
    color: #fff;
  }
}
// #learning {
//   .ant-progress-text {
//     color: #fd7352;
//   }
//   .anticon svg {
//     color: #21b5fb;
//     margin-left: 7px;
//   }
// }
/* 头部搜索框样式 结束 */
/* 折叠面板样式 start */
.tick-collapse {
  margin-top: 20px !important;
  .ant-collapse-item > .ant-collapse-header {
    height: 60px !important;
    padding: 0 !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .top-left {
      display: flex;
      align-items: center;
      .order-left {
        width: 30px;
        height: 30px;
        margin: 0px 15px;
        color: #23b8ff;
        border: 2px #23b8ff solid;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          height: 30px;
          width: 30px;
          margin: 5px;
          line-height: 30px;
          text-align: center;
        }
      }
      .order-title {
        p {
          text-align: center;
          margin: 0px;
          font-weight: 500;
          color: #333333;
          font-size: 18px;
        }
      }
    }
    .top-right {
      img {
        width: 22px;
        height: 22px;
        margin-right: 15px;
      }
    }
  }
  .ant-collapse-content {
    .ant-collapse-content-box {
      padding: 0px 0px 20px 0px !important;
    }
  }
}
#pageset {
  .ant-calendar-picker {
    width: 485px;
  }
  .ant-select-selection--single {
    width: 485px;
  }
}

/* 折叠面板样式 end */

.layout .header {
  height: 64px;
}
</style>
