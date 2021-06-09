const webpack = require("webpack");
const fs = require("fs");
const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || 0;

module.exports = {
  productionSourceMap: false,
  devServer: {
    // proxy: "http://routinator-dev.aws.nlnetlabs.nl:8323/"
    proxy: "https://routinator-demo.aws.nlnetlabs.nl"
  },
  publicPath: '/ui/',

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  },

  filenameHashing: false,

  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new webpack.DefinePlugin({
        "process.env": {
          PACKAGE_VERSION: '"' + version + '"'
        }
      })
    ],
    performance: {
      hints: false
    }
  },
  chainWebpack: config => {
    config.optimization.delete("splitChunks");
  }
};
