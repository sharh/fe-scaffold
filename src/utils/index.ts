import { GetCacheByKey, SaveCacheByKey } from "./storage";

/**
 * 解析url中的参数
 * @param url 路径
 * @returns 返回解析后的对象，注意重名的变量会被最后的一个覆盖，不会返回数组
 */
export function getQueryParams(url = location.href) {
  let locationStrs = url.match(/([^&/?#]+=[^&/?#]*)|[?&]([^&/?#]+)/gim) || [];
  locationStrs = locationStrs.join("/").replace(/[?&]/gim, "").split("/");
  var params = locationStrs;
  var qsObj: any = {};
  params.map(function (item: string) {
    var keyValues = item.split("=");
    qsObj[decodeURIComponent(keyValues[0])] = decodeURIComponent(keyValues[1]);
  });
  return qsObj;
}
/**
 * 获取解析后的参数
 * @param ignoreKeys 需要忽略的key
 * @returns 解析后的url参数与去除忽略key值的字符串
 */
export function getQueryParamsStr(
  ignoreKeys: string[] = ["state", "code", "appid"],
  url = location.href,
) {
  let query = getQueryParams(url);
  let queryStr = Object.keys(query)
    .filter((key) => ignoreKeys.indexOf(key) === -1)
    .map((key) => {
      return `${key}=${encodeURIComponent(query[key])}`;
    })
    .join("&");
  return {
    query,
    queryStr,
  };
}
export function concatQuery(query: any = {}, url = location.href) {
  url += /\?/.test(url) ? "&" : "?";
  url += Object.keys(query)
    .map((key) => {
      return key + "=" + query[key];
    })
    .join("&");
  return url;
}
/**
 * 移除url后面的某些参数
 * @param keys 需要移除的key
 * @param url 需要操作的url
 * @returns 返回操作后的url
 */
export function removeQuery(keys: string[] = [], url = location.href) {
  keys.forEach((key) => {
    url = url.replace(new RegExp(`${key}=[^&/?#]*&?`, "gim"), "");
  });
  return url;
}
/**
 * 获取唯一的随机值
 * @returns 唯一的随机值
 */
export function getClientKey() {
  const clientKey =
    GetCacheByKey("clientKey") ||
    (Date.now() + Math.random() * 10000000).toString(32);
  SaveCacheByKey({ key: "clientKey", res: clientKey, cache: -1 });
  return clientKey;
}
/**
 * 兑换2个值的前10位
 * @param str1  字符串1
 * @param str2  字符串2
 * @returns str1/str2
 */
export function cryptId(str1: string, str2: string) {
  let gindex = ("" + str2).slice(0, 10);
  let uindex = ("" + str1).slice(0, 10);
  str2 = ("" + str2).replace(gindex, uindex);
  str1 = ("" + str1).replace(uindex, gindex);
  return [str1, str2];
}
