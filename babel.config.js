/*
 * @Author: Mwing
 * @since: 2021-06-30 12:09:31
 * @lastTime: 2021-07-15 16:09:34
 * @LastAuthor: Mwing
 * @message:
 * @FilePath: \scrm-activity\fe-scaffold\babel.config.js
 */
module.exports = {
  // @babel/preset-typescript支持ts
  // @babel/preset-react支持tsx
  // @babel/preset-env最新的配置合计
  "presets": ["@babel/preset-env", "@babel/preset-typescript", "@babel/preset-react"],
  plugins: [
    // 支持import()这样的写法
    '@babel/plugin-syntax-dynamic-import',
    // babel-plugin-react-css-modules支持在react中使用cssModule，跟css-loader的差别感觉没有多大，
    // https://github.com/gajus/babel-plugin-react-css-modules
    [
      "react-css-modules",
      // 与css-loader配合，将styleName转化成className，这里的版本有点问题，需要使用css-loader@3.4.2，不然生成的className hash值不一样。暂时先锁定css-loader的版本号
      {
        // Enables hot reloading of CSS in webpack
        webpackHotModuleReloading: true,
        // Determines what should be done for undefined CSS modules (using a styleName for which there is no CSS module defined). Setting this option to "ignore" is equivalent to setting errorWhenNotFound: false in react-css-modules.
        handleMissingStyleName: "warn",
        // Refer to Custom Attribute Mapping（https://github.com/gajus/babel-plugin-react-css-modules#custom-attribute-mapping）
        // attributeNames: {
        //   // 可以使用scope="test" 会转换成 className="test"
        //   styleName: "className",
        // },
        // Whether to apply plugin
        // if no matching attributeNames found in the file
        // skip: true,
        // Allow multiple anonymous imports if styleName is only in one of them.
        autoResolveMultipleImports: true,
        // A RegExp that will exclude otherwise included files e.g., to exclude all styles from node_modules exclude: 'node_modules'
        exclude: "node_modules",
        // Refer to Generating scoped names. If you use this option, make sure it matches the value of localIdentName in webpack config. See this issue
        generateScopedName: "[local]_[hash:base64:5]",
        // 	Configure postcss syntax loaders like sugarss, LESS and SCSS and extra plugins for them.
        filetypes: {
          ".less": {
            syntax: "postcss-less",
          }
        },
      },
    ],
    // 支持styled-jsx写法 https://www.npmjs.com/package/styled-jsx
    ["styled-jsx/babel", {
      "optimizeForSpeed": true
    }],
    // react开发热更新用，配合[@pmmmwh/react-refresh-webpack-plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin#readme)使用
    process.env.BUILD_MODE === 'development' && 'react-refresh/babel',
  ].filter(Boolean)
}
