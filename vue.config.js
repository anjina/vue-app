const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('components', resolve('src/components'))
      .set('assets', resolve('src/assets'))
  },
  css: {
    loaderOptions: {
      // 给sass-loader 传递选项
      less: {
        prependData: `@import "@/styles/index.less";`
      }
    }
  }
}