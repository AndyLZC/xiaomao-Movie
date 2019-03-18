const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
module.exports = {
  baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
  outputDir: "dist",
  assetsDir: "assets",
  indexPath: "index.html",
  filenameHashing: true,
  lintOnSave: false,
  runtimeCompiler: true,
  productionSourceMap: true,

  devServer: {
    //host: "localhost",
    //port: 8081, // 端口号
    //https: true, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    //proxy: 'http://m.maoyan.com/ajax' // 配置跨域处理,只有一个代理

    // 配置多个代理
    proxy: {
      "/movie": {
        target: "https://m.maoyan.com",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "/movie": ''
        }
      },
      "/boxOffice": {
        target: "https://box.maoyan.com/promovie/api/box",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "/boxOffice": ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.module.rules.delete('svg') //重点:删除默认配置中处理svg,
  },
  configureWebpack: {
    module: {
      rules: [{
        test: /\.svg$/,
        include: path.resolve(__dirname, './src/assets/icon'),
        loader: 'svg-sprite-loader'
      }],

    },
    resolve: {
      alias: {
        // '@': path.resolve('src'),
        'img': path.resolve(__dirname, './src/assets/img'),
        '/components': path.resolve(__dirname, './src/components'),
        '/api': path.resolve(__dirname, './src/api'),
        '/common': path.resolve(__dirname, './src/common'),
        '/assets': path.resolve(__dirname, './src/assets'),
        '/view': path.resolve(__dirname, './src/view')
      }
    }

  },
  css: {
    loaderOptions: {
      sass: {
        // 全局注入通用样式
        data: `@import "@/assets/style/index.scss";`
      }
    }
  }
}