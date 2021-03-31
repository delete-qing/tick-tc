
<template>
  <a-drawer
    :destroyOnClose="true"
    title="选择产品类型"
    placement="right"
    :closable="false"
    wrapClassName="class-drawer-unique"
    @close="onClose"
    :visible="visible"
    width="32%"
    :zIndex="10000"
  >
    <a-row style="height: calc(100vh - 55px);" class="row-drawer-css">
      <!-- 左边 -->
      <a-col :span="6" class="col-scroll-css col-left">
        <p class="col-left-item" v-for="(item, index) in classData" :key="item.title">
          <span :class="leftItemAClass(index)" @click="selectLeftClass(index, item)">{{item.title}}</span>
        </p>
      </a-col>
      <!-- 右边 -->
      <a-col
        :span="18"
        ref="rightScrollView"
        class="col-scroll-css col-right"
        v-scroll-top="scrollTop"
      >
        <a-list :dataSource="selectedLeft.sub" :split="false">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-row :gutter="16">
              <a-col :span="24">
                <p class="col-right-header-p">
                  <span>{{item.title}}</span>
                </p>
              </a-col>
              <a-col :span="8" v-for="type in item.types" :key="type.title">
                <a-card class="col-right-card" hoverable :bordered="false" @click="selectRightClass(item, type)">
                  <img
                    alt="example"
                    :src="type.img || 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=154457899,2714371194&fm=26&gp=0.jpg'"
                    slot="cover"
                  />
                  <a-card-meta>
                    <p class="col-right-item-title" slot="description">{{type.title}}</p>
                  </a-card-meta>
                </a-card>
              </a-col>
            </a-row>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      callback: null,
      classData: [
        {
          id: '1',
          title: '沁园',
          sub: [
            {
              id: '11',
              title: '厨房净水器',
              types: [
                {
                  id: '111',
                  title: '小白鲸无桶纯水机 400G KRL3913',
                  img: 'https://www.qinyuan.cn/Uploads/20190225161539755_2.jpg',
                },
                {
                  id: '112',
                  title: '净热一体无桶纯水机 星空灰KRL8803H',
                  img: 'https://www.qinyuan.cn/Uploads/20181025133229304_2.jpg'
                },
                {
                  id: '113',
                  title: '600G无桶大流量纯水机 粉色 KRL6806',
                  img: 'https://www.qinyuan.cn/Uploads/20180603093746919_2.png'
                },
                {
                  id: '114',
                  title: '净热一体纯水机 白色 KRL8800H',
                  img: 'https://www.qinyuan.cn/Uploads/20181025135014920_2.jpg'
                }
              ]
            },
            {
              id: '12',
              title: '客厅净水器',
              types: [
                {
                   id: '121',
                  title: '立式下置桶饮水机 白色 LNS558-6F',
                  img: 'https://www.qinyuan.cn/Uploads/20181025172255570_2.jpg',
                },
                {
                   id: '122',
                  title: '家用台式速热型饮水机 LND280-5D',
                  img: 'https://www.qinyuan.cn/Uploads/20181009155306984_2.jpg',
                },
                {
                   id: '123',
                  title: '家用壁挂式速热型饮水机 QX-DF-1305G',
                  img: 'https://www.qinyuan.cn/Uploads/20170510142007042_2.jpg',
                },
                
              ]
            },
            {
              id: '13',
              title: '全屋净水系列',
              types: [
                {
                   id: '131',
                  title: '全屋自来水前置净水器 白色 FMP580',
                  img: 'https://www.qinyuan.cn/Uploads/20180918140825232_2.png',
                },
                {
                   id: '132',
                  title: '全屋软水机 QYR-S-101C',
                  img: 'https://www.qinyuan.cn/Uploads/20170427153101519_1.jpg',
                },
                {
                   id: '133',
                  title: '全屋净软一体机 FJR-2000',
                  img: 'https://www.qinyuan.cn/Uploads/20170427153046206_2.jpg',
                },
                {
                   id: '133',
                  title: '全屋中央净水器 QY-UF-201A',
                  img: 'https://www.qinyuan.cn/Uploads/20170510144553714_2.jpg',
                },
              ]
            },
            {
              id: '14',
              title: '商用净水器',
              types: [
                {
                   id: '141',
                  title: '商用净饮机 QS-ZRW-L15',
                  img: 'https://www.qinyuan.cn/Uploads/20181025140358895_2.png',
                },
                {
                   id: '142',
                  title: '商用净水机 QS-U3-BK300-20',
                  img: 'https://www.qinyuan.cn/Uploads/20190613101841415_3.png',
                },
                {
                   id: '143',
                  title: '前置净水器 灰色 FMP280',
                  img: 'https://www.qinyuan.cn/Uploads/20180918134042910_1.png',
                },
                {
                   id: '144',
                  title: '商用饮水平台 QS-ZU2-3G00',
                  img: 'https://www.qinyuan.cn/Uploads/20170523144718316_1.jpg',
                },
              ]
            }
          ]
        },
        {
          id: '2',
          title: '海尔',
          sub: [
            {
              id: '1',
              title: '空调',
              types: [
                {
                  title: '型号1'
                },
                {
                  title: '型号2'
                },
                {
                  title: '型号3'
                }
              ]
            }
          ]
        },
        {
          id: '2',
          title: '西门子',
          sub: [
            {
              id: '1',
              title: '空调',
              types: [
                {
                  title: '型号1'
                },
                {
                  title: '型号2'
                },
                {
                  title: '型号3'
                }
              ]
            },
            {
              id: '1',
              title: '空调',
              types: [
                {
                  title: '型号1'
                },
                {
                  title: '型号2'
                },
                {
                  title: '型号3'
                }
              ]
            },
            {
              id: '1',
              title: '空调',
              types: [
                {
                  title: '型号1'
                },
                {
                  title: '型号2'
                },
                {
                  title: '型号3'
                }
              ]
            },
            {
              id: '1',
              title: '空调',
              types: [
                {
                  title: '型号1'
                },
                {
                  title: '型号2'
                },
                {
                  title: '型号3'
                }
              ]
            },
            {
              id: '1',
              title: '空调',
              types: [
                {
                  title: '型号1'
                },
                {
                  title: '型号2'
                },
                {
                  title: '型号3'
                }
              ]
            },
            {
              id: '1',
              title: '空调',
              types: [
                {
                  title: '型号1'
                },
                {
                  title: '型号2'
                },
                {
                  title: '型号3'
                }
              ]
            },
            {
              id: '1',
              title: '空调',
              types: [
                {
                  title: '型号1'
                },
                {
                  title: '型号2'
                },
                {
                  title: '型号3'
                }
              ]
            },
            {
              id: '1',
              title: '空调',
              types: [
                {
                  title: '型号1'
                },
                {
                  title: '型号2'
                },
                {
                  title: '型号3'
                }
              ]
            }
          ]
        }
      ],
      sub: [],
      //选中的第一类
      selectedLeft: {},
      selectLeftIndex: 1,
      scrollTop: false
    }
  },
  computed: {
    leftItemAClass(index) {
      return index => (index == this.selectLeftIndex ? 'col-left-item-selected' : 'col-left-item-normal')
    }
  },
  mounted() {
    //默认展示第一个
    this.selectLeftClass(0, this.classData[0])
  },
  methods: {
    show(callback) {
      this.callback = callback
      this.visible = true
    },
    rightScroll() {},
    //选择了大类
    selectLeftClass(index, cls) {
      this.selectLeftIndex = index
      this.selectedLeft = cls
      this.scrollTop = true
    },
    selectRightClass(sub, type) {
      let res = Object.assign({}, this.selectedLeft, { sub: { ...sub, types: { ...type } } })
      //选中
      if (this.callback) {
        this.callback('ok', res)
      }
      //隐藏
      this.visible = false
    },
    onClose() {
      //禁止滑动到顶部
      this.scrollTop = false
      //取消
      if (this.callback) {
        this.callback('cancel', null)
      }
      //隐藏
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
//为更改样式 去掉scoped 样式全在class-drawer-unique里
.class-drawer-unique {
  // 去掉drawer内容内边距
  .ant-drawer-body {
    padding: 0;
  }

  // 自定义内容
  .row-drawer-css {
    padding: 0px 0px;
    .col-scroll-css {
      height: 100%;
      overflow: scroll;
    }
    //左列
    .col-left {
      .col-left-item {
        padding: 0;
        height: 44px;
        line-height: 44px;
        margin: 0;
        span {
          display: inline-block;
          width: 100%;
          height: 100%;
          text-align: center;
          text-decoration: none;
          position: relative;
          cursor: pointer;
        }
        .col-left-item-normal {
          color: rgb(160, 159, 159);
          background-color: #f3f3f3;
          font-size: 0.9em;
        }
        .col-left-item-normal:hover {
          background-color: #eeeeee;
        }
        .col-left-item-selected {
          color: black;
          font-size: 1.1em;
          font-weight: 700;
          background-color: #fff;
          transition: all 0.5s;
        }
        .col-left-item-selected::before {
          content: '';
          width: 4px;
          background-color: #0194f5;
          height: 16px;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -5px;
        }
      }
    }
    //右列
    .col-right {
      padding: 8px 20px 8px;
      .col-right-header-p {
        font-weight: 700;
        background-color: #f3f3f3;
        margin-bottom: 8px;
        padding: 8px 0px 8px 8px;
      }
      .col-right-item-title {
        text-align: center;
        font-size: 0.8em !important;
        font-weight: 400;
        padding-top: 8px;
      }
      &-card {
        
        .ant-card-body {
          padding: 8px 0px!important;
        }
      }
    }
  }
  // 隐藏滑动条
  .hide-scroll-bar::-webkit-scrollbar {
    display: none;
  }
}
</style>
