<template>
  <div class="dict">
    <page-header></page-header>
    <tickDict :dictType="dictType"></tickDict>
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
      dictType: 'system',
    }
  },
  created() {
    // 初始加载
    // this.getBasicInfo()
    // this.loadData()
  },
}
</script>
<style lang="scss" scoped>
.dict {
  // background:  #f2f2f2;
  height: 100%;
  .card-box {
    // 列表内容
    .meeting-list {
      width: 100%;
      // border-radius: $list-card-radius;
      // border: 1px solid $list-card-color;
      .list-operation {
        color: #f5222d;
        cursor: pointer;
      }
    }
  }
}
</style>