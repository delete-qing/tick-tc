import Vue from 'vue'

//全局自定义指令  给元素动画滚动到顶部
Vue.directive('scroll-top', {
    componentUpdated: function (el, binding, ) {
      if (el.scrollTop && binding.value == true) {
        if (el.scrollTop == 0) {
          return
        }
        let timer = setInterval(() => {
          const ispeed = Math.floor(-el.scrollTop / 5)
          el.scrollTop = el.scrollTop + ispeed
          if (el.scrollTop === 0) {
            clearInterval(timer)
          }
        }, 16)
      }
    }
  })