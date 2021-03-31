import Mock from 'mockjs'

// 通过 Mock.mock() 来模拟API接口
Mock.mock('/api/goodslist', 'get', {
  status: 200,
  message: '获取商品列表成功！',
  'data|5-10': [
    {
      id: '@id()',
      name: '@cword(2, 8)', 
      price: '@natural(2, 10)',
      count: '@natural(100, 999)',
      img: '@dataImage(78x78)'
    }
  ]
})

Mock.mock('/api/addgoods', 'post', function(option) {
  // 这里的 option 是请求相关的参数
  console.log(option)

  return Mock.mock({
    status: 200,
    message: '@cword(2,5)'
  })
})

Mock.mock(/\/api\/getgoods/, 'get', function(option) {
  console.log(option)

  // 通过 正则 的 .exec() 函数，从字符串中提取需要的数据
  const res = /\/api\/getgoods\/(\d+)/.exec(option.url)

  return Mock.mock({
    data: {
      id: res[1] - 0,
      name: '@fruit()',
      price: 2,
      count: 199,
      img: '@dataImage(78x78)'
    },
    status: 200,
    message: '获取商品成功！'
  })
})