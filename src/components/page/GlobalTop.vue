<template>
  <div class="globalTop">
    <div class="globalCenter">
      <div class="globalTopLeft">
        <div class="globalTopLogo">
          <router-link :to="{ path: '/homePage/index' }" class="globalTopTo">
            <img :src="tabstwo.systemLogo.value" alt="logo" />
          </router-link>
          <span class="TopTitle">{{ tabstwo.systemName.value }}</span>
        </div>
        <div class="globalTopSort">
          <a-dropdown>
            <span class="ant-dropdown-link">
              <img :src="imgSort" alt="logo" />
              <span class="TopSpan" @click="(e) => e.preventDefault()">分类</span>
            </span>
            <a-menu slot="overlay" @select="details">
              <a-menu-item v-for="item in datas" :key="item.id">
                <router-link :to="{ path: '/Revolution/index', query: { id: item.id } }" class="globalTopTo">
                  <a style="color: #8c8e8c" href="javascript:;">{{ item.name }}</a>
                </router-link>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
      <div class="globalTopRight">
        <div class="globalTopSearch">
          <a-input-search
            v-decorator="['name', {}]"
            class="topSearch"
            placeholder="搜索课程"
            enter-button
            style="height: 100%; width: 100%"
            @search="onSearch"
          />
        </div>
        <div class="globalTopHead">
          <user-menu :menus="menus" class="header-index-right"></user-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import UserMenu from '../tools/UserMenu'
import { deleteAction, getAction } from '@/api/manage' //接口方法
import { enCourse, dict, dictSysConfig } from '@/api/ajaxUrl.config.js' //接口
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  components: {
    UserMenu,
  },
  props: {
    menus: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      img: require('@/assets/image/logo.png'),
      imgSort: require('@/assets/image/sort.png'),
      datas: [],
      loginShow: false,
      tabstwo: {
        systemLogo: { value: '' },
        systemName: { value: '' },
      },
    }
  },
  mounted() {
    // console.log('this.menusaaa', this.menus)
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.tabstwo = IndexObj()
    if (token != null) {
      // 已登录
      this.loginShow = true
      this.details()
    } else {
      // 未登录
      this.loginShow = false
    }
  },
  methods: {
    details() {
      // 查询分类  要用到字典表
      getAction(dict.findDictForSelect, { tableName: 'dict_common_subject' }).then((res) => {
        this.datas = res.result
      })
    },
    onSearch(value) {
      var parmas = value
      if (this.loginShow) {
        // replace  不可后退
        // push可回退
        this.$router.push({ name: 'Revolution-index', query: { name: parmas } })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.globalTop {
  background-color: #ffffff;
  background-repeat: no-repeat;
  background-size: cover;
  height: 79px;
  z-index: 999;
  box-shadow: 0px 0px 13px 0px rgba(136, 136, 136, 0.51);
  .globalCenter {
    margin: 0 auto;
    position: relative;
    max-width: 1300px;
    min-width: 1000px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .globalTopLeft {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .globalTopLogo {
        display: flex;
        align-items: center;
        background-size: contain;
        .globalTopTo {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        img {
          width: 55px;
        }
        .TopTitle {
          font-size: 28px;
          color: #333333;
          margin-left: 18px;
        }
      }
      .globalTopSort {
        display: flex;
        align-items: center;
        background-size: contain;
        margin-left: 85px;
        img {
          width: 27px;
        }
        .TopSpan {
          font-size: 24px;
          color: #8c8c8c;
          margin-left: 9px;
          vertical-align: middle;
        }
      }
    }
    .globalTopRight {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .globalTopSearch {
        width: 350px;
        height: 40px;
      }
      .globalTopHead {
        display: flex;
        align-items: center;
      }
    }
  }
}
.ant-dropdown-link {
  cursor: pointer;
}
</style>