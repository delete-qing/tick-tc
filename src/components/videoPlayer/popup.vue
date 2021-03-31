<template>
  <a-modal
    :visible="visible"
    :width="1060"
    @cancel="close"
    cancelText="关闭"
    centered
    wrapClassName="video"
    :maskClosable="false"
    :destroyOnClose="true"
    :footer="null"
  >
    <videoPlayer :videotUrl="videotUrl" :videotImg="videotImg" :autoplay="true"></videoPlayer>
  </a-modal>
</template>
<script>
import videoPlayer from '@/components/videoPlayer'
export default {
  name: 'videoPopup',
  components: {
    videoPlayer,
  },
  data() {
    return {
      visible: false, //当前弹窗是否显示
      videotUrl: '',
      videotImg: '',
    }
  },
  methods: {
    close() {
      this.visible = false
    },
    video(url, img) {
      this.visible = true
      this.videotUrl = url
      this.videotImg = img
    },
  },
}
</script>
<style scoped>
</style>