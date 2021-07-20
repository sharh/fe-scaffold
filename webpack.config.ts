/*
 * @Author: Mwing
 * @since: 2021-06-30 11:46:09
 * @lastTime: 2021-07-15 17:06:07
 * @LastAuthor: Mwing
 * @message:
 * @FilePath: \scrm-activity\fe-scaffold\webpack.config.ts
 */
import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";
import PnpWebpackPlugin from "pnp-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import JsonMinimizerPlugin from "json-minimizer-webpack-plugin";
import WorkboxPlugin from "workbox-webpack-plugin";
import UploadcdnPlugin from "./plugins/uploadcdn";
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';
import type WebpackDevServer from "webpack-dev-server";
import env from "./scripts/env";
import { getConfig } from "./scripts/utils";

const devServerConfig = getConfig<WebpackDevServer.Configuration>('devServer')
const serviceWorkerConfig = getConfig<WorkboxPlugin.GenerateSWOptions>('serviceWorker')


const mode = process.env.BUILD_MODE || "production"
const isDev = mode === 'development';
console.log('当前构建模式：', mode);
console.log('workbox配置：', serviceWorkerConfig?.config);
// function main() {
//   let conf: any = serviceWorkerConfig?.config;
//   conf.then((res: any) => {
//     console.log(res)
//   })
// }
// main()
const isProd = !isDev;
const cdnPrefix = 'fe-scaffold/';
let publicPath = isDev ? "/" : "https://prefix.cdn.com/" + cdnPrefix;
// webpack-chain
const config: webpack.Configuration = {
  context: path.resolve(__dirname),
  entry: {
    // webpackHotDevClient: require.resolve('react-dev-utils/webpackHotDevClient'),
    // shared: ['react', 'react-dom', 'redux', 'react-redux'],
    // 入口文件，可以指定多个
    main: [path.resolve(__dirname, './src/main.tsx')]
  },
  output: {
    // 输出目录
    path: path.resolve(__dirname, 'dist'),
    // 输出的文件名格式配置
    filename: '[name].[contenthash:5].js',
    // Clean the output directory before emit.
    // 输出之前，清空构建目录
    clean: true,
    publicPath: publicPath,
    // https: //webpack.js.org/configuration/output/#outputenvironment
    // 输出环境配置，如果特殊可以修改这里
    // environment: {
    //   // The environment supports arrow functions ('() => { ... }').
    //   arrowFunction: true,
    //   // The environment supports BigInt as literal (123n).
    //   bigIntLiteral: false,
    //   // The environment supports const and let for variable declarations.
    //   const: true,
    //   // The environment supports destructuring ('{ a, b } = obj').
    //   destructuring: true,
    //   // The environment supports an async import() function to import EcmaScript modules.
    //   dynamicImport: false,
    //   // The environment supports 'for of' iteration ('for (const x of array) { ... }').
    //   forOf: true,
    //   // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
    //   module: false,
    // },
  },
  resolve: {
    // restrictions: [/\.(sass|scss|less|postcss|css|png|svg)$/],
    // aliasFields: ['browser'],
    // mainFiles: ['index', 'main'],
    // import XXX from ''的时候，webpack能解析的文件格式，默认.js/ts/tsx/jsx不需要写扩展名
    extensions: ['.js', '.json', '.wasm', '.tsx', '.ts', '.jsx', '.less', '.css', '.png', '.svg'],
    alias: {
      '@': '/src',
    },
    plugins: [
      PnpWebpackPlugin,
    ],
    // 如果有node_module之外的模块，可以在这里指定
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
  module: {
    // Loaders are evaluated/executed from right to left (or from bottom to top).
    // loader的顺序是从下往上（从rule的配置来说是从下往上，实际的加载来说是从右到左）
    rules: [
      // 配置mjs/mjsx/mts/mtsx/js/jsx/ts/tsx
      {
        test: /\.m?[jt]sx?/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: "babel-loader",
          // options: babelConfig.config
        }]
      },
      // json配置，json5-loader可以这样使用import {name} from 'test.json';支持直接结构json
      {
        test: /\.json5?/,
        exclude: /node_modules/,
        loader: 'json5-loader',
        options: {
          esModule: true,
        },
        type: 'javascript/auto',
      },
      // 图片配置
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve("url-loader"),
        options: {
          limit: 10000,
          name: "media/[name].[hash:8].[ext]",
        },
      },
      // .module.css，css-module支持，注意ident配置
      {
        test: /\.module\.(css|postcss)$/,
        // exclude: [/node_modules/],
        use: [
          isProd && MiniCssExtractPlugin.loader,
          isDev && "style-loader",
          {
            loader: "css-loader",
            ident: 'css-module',
            options: {
              importLoaders: 1,
              modules: {
                // Callback must return "local", "global", or "pure" values
                mode: "local",
                localIdentName: "[local]_[hash:base64:5]"
              },
            }
          },
          "postcss-loader"
        ].filter(Boolean)
      },
      // css
      {
        test: /\.(css|postcss)$/,
        exclude: [/node_modules/, /\.module\.(css|postcss)$/],
        use: [
          isProd && MiniCssExtractPlugin.loader,
          isDev && "style-loader",
          {
            loader: "css-loader",
            ident: 'css-normal',
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader"
        ].filter(Boolean)
      },
      // .module.less配置，主要是css-module的支持
      {
        test: /\.module\.less$/,
        exclude: [/node_modules/],
        use: [
          isProd && MiniCssExtractPlugin.loader,
          isDev && "style-loader",
          {
            loader: "css-loader",
            ident: 'less-module',
            options: {
              importLoaders: 2,
              modules: {
                // Callback must return "local", "global", or "pure" values
                mode: "local",
                localIdentName: "[local]_[hash:base64:5]"
              },
            }
          },
          "postcss-loader",
          'less-loader'
        ].filter(Boolean)
      },
      // 通用的less
      {
        test: /\.less$/,
        exclude: [/node_modules/, /\.module\.less$/],
        use: [
          isProd && MiniCssExtractPlugin.loader,
          isDev && "style-loader",
          {
            loader: "css-loader",
            ident: 'less-normal',
            options: {
              importLoaders: 2
            }
          },
          "postcss-loader",
          'less-loader'
        ].filter(Boolean)
      },
      // 配置svg，
      // 1、如果配置了file-loader：import svgUrl, { ReactComponent as Logo } from 'xxx.svg'来使用
      // 2、如果没有配置file-loader，则通过import Logo from 'xxx.svg'
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: /\.m?[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: {
          not: /\.m?[jt]sx?$/
        },
        use: ['@svgr/webpack', {
          loader: 'file-loader',
          options: {
            name: "media/[name].[hash:8].[ext]",
          }
        }],
      },
      // {
      //   // 未配置的文件走这里，匹配任意一个符合的
      //   oneOf: [
      //     {
      //       loader: require.resolve("file-loader"),
      //       // Exclude `js` files to keep "css" loader working as it injects
      //       // its runtime that would otherwise be processed through "file" loader.
      //       // Also exclude `html` and `json` extensions so they get processed
      //       // by webpacks internal loaders.
      //       exclude: [/\.(js|mjs|jsx|ts|tsx|less|css)$/, /\.html$/, /\.json$/],
      //       options: {
      //         name: "media/[name].[hash:8].[ext]",
      //       },
      //     },
      //   ]
      // }
    ]
  },
  plugins: [
    new UploadcdnPlugin({
      prefix: cdnPrefix,
      // 这里的链接换成自己的cdn上传链接地址
      uploadUrl: 'https://upload.cdn.com/uploadFile'
    }),
    // 复制public目录到webpack.out.path
    isProd && new CopyWebpackPlugin({
      patterns: [
        isProd && path.resolve(__dirname, "public"),
      ].filter(Boolean)
    }),
    isProd && new MiniCssExtractPlugin(),
    isProd && new CompressionPlugin(),
    // 配置简单的serviceworker，这里webpack构建的时候会自动生成相应的代码，参考根目录下的serviceworker.config.ts
    new WorkboxPlugin.GenerateSW(serviceWorkerConfig?.config),
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true,
      compilationSuccessInfo: {
        messages: ['构建成功！', isDev && '服务器地址：localhost'].filter(Boolean) as string[],
        notes: []
      },
      onErrors: function (severity, errors) {
        if (severity !== 'error') {
          return;
        }
        // You can listen to errors transformed and prioritized by the plugin
        // severity can be 'error' or 'warn'
        console.log('webpackError', errors)
      },
    }),
    // entry之后的文件变化是可以更新的，但是入口文件更新无法刷新，需要手动刷新，
    // 这个地方在入口文件加了module.hot，支持重新渲染整个app
    isDev && new ReactRefreshWebpackPlugin(),
    // 输出的html文件
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "templates/index.html"),
      inject: 'body',
      minify: {
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true
      }
    }),
    new webpack.IgnorePlugin({
      contextRegExp: /^\.\/locale$/,
      resourceRegExp: /moment$/
    }),
    new webpack.AutomaticPrefetchPlugin(),
    // 环境变量注入，这里使用process.env注入，这样其他的包可能会用到，详细见env
    new webpack.DefinePlugin({
      ...env,
    }),
    // new DashboardPlugin()
  ].filter(Boolean),
  optimization: {
    mangleExports: isProd ? 'size' : false,
    // mangleWasmImports: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    // flagIncludedChunks: true,
    // providedExports: true,
    // mergeDuplicateChunks: true,
    // usedExports: true,
    // concatenateModules: true,
    // sideEffects: 'flag',
    // emitOnErrors: false,
    // realContentHash: true,
    // innerGraph: true,
    // minimize: isProd,
    // nodeEnv: process.env.NODE_ENV,
    runtimeChunk: {
      name: 'runtime', //(entrypoint) => `runtime~${entrypoint.name}`,
    },
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩json
      new JsonMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          chunks: 'all',
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          filename: 'chunks/[name].[contenthash:5].js',
          priority: -10,
          maxSize: 300000,
          reuseExistingChunk: true,
        },
        commons: {
          chunks: 'all',
          name: 'commons',
          filename: 'chunks/[name].[contenthash:5].js',
          minChunks: 2,
          priority: -20,
          maxSize: 300000,
          reuseExistingChunk: true,
        },
      }
    }
  },
  // 设置成BUILD_MODE环境变量
  mode: mode as 'development',
  // 默认是web
  // target: ['web'],
  devtool: isDev ? 'eval' : false,
  devServer: {
    ...devServerConfig?.config
  },
  // watch: isDev,
  // watchOptions: {
  //   ignored: [/node_modules/],
  // },
  // https://webpack.js.org/configuration/externals/
  externals: {
    // 这样在html中引入了jquery的外部链接后，在源码中依然可以这样使用：import $ from 'jquery'
    // key是from对应的值，value是外部引入时，这个库在全局中的变量名，如jQuery注入后在window上会注入window.jQuery
    jquery: 'jQuery',
  },
  // 缓存配置
  cache: {
    // 使用硬盘的缓存，这样每次构建都能读取到。但是每次都要读取，也会有一些开销，devServer的资源暂时没有释放到硬盘，可能在开发时影响不大。
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, 'node_modules', '.webpack_build_caches'),
    // 缓存过期时间，毫秒，先缓存一年
    idleTimeout: 12 * 30 * 24 * 60 * 60 * 1000,
    // 不要存到内存
    maxMemoryGenerations: 0,
    profile: isProd,
  },
  // 编译时同时处理的模块数量，可能有内存大小限制
  parallelism: 500,
  // 影响文件系统的快照创建和验证
  snapshot: {
    // 告诉webpack不会改变的包路径，一般来说我们不会改变node_modules下面的包
    managedPaths: [path.resolve(__dirname, './node_modules')],
    immutablePaths: []
  },
  // web性能配置
  performance: {
    // 包超过最大值之后提示
    hints: 'warning'
  },
  // experiments: {
  //   lazyCompilation: !isProd,
  //   outputModule: false,
  // },
}
export default config
