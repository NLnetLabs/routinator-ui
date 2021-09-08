const webpack = require("webpack");
const fs = require("fs");
const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || 0;
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/api/v1/validity/": {
        target: `https://${process.env.VUE_APP_ROUTINATOR_API_HOST}`
      },
      "/api/v1/status": { target: `https://${process.env.VUE_APP_ROUTINATOR_API_HOST}` },
      "/api/v1/": { target: `https://${process.env.VUE_APP_HOST}` }
    }
  },
  // note that relative publicPath seems the way to go,
  // but can't be used in combination with history based routing.
  publicPath: process.env.VUE_APP_BASE_DIR,

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
      }),
      new FileManagerPlugin({
        events: {
          onEnd: {
            archive: [
              {
                source: "./dist",
                destination: "./routinator-ui-build.tar.gz",
                format: "tar",
                options: {
                  gzip: true,
                  gzipOptions: {
                    level: 1
                  },
                  globOptions: {
                    nomount: true
                  }
                }
              }
            ]
          }
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
