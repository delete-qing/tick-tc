<template>
  <a-carousel id="TickRotationChart" :after-change="onChange" effect="fade" ref="homeTopCarousel" :key="keyOne">
    <div v-for="img in imgSource" :key="img.id" :ddd="1111">
      <img alt="" width="0" height="0" :ref="'img' + img.id" />
      <canvas :ref="'canva' + img.id" :width="imgWidth" :height="imgHeight"></canvas>
    </div>
  </a-carousel>
</template>
<script>
//组件引用
export default {
  name: 'TickRotationChart',
  //组件注册
  components: {},
  props: {
    imgHeight: {
      type: Number,
      default: 300,
    },
    imgWidth: {
      type: Number,
      default: 900,
    },
    imgSource: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      imgIndex: 0,
      millisecond: 0,
      int: '',
      keyOne: 0,
    }
  },
  //计算属性
  computed: {},
  //实例被挂载后调用
  mounted() {
    //整个视图都渲染完毕调用 $ 后空格去掉
    this.$nextTick(() => {})
  },
  //方法存放处
  methods: {
    onImg(imgSource) {
      this.imgSource = imgSource
      this.keyOne++
      var _this = this
      if (this.imgSource && this.imgSource.length > 0) {
        setTimeout(() => {
          //先把图片渲染上
          _this.imgSource.forEach((a, i) => {
            _this.setImg(a, i)
          })
          //开启定时器
          _this.start()
        })
      }
    },
    onChange(a, b, c) {
      this.imgIndex = a
      this.setBackground()
      //开启定时器
      this.start()
    },
    //下一张
    nextHomeTopCarousel() {
      this.millisecond = 0
      clearInterval(this.int)
      if (this.imgSource.length - 1 <= this.imgIndex) {
        this.imgIndex = 0
      } else {
        this.imgIndex++
      }
      this.setBackground()
      this.$refs.homeTopCarousel.next()
    },
    //上一张
    prevHomeTopCarousel() {
      this.millisecond = 0
      clearInterval(this.int)
      if (this.imgIndex <= 0) {
        this.imgIndex = this.imgSource.length === 0 ? 0 : this.imgSource.length - 1
      } else {
        this.imgIndex--
      }
      clearInterval(this.int)
      this.setBackground()
      this.$refs.homeTopCarousel.prev()
    },
    setImg(imgSrc, index) {
      const width = this.imgWidth
      const height = this.imgHeight

      const ima = this.$refs[`img${imgSrc.id}`]
      const _this = this
      ima.forEach((e) => {
        e.src = imgSrc.src
        e.crossOrigin = '' // 处理跨域图片
        const ctx = this.$refs[`canva${imgSrc.id}`]
        e.onload = function () {
          ctx.forEach((c) => {
            const ctx2d = c.getContext('2d')
            if (typeof ctx2d.drawImage == 'function') {
              ctx2d.drawImage(e, 0, 0, width, height)
              if (index === 0) {
                _this.setBackground()
              }
            }
          })
        }
      })
    },
    //开始函数
    start() {
      this.millisecond = 0
      clearInterval(this.int)
      var _this = this
      this.int = setInterval(() => {
        _this.millisecond = _this.millisecond + 50
        if (_this.millisecond >= 7000) {
          //达到设置时间，定时器重置，切换下一张图片
          _this.nextHomeTopCarousel()
        }
      }, 50) //每隔50毫秒执行一次timer函数
    },
    setBackground() {
      if (this.imgSource && this.imgSource.length > 0) {
        const _this = this
        const obja = this.imgSource[this.imgIndex]
        const ctx = this.$refs[`canva${obja.id}`][0].getContext('2d')
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data // 获取背景色
        this.$emit('ok', `rgba(${r}, ${g}, ${b}, ${a})`)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
</style>