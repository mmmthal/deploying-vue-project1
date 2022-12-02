const path = require('path');

function resolveSrc(_path) {
  return path.join(__dirname, _path);
}
vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/deploying-vue-project1/" : "/",
  lintOnSave: true,
  configureWebpack: {
    // Set up all the aliases we use in our app.
    resolve: {
      alias: {
        assets: resolveSrc('src/assets')
      }
    }
  },
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production'
  }
};

export default defineConfig({
  base: '/deploying-vue-project1/',
  plugins: [vue()]
})