/*
 * @Author: Mwing
 * @since: 2021-07-02 10:27:58
 * @lastTime: 2021-07-12 18:16:18
 * @LastAuthor: Mwing
 * @message:
 * @FilePath: \fe-scaffold\devServer.config.ts
 */
// 查看全部配置：https://github.com/webpack/webpack-dev-server
import type WebpackDevServer from "webpack-dev-server";
import { getConfig } from "./scripts/utils";
const path = require('path')
const chalk = require('chalk')
// 设置一个proxy
const proxyConfig = getConfig('proxy');
const devServerConfig: WebpackDevServer.Configuration = {
  // webpack.output.path之外的在这里查找，静态资源
  contentBase: [path.join(__dirname, 'public')],
  contentBasePublicPath: '/',
  compress: true,
  // lazy: true,
  // hot: true,
  // 表示开启热更新，但不刷新页面
  hotOnly: true,
  // 开启这个的话只能通过ip来访问开发环境
  // useLocalIp: true,
  // 开发服务器启动完成的回调
  onListening: function (server) {
    const address = server.listeningApp.address() as { address: string, port: string | number };
    console.log(chalk.bgGreen(chalk.whiteBright('App start at ', `http://${address.address}:${address.port}`, ' use --open to open with default browser.')));
  },
  // 不打印日志信息
  // quiet: true,
  // 出现构建错误的时候在页面上显示
  overlay: true,
  // 注入到前端，配合overlay使用
  injectClient: true,
  // 设置这个后可以通过localhost、ip等方式访问，否则只能支持默认的localhost
  host: '0.0.0.0',
  proxy: proxyConfig?.config
  // 前端的接口代理，建议开发环境的所有切换在这里操作，文档参考https://github.com/chimurai/http-proxy-middleware#options
  // proxy: {
  //   '/api': {
  //     target: 'http://localhost:3000',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       // 重写路径，比如现在访问的是https://127.0.0.1:3000/api，转发后实际访问后台的地址是http://localhost:3000
  //       '^/api': ''
  //     },
  // 如果某些情况下跨域设置不生效，比如服务器读取了某些请求头，发现没有值也会报错，这里可以设置请求头
  //  "headers": {
  //     "Origin": "https://scrm.okii.com"
  //   }
  //   },
  // }
}
export default devServerConfig
