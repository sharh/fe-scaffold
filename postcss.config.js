/*
 * @Author: HuMwing
 * @since: 2020-05-13 17:34:41
 * @lastTime: 2021-07-08 10:55:18
 * @LastAuthor: Mwing
 * @message:
 */
module.exports = (api) => {
  // `api.file` - path to the file，资源的路径，如import './main.less'，那api.file就是这个实际路径
  // `api.mode` - `mode` value of webpack, please read https://webpack.js.org/configuration/mode/
  // `api.webpackLoaderContext` - loader context for complex use cases
  // `api.env` - alias `api.mode` for compatibility with `postcss-cli`
  // `api.options` - the `postcssOptions` options
  // console.log('postcssOptions', api)
  const config = {
    // parser: "postcss", //使用postcss作为解析器
    // ident: "css",
    plugins: [
      // 如果发生错误的话直接中断，给出更好的错误提示
      "postcss-fail-on-warn",
      "postcss-flexbugs-fixes",
      ["postcss-preset-env", {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
      }],
      "postcss-normalize",
      'postcss-nested',
      'precss',
      ["postcss-cssnext", {
        browserslist: ["since 2014"]
      }]
    ].filter(Boolean),
  }
  if (!/node_modules/i.test(api.file) && /\.response\./.test(api.file)) {
    config.plugins.push(["postcss-pixel-to-viewport", {
      //添加postcss-pixel-to-viewport插件
      // 转换后的单位是，x/viewportWidth * 100， 如果将viewportUnit改成rem的话，相应的只需要设置rootfontSize=window.innerWidth/100px即可
      viewportWidth: 750,
      // 如果单位是vw的话，不需要设置rootfontSize
      viewportUnit: 'vw',
      propertyBlacklist: [],
      minPixelValue: 2,
      enableConvertComment: 'on',
      // 不转换
      disableConvertComment: 'off',
      mediaQuery: false
    }])
  }
  return config;
};
