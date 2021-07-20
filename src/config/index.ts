const config = {
  development: {
    /** @property {string} apiBase 接口请求的基础，在调用接口的时候直接使用/apixxx/xxx这样即可 */
    apiBase: "https://www.baidu.com",
    env: process.env.BUILD_ENV,
    /** @property {string} wxworkAlertName 在企业微信提醒的名称，注意需要先注册 */
    appName: "",
    /** @property {string} bigDataModuleName 大数据埋点的模块名，在大数据注册先 */
    bigDataModuleName: "",
  },
  test: {
    /** @property {string} apiBase 接口请求的基础，在调用接口的时候直接使用/apixxx/xxx这样即可 */
    apiBase: "https://www.baidu.com",
    env: process.env.BUILD_ENV,
    /** @property {string} wxworkAlertName 在企业微信提醒的名称，注意需要先注册 */
    appName: "",
    /** @property {string} bigDataModuleName 大数据埋点的模块名，在大数据注册先 */
    bigDataModuleName: "",
  },
  production: {
    /** @property {string} apiBase 接口请求的基础，在调用接口的时候直接使用/apixxx/xxx这样即可 */
    apiBase: "https://www.baidu.com",
    env: process.env.BUILD_ENV,
    /** @property {string} wxworkAlertName 在企业微信提醒的名称，注意需要先注册 */
    appName: "",
    /** @property {string} bigDataModuleName 大数据埋点的模块名，在大数据注册先 */
    bigDataModuleName: "",
  },
};

export default config[process.env.BUILD_ENV as "production"];
