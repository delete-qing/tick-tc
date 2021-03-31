//全部
const total = [
    //数据  type = 1 是未回访  2是已回访
    {
      key: "1",
      date: "2019-05-02",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "安装",
      producttype: "空调",
      returnChannel: "微信",
      type: 1
    },
    {
      key: "2",
      date: "2019-05-02",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "维修",
      producttype: "空调",
      returnChannel: "邮件",
      type: 2
    },
    {
      key: "3",
      date: "2019-05-03",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "普通",
      servertype: "安装",
      producttype: "空调",
      returnChannel: "微信",
      type: 1
    },
    {
      key: "4",
      date: "2019-05-04",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "维修",
      producttype: "空调",
      returnChannel: "短信",
      type: 1
    },
    {
      key: "5",
      date: "2019-05-05",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "普通",
      servertype: "安装",
      producttype: "洗衣机",
      returnChannel: "短信",
      type: 2
    },
    {
      key: "6",
      date: "2019-05-06",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "维修",
      producttype: "空调",
      returnChannel: "邮件",
      type: 1
    },
    {
      key: "7",
      date: "2019-05-07",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "普通",
      servertype: "安装",
      producttype: "空调",
      returnChannel: "微信",
      type: 2
    },
    {
      key: "8",
      date: "2019-05-08",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "维修",
      producttype: "空调",
      returnChannel: "微信",
      type: 1
    },
    {
      key: "9",
      date: "2019-05-09",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "维修",
      producttype: "洗衣机",
      returnChannel: "短信",
      type: 1
    },
    {
      key: "10",
      date: "2019-05-10",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "普通",
      servertype: "维修",
      producttype: "空调",
      returnChannel: "微信",
      type: 2
    },
    {
      key: "11",
      date: "2019-05-11",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "普通",
      servertype: "安装",
      producttype: "空调",
      returnChannel: "短信",
      type: 1
    }
  ]
  //未回访
const notVisited = [
    //数据  type = 1 是未回访  2是已回访
    {
      key: "1",
      date: "2019-05-02",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "安装",
      producttype: "空调",
      returnChannel: "微信",
      type: 1
    },
    {
      key: "3",
      date: "2019-05-03",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "普通",
      servertype: "安装",
      producttype: "空调",
      returnChannel: "微信",
      type: 1
    },
    {
      key: "4",
      date: "2019-05-04",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "维修",
      producttype: "空调",
      returnChannel: "短信",
      type: 1
    },

    {
      key: "6",
      date: "2019-05-06",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "维修",
      producttype: "空调",
      returnChannel: "邮件",
      type: 1
    },
    {
      key: "8",
      date: "2019-05-08",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "维修",
      producttype: "空调",
      returnChannel: "微信",
      type: 1
    },
    {
      key: "9",
      date: "2019-05-09",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "维修",
      producttype: "洗衣机",
      returnChannel: "短信",
      type: 1
    },
    {
      key: "11",
      date: "2019-05-11",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "普通",
      servertype: "安装",
      producttype: "空调",
      returnChannel: "短信",
      type: 1
    }
  ]
const visited = [
    //数据  type = 1 是未回访  2是已回访
    {
      key: "2",
      date: "2019-05-02",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "vip",
      servertype: "维修",
      producttype: "空调",
      returnChannel: "邮件",
      type: 2
    },
    {
      key: "5",
      date: "2019-05-05",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "普通",
      servertype: "安装",
      producttype: "洗衣机",
      returnChannel: "短信",
      type: 2
    },
    {
      key: "7",
      date: "2019-05-07",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "普通",
      servertype: "安装",
      producttype: "空调",
      returnChannel: "微信",
      type: 2
    },
    {
      key: "10",
      date: "2019-05-10",
      endday: 5,
      address: "河南省郑州市金水区XXX1号楼1单元",
      content: "安装空调1.5p,",
      customerType: "普通",
      servertype: "维修",
      producttype: "空调",
      returnChannel: "微信",
      type: 2
    }
  ]
  export {
      total,
      notVisited,
      visited
  }