const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');


const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/background.js',
      builderOptions: {
        win: {
          icon: 'public/Kyrios.ico'
        },
        mac: {
          icon: 'public/Kyrios.icns'
        },
        linux: {
          icon: 'public/Kyrios.png'
        }
      }
    },
  },
  configureWebpack: {
    optimization: {
      minimize: false,  // Disable minification
    },
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(true),
        // Add other feature flags here if needed
      }),
      new webpack.EnvironmentPlugin(
        envKeys
      ),
    ],
    watchOptions: {
      // Paths to be watched
      ignored: /node_modules/, // Ignore node_modules by default
    }
  },
  devServer: {
    client: {
      overlay: {
        runtimeErrors: (error) => {
          const ignoreErrors = [
            "ResizeObserver loop limit exceeded",
            "ResizeObserver loop completed with undelivered notifications.",
          ];
          if (ignoreErrors.includes(error.message)) {
            return false;
          }
          return true;
        },
      },
    },
  },
});