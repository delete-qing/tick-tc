<template>
  <div id="">
    <video-player
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      :options="playerOptions"
      @pause="onPlayerPause($event)"
      @timeupdate="onPlayerTimeupdate($event)"
      @ended="onPlayerEnded($event)"
      @ready="playerReadied"
    ></video-player>
  </div>
</template>
<script>
//组件引用
//import name from ""
export default {
  props: {
    videotUrl: {
      type: String,
      default: '',
    },
    videotImg: {
      type: String,
      default: '',
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
  },
  //组件注册
  components: {},
  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: this.autoplay, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4', //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            // src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm', //url地址
            src: this.videotUrl, //url地址
          },
        ],
        // poster: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3778147963,336723083&fm=26&gp=0.jpg', //你的封面地址
        poster: this.videotImg, //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试！', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, //全屏按钮
        },
      },
      gklog: '', //视频观看时长
    }
  },
  //计算属性
  computed: {},
  //实例被挂载后调用
  mounted() {
    //整个视图都渲染完毕调用 $ 后空格去掉
    //this.$ nextTick(() => {
    //})
  },
  //方法存放处
  methods: {
    onVideoPlayer(videotUrl, videotImg, gklog) {
      this.videotUrl = videotUrl
      this.videotImg = videotImg
      this.playerOptions.sources[0].src = this.videotUrl
      this.gklog = gklog
      this.playerOptions.poster = this.videotImg
    },
    // 当前播放位置发生变化时触发。
    onPlayerTimeupdate(player) {
      // console.log(player.cache_.currentTime)
      this.$emit('onPlay', player.cache_.currentTime)
    },
    // 视频播完回调pause
    onPlayerEnded(player) {
      this.$emit('onEnd', player.cache_.currentTime)
    }, // 暂停回调
    onPlayerPause(player) {
      this.$emit('onPause', player.cache_.currentTime)
    },

    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied(player) {
      /* 设置视频进度 */
      player.currentTime(this.gklog)
    },
  },
}
</script>
<style lang="scss" scoped>
.video-js .vjs-icon-placeholder {
  width: 100%;
  height: 100%;
  display: block;
}
/deep/ .vjs-poster {
  background-size: 100% 100% !important;
}
</style>