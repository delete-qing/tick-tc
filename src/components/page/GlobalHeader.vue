<template>
  <!-- , width: fixedHeader ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'  -->
  <div>
    <a-layout-header
      v-if="!headerBarFixed"
      :class="[
        fixedHeader && 'ant-header-fixedHeader',
        sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed',
      ]"
      :style="{ padding: '0' }"
      style="background: #2c3136"
    >
      <!-- <div v-if="mode === 'sidemenu'" class="header">
        <user-menu></user-menu>
      </div> v-else -->
      <div :class="['top-nav-header-index', theme]">
        <div class="header-index-wide" style="height: 46px">
          <div class="header-index-left" :style="topMenuStyle.headerIndexLeft">
            <!-- <a-icon type="menu-unfold" :style="{ fontSize: '24px', color: '#1296db' }"/> -->

            <!-- <logo class="top-nav-header" style="width:120px;"/>
            <a-divider type="vertical" style="height: 28px; top: 0.65em;" /> -->
            <!-- v-if="device !== 'mobile'" -->
            <s-menu mode="horizontal" :menu="menus" :theme="theme" :style="topMenuStyle.topSmenuStyle"></s-menu>
            <!-- <a-icon
              v-else
              class="trigger"
              :type="collapsed ? 'menu-fold' : 'menu-unfold'"
              @click.native="toggle"
            ></a-icon> -->
          </div>
          <!-- <user-menu class="header-index-right" :style="topMenuStyle.headerIndexRight"></user-menu> -->
        </div>
      </div>
    </a-layout-header>
  </div>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../menu/'
import Logo from '../tools/Logo'

import { mixin } from '@/utils/mixin.js'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu,
    Logo,
  },
  props: {
    title: {
      type: String,
      default: '',
      required: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      default: 'topmenu',
      // default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: 'dark',
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    device: {
      type: String,
      required: false,
      default: 'desktop',
    },
  },
  data() {
    return {
      headerBarFixed: false,
      img: require('@/assets/logo.png'),
      topMenuStyle: {
        headerIndexLeft: {},
        topNavHeader: {},
        headerIndexRight: {},
        topSmenuStyle: {},
      },
    }
  },
  watch: {
    /** 监听设备变化 */
    device() {
      if (this.mode === 'topmenu') {
        this.buildTopMenuStyle()
      }
    },
    /** 监听导航栏模式变化 */
    mode(newVal) {
      if (newVal === 'topmenu') {
        this.buildTopMenuStyle()
      }
    },
  },
  mounted() {
    console.log('this.menus', this.menus)
    // document.getElementById('real').addEventListener('scroll', this.handleScroll)
    // window.addEventListener('scroll', this.handleScroll)
    // console.log(this.collapsed)

    if (this.mode === 'topmenu') {
      this.buildTopMenuStyle()
    }
  },
  methods: {
    handleScroll() {
      if (this.autoHideHeader) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > 100) {
          this.headerBarFixed = true
        } else {
          this.headerBarFixed = false
        }
      } else {
        this.headerBarFixed = false
      }
    },
    toggle() {
      console.log(this.$emit())
      // this.$emit('toggle')
    },
    buildTopMenuStyle() {
      console.log(this.mode, this.device)
      if (this.mode === 'topmenu') {
        // if (this.device === 'mobile') {
        //   // 手机端需要清空样式，否则显示会错乱
        //   this.topMenuStyle.topNavHeader = {}
        //   this.topMenuStyle.topSmenuStyle = {}
        //   this.topMenuStyle.headerIndexRight = {}
        //   this.topMenuStyle.headerIndexLeft = {}
        // } else {
        let rightWidth = '120px'
        this.topMenuStyle.topNavHeader = { 'min-width': '120px' }
        this.topMenuStyle.topSmenuStyle = { width: 'calc(100% - 120px)' }
        this.topMenuStyle.headerIndexRight = { 'min-width': rightWidth }
        this.topMenuStyle.headerIndexLeft = {
          width: `calc(100% - ${rightWidth})`,
        }
        // }
      }
    },
    //update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
  },
}
</script>

<style lang="scss" scoped>
/* update_begin author:scott date:20190220 for: 缩小首页布局顶部的高度*/
.layout .top-nav-header-index .header-index-wide {
  margin-left: 20px;
}
.layout .header {
  height: 46px;
  padding-left: 450px;
  border-bottom: 1px solid #eee;
  background: #131c29;
}
.ant-layout-header {
  height: 46px;
  line-height: 46px;
}
.layout .top-nav-header-index .header-index-wide .ant-menu.ant-menu-horizontal {
  height: 46px;
  line-height: 46px;
  color: rgba(255, 255, 255, 0.9);
}
/* update_end author:scott date:20190220 for: 缩小首页布局顶部的高度*/
// .keep {
//   height: 59px;
//   position: absolute;
//   top: 0px;
//   left: 0px;
//   color: #fff;
//   z-index: 877;
// }
</style>
