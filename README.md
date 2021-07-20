# 项目说明

## 关于技术栈

`typescript`+`react`+`webpack`

> 推荐使用`react` `hooks`函数式编程

## 项目配置说明

- 1、前端源码目录`src`，在引用`import`/`require`的时候可以使用`@/`来作为绝对引用
- 2、项目脚本目录说明：
  - `.vscode` `vscode`项目配置文件存放的地方
  - `.husky` `husky`项目配置文件存放的地方
  - `plugins`存放本地的`webpack`插件目录
  - `public`静态文件目录，这个目录下的文件不参与构建，会自动复制到构建目录下。开发环境是可以直接访问的
  - `scripts`存放开发用的脚本及工具类目录
  - `templates`存放多页面构建时的入口模板目录
  - `.env`是作为环境变量的定义，详细见`dot-env`，优先级说明`.env.local`>`.env.[BUILD_MODE]`>`.env`
  - `xxx.config.{js,ts}`配置文件，为方便维护，抽取了`devServer`、`workbox`
  - `babel.config.js`babel 的配置文件，配置了`react-css-modules`、`styled-jsx`
  - `postcss.config.js`postcss 的配置文件，配置了 css 自适应功能，及其他 css 样式兼容问题
  - `devServer.config.ts`webpack dev server 的配置文件
  - `serviceWorker.config.ts`workbox 的配置文件，用于控制 service worker 相关
  - `tsconfig.json` ts 项目的配置文件
  - `tsconfig-for-webpack-config.json` 用于运行 ts-node 程序的，这样可以使用 ts 来写 node 程序，已经在`tsconfig.json`中的`ts-node`声明，使用效果一样，如果这种格式不行，使用`TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\"`，如：
    ```bash
    cross-env BUILD_MODE=production NODE_OPTIONS=\"--inspect\" TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack --progress
    ```
  - `typings.d.ts`类型定义的文件，解决 ts 提示错误问题，或者自定义的类型定义
  - `.eslintrc.js` eslint 的配置文件, 由于 eslint 在开发过程中很慢，所以不建议开启 webpack 的检查，考虑使用编辑器的提示来完成，这样可以很大的提升构建速度。再结合 gitlab 的 CI 检查，应该可以满足
  - `.prettierrc.js` prettier 的配置文件
  - `.editorconfig` 用来控制编辑器格式化的配置文件，一般跟`prettier`一样配置一个即可
  - `.yarnrc` 配置 yarn 的文件，这里主要是将默认的包库设置成内网自建的库
  - `webpack.config.ts` `webpack`的配置文件，配置项目的构建功能

## 功能点

- 1、已接入的文件支持：`.json5?`、`.m?[jt]sx?`、`.{css,less,postcss}`、`.{bmp,gif,jpe?g, png}`、`css-module`
- 2、样式文件支持：`styled-jsx`、`css-module`、`px2vw`
- 3、非开发环境支持自动将构建的文件上传到 cdn，详细见`plugins`
- 4、已加入`service-worker`相关功能
- 5、所有在 env 中申明的环境变量，在 webpack 的构建和程序中均可以使用
- 6、样式文件使用技巧：`.module.{css,less,postcss}`的文件会被当成模块化样式文件，`.response.xxx.{css,less,postcss}`的文件会被自动将`px`转化成`vw`(也可以自己配置转化成其他单位，详细见`postcss.config.js`)

## 源码目录`src`结构说明

- `main.tsx`入口文件
- 1、`components`组件目录
- 2、`config`配置文件目录，关于接口的配置，建议开发环境统一使用`/api`作为前端请求前缀，然后通过`devServer`来转发
- 3、`pages`页面文件目录
- 4、`assets`公共资源存放目录
- 5、`utils`公用函数目录
- 6、`themes`重写公共 UI 库的样式目录，不需要重写的话忽略

## 命令说明

- `npm run debug`开发模式下开启调试模式来调试 webpack 的构建过程，可以看到构建过程的全部
- `npm run build-debug`开启调试模式来调试 webpack 的构建过程，可以看到构建过程的全部
- `npm run start`正常的开发启动命令
- `npm run build-test`构建测试环境的命令
- `npm run build-prod`构建正式环境的命令
- `npm run build-api`通过 swagger 文档的 json 描述，自动生成接口请求，针对有很多接口的项目使用，可以通过 template 来修改默认的生成模板，详细见`scripts/codegen/api.template/`目录
- `npm run buid-theme`重写一些 UI 库的样式，这里会通过查找样式库的全部引用，构建生成新的样式文件。注意重写的样式写在`src/themes/`目录
- `npm run lint`代码检查，支持`.js,.ts,.jsx,.tsx`

## 常用的`vscode`插件

- `esbenp.prettier-vscode` 格式化插件`prettier`
- `ahmadalli.vscode-nginx-conf` `nginx`配置文件语法高亮和格式化
- `jerryhong.autofilename` 自动提示文件路径
- `aaron-bond.better-comments` 可以支持比较骚操作的注释显示
- `ms-ceintl.vscode-language-pack-zh-hans` 中文扩展
- `editorconfig.editorconfig` `.editorconfig`支持
- `dbaeumer.vscode-eslint` `eslint`插件
- `daghostman.vs-treeview` 在打开的文件左上角可以看到文件的树，比如函数、类、状态等
- `file-icons.file-icons` 对不同的文件在左侧项目栏里面显示不同的图标
- `qiu8310.minapp-vscode` 小程序的智能提示
- `mikestead.dotenv` `.env`的支持
- `stevencl.adddoccomments`添加 jsdoc 注释，当在函数上面使用/\*\*回车时，自动生成
- `obkoro1.korofileheader` 自动添加文件的注释
