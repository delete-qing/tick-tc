<template>
  <div class="page-header">
    <div class="page-header-index-wide">
      <div class="titleBread">
        <div class="pageTitle">
          {{ title || (breadList[breadList.length - 1] && breadList[breadList.length - 1].meta.title) }}
        </div>
        <!-- <a-breadcrumb class="breadcrumb">
          <a-icon
            type="home"
            class="anticon anticon-bank"
            style="margin-right:3px;margin-left:18px;color:#e0e0e0"
          >
            <svg
              viewBox="64 64 896 896"
              data-icon="bank"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              class
            >
              <path
                d="M894 462c30.9 0 43.8-39.7 18.7-58L530.8 126.2a31.81 31.81 0 0 0-37.6 0L111.3 404c-25.1 18.2-12.2 58 18.8 58H192v374h-72c-4.4 0-8 3.6-8 8v52c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-52c0-4.4-3.6-8-8-8h-72V462h62zM512 196.7l271.1 197.2H240.9L512 196.7zM264 462h117v374H264V462zm189 0h117v374H453V462zm307 374H642V462h118v374z"
              />
            </svg>
          </a-icon>
          <a-breadcrumb-item v-for="(item, index) in breadList" :key="index" style="color:#e0e0e0">
            <router-link v-if="item.name != name" :to="{ path: item.path }">{{ item.meta.title }}</router-link>
            <span v-else>{{ item.meta.title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb> -->
      </div>

      <!-- <div class="detail">
        <div class="main" v-if="!$route.meta.hiddenHeaderContent">
          <div class="row">
            <img v-if="logo" :src="logo" class="logo" />
            <h1 v-if="title" class="title">{{ title }}</h1>
            <div class="action">
              <slot name="action"></slot>
            </div>
          </div>
          <div class="row">
            <div v-if="avatar" class="avatar">
              <a-avatar :src="avatar" />
            </div>
            <div v-if="this.$slots.content" class="headerContent">
              <slot name="content"></slot>
            </div>
            <div v-if="this.$slots.extra" class="extra">
              <slot name="extra"></slot>
            </div>
          </div>
          <div>
            <slot name="pageMenu"></slot>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/tools/Breadcrumb'

export default {
  name: 'PageHeader',
  components: {
    's-breadcrumb': Breadcrumb,
  },
  props: {
    title: {
      type: String,
      default: '',
      required: false,
    },
    breadcrumb: {
      type: Array,
      default: null,
      required: false,
    },
    logo: {
      type: String,
      default: '',
      required: false,
    },
    avatar: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      name: '',
      breadList: [],
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      this.breadList = []

      this.name = this.$route.name
      this.$route.matched.forEach((item) => {
        if (item.path != '') {
          this.breadList.push(item)
        }
      })
    },
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },
}
</script>

<style lang="scss" scoped>
.page-header {
  background: #fff;
  padding: 0px 30px;
  border-bottom: 1px solid #e5e6e7;
  font-family: 'PingFang SC';
  color: #e0e0e0;
  font-weight: 700;
  height: 62px;
  border-radius:  10px 10px 0 0;
  .titleBread {
    display: flex;
    align-items: center;
    // margin-bottom: 12px;
    .pageTitle {
      font-size: 22px;
      line-height: 62px;
      font-family: 'PingFang SC';
      font-weight: 400;
      color: #333333;
    }
    .breadcrumb {
      text-align: right;
      flex: 1;
      line-height: 36px;
    }
    .ant-breadcrumb-separator {
      margin-left: 5px;
      margin-right: 5px;
    }
  }

  .detail {
    display: flex;
    /*margin-bottom: 16px;*/

    .avatar {
      flex: 0 1 72px;
      margin: 0 24px 8px 0;

      & > span {
        border-radius: 72px;
        display: block;
        width: 72px;
        height: 72px;
      }
    }

    .main {
      width: 100%;
      flex: 0 1 auto;

      .row {
        display: flex;
        width: 100%;

        .avatar {
          margin-bottom: 16px;
        }
      }

      .title {
        font-size: 20px;
        font-weight: 500;

        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 16px;
        flex: auto;
      }
      .logo {
        width: 28px;
        height: 28px;
        border-radius: 4px;
        margin-right: 16px;
      }
      .content,
      .headerContent {
        flex: auto;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;

        .link {
          margin-top: 16px;
          line-height: 24px;

          a {
            font-size: 14px;
            margin-right: 32px;
          }
        }
      }
      .extra {
        flex: 0 1 auto;
        margin-left: 88px;
        min-width: 242px;
        text-align: right;
      }
      .action {
        margin-left: 56px;
        min-width: 266px;
        flex: 0 1 auto;
        text-align: right;
        &:empty {
          display: none;
        }
      }
    }
  }
}
.ant-breadcrumb-separator {
  margin: 0 -10px !important;
}

.mobile .page-header {
  .main {
    .row {
      flex-wrap: wrap;

      .avatar {
        flex: 0 1 25%;
        margin: 0 2% 8px 0;
      }
      .content,
      .headerContent {
        flex: 0 1 70%;

        .link {
          margin-top: 16px;
          line-height: 24px;

          a {
            font-size: 14px;
            margin-right: 10px;
          }
        }
      }
      .extra {
        flex: 1 1 auto;
        margin-left: 0;
        min-width: 0;
        text-align: right;
      }
      .action {
        margin-left: unset;
        min-width: 266px;
        flex: 0 1 auto;
        text-align: left;
        margin-bottom: 12px;
        &:empty {
          display: none;
        }
      }
    }
  }
}
</style>