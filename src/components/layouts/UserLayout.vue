<template>
  <div class="liatUser" id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <div class="container_header">
        <div class="header_div">
          <div>
            <img src="../../assets/image/logo.png" alt />
            <span class="systermText">晋中教师课堂</span>
          </div>
        </div>
        <div class="headr_tick">
          <!-- <img src="../../assets/image/logo.png" alt /> -->
        </div>
      </div>
      <div class="container_main">
        <!-- <a-icon type="notification"/> -->
        <!-- <a-alert message="系统公告：系统将于4月29日12时至14时例行维护" banner closable :showIcon="true" /> -->
        <!-- 系统公告：系统将于4月5日12时至14时例行维护 -->
      </div>
      <div class="container_div">
        <div class="top">
          <!-- <div class="header">
            <span class="title">用户登录</span>
          </div> -->
          <div class="userPicBg">
            <div class="userBigPic"></div>
          </div>
        </div>
        <route-view></route-view>
      </div>
      <div class="footer">
        <!-- <div class="links">
          <a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>
        </div>-->
        <div class="copyright">
          <span></span>
        </div>
        <div class="tickName">
          <span>郑州铁拓自动化设备有限公司 Copyright 2020 TICK. ALL Rights Reserved</span>
        </div>
      </div>
      <!-- <img class="loginBack" src="../../views/img/登录.png" alt=""> -->
    </div>
  </div>
</template>

<script>
import RouteView from '@/components/layouts/RouteView'
import { mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data() {
    return {
      img: require('@/assets/logo.png'),
      sysName: this.sysConfig.sysName,
    }
  },
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  },
}
</script>

<style lang="scss" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        width: 100%;
      }
    }
  }
  .container {
    width: 100%;
    min-height: 100%;
    background: #294f6f;
    background: url('./bg1.png');
    background-size: cover;
    position: relative;
    a {
      text-decoration: none;
    }
    .container_main {
      position: absolute;
      width: 100%;
      height: 40px;
      top: 60px;
      color: #fff;
    }
    .container_header {
      background-image: url('./title_max.png');
      background-color: #333;
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      width: 100%;
      top: 0;
      height: 64px;
      padding: 0 34px 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header_div {
        color: #fff;
        font-size: 14px;
        padding-left: 12px;
        span {
          vertical-align: middle;
          line-height: 70px;
          font-weight: 600;
        }
        div:nth-child(1) {
          float: left;
          img {
            width: 60px;
            height: 28px;
            margin-top: -6px;
          }
        }
        div:nth-child(2) {
          float: right;
          img {
            width: 60px;
            height: 30px;
            margin-right: 10px;
          }
        }
        .systermText {
          height: 100%;
          font-size: 17px;
          margin-bottom: 0 !important;
          line-height: 40px;
          margin-left: 14px;
          font-size: 20px;
          font-family: 'PingFang SC';
          font-weight: bold;
          color: rgba(224, 224, 224, 1);
        }
      }
      .headr_tick {
        display: flex;
        align-items: center;
        height: 100%;
        .tickAuto {
          font-size: 20px;
          color: #fff;
          margin-left: 15px;
          font-weight: 600;
          height: 100%;
          line-height: 63px;
        }
      }
    }
    //  @media screen and (min-width:1920px){
    //   .container_div{
    //       width: 21%;
    //       height: 46%;
    //       position: absolute;
    //       right: 8%;
    //       top: 29%;
    //       background: #FFF;
    //       padding: 50px 40px 70px 40px;
    //       border-radius: 5px;
    //       .header{
    //         height: 40px;
    //         line-height: 40px;
    //         margin-bottom: 15%;
    //       }
    //       .title {
    //         font-size: 28px;
    //         color: rgba(0, 0, 0, .85);
    //         font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    //         font-weight: 600;
    //       }
    //   }
    // }
    //(max-width:1920px) and
    // @media screen and (min-width: 1365px) {
    //   .container_div {
    //     width: 400px;
    //     height: 460px;
    //     position: absolute;
    //     right: 8%;
    //     top: 29%;
    //     background: #fff;
    //     padding: 50px 40px 70px 40px;
    //     border-radius: 5px;
    //     .header {
    //       height: 40px;
    //       line-height: 40px;
    //       margin-bottom: 15%;
    //     }
    //     .title {
    //       font-size: 28px;
    //       color: rgba(0, 0, 0, 0.85);
    //       font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont,
    //         'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    //         'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    //         'Segoe UI Emoji', 'Segoe UI Symbol';
    //       font-weight: 600;
    //     }
    //   }
    // }
    // @media screen and (max-width: 1366px) and (min-width: 0px) {
    //   .container_div {
    //     width: 287px;
    //     height: 328px;
    //     position: absolute;
    //     right: 8%;
    //     top: 28%;
    //     background: #fff;
    //     padding: 18px 26px;
    //     border-radius: 5px;
    //     .header {
    //       height: 40px;
    //       line-height: 40px;
    //       margin-bottom: 10%;
    //     }
    //     .title {
    //       font-size: 22px;
    //       color: rgba(0, 0, 0, 0.85);
    //       font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont,
    //         'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    //         'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    //         'Segoe UI Emoji', 'Segoe UI Symbol';
    //       font-weight: 600;
    //     }
    //   }
    // }
    .container_div {
      // width: 287px;
      // height: 328px;
      position: absolute;
      top: 22%;
      left: 50%;
      transform: translate(-50%, 0%);
      // background: rgba(255,255,255,0.1);
      // padding: 18px 26px;
      // border-radius: 5px;
      .login-button {
        margin-bottom: 10px;
      }
      .header {
        height: 40px;
        line-height: 40px;
        margin-bottom: 10%;
      }
      .title {
        font-size: 22px;
        color: rgba(255, 255, 255, 1);
        font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
          'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
          'Segoe UI Symbol';
        font-weight: 600;
      }
    }
    .top {
      text-align: center;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 50px;
      .badge {
        position: absolute;
        display: inline-block;
        line-height: 1;
        vertical-align: middle;
        margin-left: -12px;
        margin-top: -10px;
        opacity: 0.8;
      }

      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
        border-style: none;
      }

      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0);
        margin-top: 12px;
        margin-bottom: 40px;
      }
      .userPicBg {
        background: url('./img/pic_bg.png') no-repeat;
        background-size: cover;
        /*padding: 29px 29px 30px 29px;*/
        display: flex;
        justify-content: center;
        align-items: center;
        width: 168px;
        height: 168px;
        margin-bottom: 0.14rem;
      }
      .userBigPic {
        margin: 0 auto;
        width: 104px;
        height: 104px;
        background: url('./img/user-logo.png') no-repeat;
        background-size: cover;
        border-radius: 55px;
        border: 1px solid #fff;
      }
    }

    .footer {
      position: absolute;
      width: 100%;
      height: 60px;
      bottom: 0;
      text-align: center;
      // background: rgba(0, 0, 0, 0.65);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .links {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
      .copyright {
        color: #fff;
        font-size: 16px;
        display: flex;
        justify-content: center;
        z-index: 1000;
        span {
          display: block;
        }
      }
      .tickName {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        display: flex;
        justify-content: center;
        z-index: 1000;
      }
    }
    .loginBack {
      width: 100%;
      height: 100%;
    }
  }
}
</style>