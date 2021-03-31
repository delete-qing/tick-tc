<template>
  <div>
    <div class="user-wrapper">
      <!-- <header-notice class="action"/> -->
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="userInfo().photo" />
          <span style="font-size: 16px; color: #333333">{{ nickname() }}</span>
        </span>

        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <template v-for="item in menus">
            <template v-if="item.children">
              <a-sub-menu :key="item.name">
                <span slot="title"
                  ><a-icon v-if="item.meta.icon" :type="item.meta.icon" style="margin-right: 8px" /><span>{{
                    item.meta.title
                  }}</span></span
                >
                <a-menu-item v-for="items in item.children" :key="items.name">
                  <router-link :to="{ path: items.path }">
                    <a-icon v-if="items.meta.icon" :type="items.meta.icon" /><span>{{ items.meta.title }}</span>
                  </router-link>
                </a-menu-item>
              </a-sub-menu>
            </template>
            <template v-else>
              <a-menu-item v-if="!item.hidden" :key="item.name">
                <router-link :to="{ path: item.path }">
                  <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
                  <span>{{ item.meta.title }}</span>
                </router-link>
              </a-menu-item>
            </template>
          </template>
          <a-menu-item key="2" @click="revisePassword">
            <a-icon type="lock" />
            <span>修改密码</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <!--<span class="action">
        <a class="logout_title" href="javascript:;" @click="handleLogout">
           <a-icon type="logout"/>
          <a-icon type="poweroff" style="font-size: 24px; color: #fff" />
           <span> 退出登录</span>
        </a>
      </span> -->
      <!-- <span class="action">
          <a-icon type="logout"/>
      <span> 退出登录</span>-->
      <!-- <img src="../../views/img/logo.png" alt style="margin-bottom: 10px;"> -->
      <!-- <span> 郑州铁拓</span> -->
      <!-- <div class="tickAuto">郑州铁拓</div> -->
      <!-- <a class="logout_title" href="javascript:;" @click="handleLogout">
        </a>
      </span>-->
    </div>
    <password-modal ref="revisePassword"></password-modal>
  </div>
</template>

<script>
import HeaderNotice from './HeaderNotice'
import { mapActions, mapGetters } from 'vuex'
import { imgView } from '@/api/api'
import PasswordModal from '@/views/system/modules/PasswordModal'

export default {
  name: 'UserMenu',
  components: {
    HeaderNotice,
    PasswordModal,
  },
  props: {
    menus: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {}
  },
  //实例被挂载后调用
  mounted() {
    // console.log('aaaaaaaaaaaaa', this.menus)
    document.addEventListener(
      'fullscreenchange',
      function () {
        fullscreenState.innerHTML = document.fullscreen ? '' : 'not '
      },
      false
    )

    document.addEventListener(
      'mozfullscreenchange',
      function () {
        fullscreenState.innerHTML = document.mozFullScreen ? '' : 'not '
      },
      false
    )

    document.addEventListener(
      'webkitfullscreenchange',
      function () {
        fullscreenState.innerHTML = document.webkitIsFullScreen ? '' : 'not '
      },
      false
    )

    document.addEventListener(
      'msfullscreenchange',
      function () {
        fullscreenState.innerHTML = document.msFullscreenElement ? '' : 'not '
      },
      false
    )
    console.log(this.userInfo().photo)
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    // getAvatar() {
    //   if (this.userInfo.photo != '') {
    //     return this.userInfo.photo
    //   }
    //   // console.log('url = ' + imgView + this.avatar())
    // },
    revisePassword() {
      this.$refs.revisePassword.show(this.userInfo().username)
    },
    handleLogout() {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that
            .Logout({})
            .then(() => {
              window.location.reload()
            })
            .catch((err) => {
              that.$message.error({
                title: '错误',
                description: err.message,
              })
            })
        },
        onCancel() {},
      })
    },
  },
  mounted() {
    let depart = this.userInfo().orgCode
    if (!depart) {
      // this.updateCurrentDepart();
    }
  },
}
</script>

<style lang="scss" scoped>
.maxDiv {
  width: 20px;
  height: 20px;
  background-image: url('./img/maxone.png');
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
}
.maxDiv:hover {
  width: 20px;
  height: 20px;
  background-image: url('./img/maxtwo.png');
  background-repeat: no-repeat;
  background-size: cover;
}
.minDiv {
  width: 20px;
  height: 20px;
  background-image: url('./img/minone.png');
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
}
.minDiv:hover {
  width: 20px;
  height: 20px;
  background-image: url('./img/mintwo.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.logout_title {
  color: rgba(0, 0, 0, 0.65);
  text-decoration: none;
  display: flex;
  align-items: center;
}
.user-wrapper {
  height: 46px !important;
  display: flex;
  align-items: center;
}
.actic-span {
  display: inline-block;
  cursor: pointer;
  position: relative;
  margin-left: 10px;
  width: 150px;
  img {
    position: absolute;
    width: 65px;
    height: 35px;
    top: -25px;
    left: -5px;
  }
  span {
    position: absolute;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    top: -36px;
    right: 0;
  }
}
.action {
  margin: 0px 0px 0px 22px;
  display: flex;
  align-items: center;
  color: #adadad;
}
.avatar {
  margin-right: 12px;
  // margin-left: 24px;
  width: 46px;
  height: 46px;
}
.logout_title {
  color: #92969a;
}
</style>