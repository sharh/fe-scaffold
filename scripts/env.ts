/*
 * @Author: Mwing
 * @since: 2021-06-25 10:26:12
 * @lastTime: 2021-07-07 11:33:32
 * @LastAuthor: Mwing
 * @message: 环境变量的顺序按：.env.local > .env.[mode] > .env
 * @FilePath: \scrm-activity\fe-scaffold\scripts\env.ts
 */
// const dotenv = require("dotenv");
import dotenv from "dotenv";
import { resolve } from "path";
// const {
//   resolve
// } = require('path');
let env = dotenv.config({
  path: resolve(process.cwd(), `.env`)
})
// 根据build_env来决定用来个env
let modeEnv = dotenv.config({
  path: resolve(process.cwd(), `.env.${process.env.BUILD_MODE || 'development'}`)
})
let localEnv = dotenv.config({
  path: resolve(process.cwd(), `.env.local`)
})
let finalConfig = Object.assign({}, env.parsed, modeEnv.parsed, localEnv.parsed);
// 注入到环境变量
Object.keys(finalConfig).forEach((key) => {
  process.env[key] = finalConfig[key]
})
// 将环境变量注入到前端代码可访问的部分
let define = Object.keys(process.env).filter((key) => /NODE_ENV|BUILD_|VITE_|APP_/.test(key)).reduce((env: any, key) => {
  env[`process.env`] = env[`process.env`] || {}
  env[`process.env`][key] = JSON.stringify(process.env[key])
  return env;
}, {})
// 优先使用.env里面定义的变量
define = Object.keys(finalConfig).reduce((env, key) => {
  env[`process.env`] = env[`process.env`] || {}
  env[`process.env`][key] = JSON.stringify(process.env[key])
  return env;
}, define)
// 导出
// module.exports = define;

export default define
