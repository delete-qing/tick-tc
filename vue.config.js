const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,

  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: 3000,
    // open: true,
    proxy: {
      '/tick-tc': {
        // target: 'http://192.168.1.145:9087',
        // target: 'http://192.168.43.103:7088',
        target: 'http://192.168.1.122:3035',
        // target: 'http://192.168.1.2:50001',
        // target: 'http://192.168.1.130:9087', //请求本地 需要jeecg-boot后台项目
        // target: 'http://8vkz7z.natappfree.cc',
        ws: false,
        changeOrigin: true
      }
    },
    disableHostCheck: true
  },
  lintOnSave: undefined
}
