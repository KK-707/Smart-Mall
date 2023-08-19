// postcss.config.js，用于配置 PostCSS 的插件和选项
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375 // 在转换 px 单位为视口单位时，将使用 375 作为设计稿的视口宽度
    }
  }
}
