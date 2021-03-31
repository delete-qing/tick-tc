<template>
  <div id="dict">
    <div class="conter">
      <page-header></page-header>
      <div class="con">
        <tickDict :dictType="dictType"></tickDict>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/page/PageHeader.vue'
import tickDict from '@/components/TickDict'

export default {
  // name: "HiddenDangerList",
  components: {
    PageHeader,
    tickDict,
  },
  data() {
    return {
      dictType: 'course',
    }
  },
  created() {},
}
</script>
<style lang="scss" scoped>
#dict {
  background: #fff;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding-top: 40px;
  .conter {
    width: 1300px;
    height: calc(100vh - 150px);
    border-radius: 10px;
    margin: 0 auto;
    border: solid 1px #e5e6e7;
    .con {
      overflow: hidden;
      // overflow-y: scroll;
      height: calc(100vh - 250px);
    }
  }
}
</style>