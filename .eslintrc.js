/*
 * @Author: HuMwing
 * @since: 2020-05-14 12:06:45
 * @lastTime: 2021-07-15 14:33:17
 * @LastAuthor: Mwing
 * @message: eslint配置文件
 */

module.exports = {
  root: true,
  settings: {
    fix: false,
    cache: true,
    react: {
      createClass: "createReactClass", // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: "React", // Pragma to use, default to "React"
      version: "detect", // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      flowVersion: "0.53", // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      {
        property: "freeze",
        object: "Object",
      },
      {
        property: "myFavoriteWrapper",
      },
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      {
        name: "Link",
        linkAttribute: "to",
      },
    ],
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    // 如果是ts项目，必须要提供，配合@typescript-eslint/parser一起使用
    project: ["./tsconfig.json"],
    fix: true,
    cache: true,
    failOnError: true,
    emitWarning: true,
    emitError: true,
    eslintPath: require.resolve("eslint"),
    formatter: require.resolve("eslint-formatter-pretty"),
    resolvePluginsRelativeTo: __dirname,
    // es2015
    ecmaVersion: 6,
    sourceType: "module",
    requireConfigFile: false,
    ecmaFeatures: {
      // 可以解析tsx、jsx等格式的文件
      jsx: true,
      impliedStrict: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
  // 设置全局变量，比如通过cdn链接引入的全局变量，在这里申明就不会提示报错了
  globals: {
    wx: "writable",
  },
  rules: {
    // 这里的规则将于extends里面的并行一起，如extends里面
    "no-restricted-globals": ["error", "event", "fdescribe"],
    // "@typescript-eslint/no-unsafe-member-access": 0,
    // "import/no-anonymous-default-export": 0,
  },
  // "prettier"来自eslint-plugin-prettier
  // @typescript-eslint 来自@typescript-eslint/eslint-plugin
  // html来自eslint-plugin-html
  plugins: ["prettier", "@typescript-eslint"],
  // "plugin:react/recommended"来自eslint-plugin-react
  // "react-app"来自eslint-config-react-app
  // "eslint:recommended"来自eslint，规则列表https://eslint.org/docs/rules/，打钩的标识在eslint:recommended中
  extends: [
    "eslint:recommended", // 默认eslint自带的规则
    "plugin:react/recommended", // eslint-plugin-react推荐的react的规则
    // "plugin:@typescript-eslint/recommended", // 来自@typescript-eslint/eslint-plugin
    // "plugin:@typescript-eslint/recommended-requiring-type-checking", // 来自@typescript-eslint/eslint-plugin
    // 来自eslint-plugin-import
    // "plugin:import/recommended",
    // 来自eslint-plugin-import
    "plugin:import/typescript",
    // 来自eslint-config-prettier，把一些不必要的规则禁用，因为prettier可以修复，注意前提是使用了prettier
    "prettier",
  ],
  // overrides: [],
};
