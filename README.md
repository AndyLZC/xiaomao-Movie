总算是完成了自己的第一个开源小项目！！

## 前言
个人多次想尝试做一个完整的vue项目，但无奈基础差，水平有限，一直没能够实现。最近又萌生了这个念头，于是选择猫眼电影作为“下手目标”，断断续续用了几个星期，利用`vue`全家桶完成了此项目。
UI界面并非完全和[猫眼电影移动版](http://m.maoyan.com/#movie)一样，而是结合了原生猫眼app，对部分界面作了修改（个人对UI审美有点强迫症）。

## 说明
数据接口来源猫眼电影，项目不会被用于作商业用途。

## 效果演示
[小猫电影](http://47.106.82.12:8081/xiaomao/#/movie)

[gihub仓库地址](https://github.com/AndyLZC/webapp-maoyan/)

![](https://user-gold-cdn.xitu.io/2019/3/18/169906bbc51d25d6?w=307&h=552&f=gif&s=2467116)
![](https://user-gold-cdn.xitu.io/2019/3/18/1699059840c93241?w=307&h=552&f=gif&s=1099609)

![](https://user-gold-cdn.xitu.io/2019/3/18/1699059c62779dad?w=307&h=552&f=gif&s=2199881)

![](https://user-gold-cdn.xitu.io/2019/3/18/169905a89be520de?w=307&h=552&f=gif&s=1166919)

![](https://user-gold-cdn.xitu.io/2019/3/18/169905b08c5b563a?w=307&h=552&f=gif&s=1866801)

## 完成功能

- [x] 模拟登陆拦截、登出功能
- [x] 城市搜索、选取
- [x] 个人定位
- [x] 电影收藏、打分、视频预告
- [x] 电影详情、影院详情
- [x] 电影、影院搜索
- [x] 影院条件过滤
- [x] 影院选座、选座推荐
- [x] 模拟购票
- [x] 历史订单

## 技术栈
项目没有使用`UI`库,而是简单封装了几个基础常用组件：`alert`+ `toast` + `loading`

`vue2.5` + `vue-router` + `vuex` + `webpack` + `es6/es7` + `sass` + `svg`

### 接口数据
项目使用了猫眼电影的两个接口

电影：`https://m.maoyan.com/ajax`
票房：`https://box.maoyan.com/promovie/api/box`

本地开发环境使用`proxy`设置代理
```
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
    
    //部分请求接口
    
        /* 影院详情 */
    export const getCinemaDetail = (cinemaId) => {
      return http.fetchGet(`/movie/ajax/cinemaDetail`, {
        cinemaId
      })
    }
    
    /* 票房 */
    export const getBoxOffice = (beginDate) => {
      return http.fetchGet(`/boxOffice/second.json`, {
        beginDate
      })
    }
```
线上环境使用`nginx`作反向代理，解决跨域问题

## 项目运行
```
//vue-cli版本是 3.0

npm i

npm run serve
```

### 项目细节
#### 骨架屏
在首页加载数据之前，会有一段空白时间，为了增强应用体验效果，一般使用`loading`加载图标，也可以用骨架屏。
骨架屏是在网络请求较慢时，提供基础占位，当数据加载完成，恢复数据展示。这样给用户一种很自然的过渡，不会造成页面长时间白屏或者闪烁等情况。骨架屏实现起来有多种方法，我是使用了`vue-content-loader`这一插件，它可以实现在线编辑，实现起来更加简单。

[vue-content-loader](https://create-vue-content-loader.netlify.com/)

[自动生成骨架屏](https://github.com/Jocs/jocs.github.io/issues/21)

[为vue项目添加骨架屏](https://xiaoiver.github.io/coding/2017/07/30/%E4%B8%BAvue%E9%A1%B9%E7%9B%AE%E6%B7%BB%E5%8A%A0%E9%AA%A8%E6%9E%B6%E5%B1%8F.html)

### SVG
封装了一个`icon-svg` 组件，
让图标使用起来更加方便

[未来必热：SVG Sprite技术介绍](https://www.zhangxinxu.com/wordpress/2014/07/introduce-svg-sprite-technology/?spm=a313x.7781069.1998910419.50)

[手摸手，带你优雅的使用 icon](https://segmentfault.com/a/1190000012213278#articleHeader8)

## 项目总结
其实是采坑总结，`1-border-px`、`滚动穿透`、`better-scroll`、`sass样式穿透`、`跨域`等等

目录结构设置、命名规范、代码书写还存在很多问题，后续会把坑给填上。

### 最后..
如果你觉得项目还可以，`github`给个`star`，或者“买”张电影票帮我续一天服务器的费用吧（手动点赞谢谢）✍

如果觉得有问题，欢迎提出，我会虚心接受大家的意见。
![](https://user-gold-cdn.xitu.io/2019/3/18/16990a40e6feea8f?w=754&h=943&f=jpeg&s=71694)

![](https://user-gold-cdn.xitu.io/2019/3/18/16990a43d07424a4?w=702&h=791&f=jpeg&s=87655)




