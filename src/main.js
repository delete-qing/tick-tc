import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import router from './router'
import store from './store/'
import SSO from '@/cas/sso.js'
import { VueAxios } from "@/utils/request"

import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less'; // or 'ant-design-vue/dist/antd.less'

import '@/permission' // permission control
import '@/utils/filter' // base filter
import Print from 'vue-print-nb-jeecg'
/*import '@babel/polyfill'*/
import VueApexCharts from 'vue-apexcharts'

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import "@jeecg/antd-onine"
import '@jeecg/antd-onine/dist/OnlineForm.css'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);


Vue.use(Viewer);
Viewer.setDefaults({
    Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});

import VideoPlayer from 'vue-video-player'
require('vue-video-player/src/custom-theme.css')
require('video.js/dist/video-js.min.css')
    // require('video.js/dist/lang/zh-CN.js')
    // import 'video.js/dist/lang/zh-CN.js'
Vue.use(VideoPlayer)

import {
    ACCESS_TOKEN,
    DEFAULT_COLOR,
    DEFAULT_THEME,
    DEFAULT_LAYOUT_MODE,
    DEFAULT_COLOR_WEAK,
    SIDEBAR_TYPE,
    DEFAULT_FIXED_HEADER,
    DEFAULT_FIXED_HEADER_HIDDEN,
    DEFAULT_FIXED_SIDEMENU,
    DEFAULT_CONTENT_WIDTH_TYPE,
    DEFAULT_MULTI_PAGE
} from "@/store/mutation-types"
import config from '@/defaultSettings'

import JDictSelectTag from './components/dict/index.js'
import hasPermission from '@/utils/hasPermission'
import vueBus from '@/utils/vueBus';
import JeecgComponents from '@/components/jeecg/index'


//高德
import VueAMap from 'vue-amap';

//高德
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
    key: '0c3b5aa083f840f9e7068e3e2456b0f3',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
    v: '1.4.4'
});

//导航高度 tab margin
Vue.prototype.navHeight = 46
Vue.prototype.tabHeight = 39
Vue.prototype.layoutMTop = 12


// 使 Mock 生效
import './mock/'
//使自定义全局指令生效
import '@/utils/TickDirective.js'

Vue.config.productionTip = false
Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(Viser)
Vue.use(hasPermission)
Vue.use(JDictSelectTag)
Vue.use(Print)
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.use(preview)
Vue.use(vueBus);
Vue.use(JeecgComponents);

new Vue({
        router,
        store,
        mounted() {
            store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
            store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
            store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
            store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
            store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
            store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
            store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
            store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
            store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
            store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
            store.commit('SET_MULTI_PAGE', Vue.ls.get(DEFAULT_MULTI_PAGE, true))
        },
        render: h => h(App)
    }).$mount('#app')
    // SSO.init(() => {
    //   main();
    // });
    // function main() {
    //   new Vue({
    //     router,
    //     store,
    //     mounted () {
    //       store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
    //       store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
    //       store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
    //       store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
    //       store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
    //       store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
    //       store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
    //       store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
    //       store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
    //       store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
    //       store.commit('SET_MULTI_PAGE',Vue.ls.get(DEFAULT_MULTI_PAGE,true))
    //     },
    //     render: h => h(App)
    //   }).$mount('#app')
    // }