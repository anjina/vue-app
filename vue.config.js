const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    host: '127.0.0.1',
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('components', resolve('src/components'))
      .set('assets', resolve('src/assets'))
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/styles/index.less'),
      ]
    }
  }
}
