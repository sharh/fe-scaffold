/*
 * @Author: Mwing
 * @since: 2021-07-09 14:58:52
 * @lastTime: 2021-07-12 21:05:48
 * @LastAuthor: Mwing
 * @message: 这是一个示例的serviceworker文件
 * @FilePath: \fe-scaffold\public\serviceworker.test.js
 */
// var CACHE_NAME = 'my-site-cache-v1';
// var urlsToCache = [
//   '/',
//   '/styles/main.css',
//   '/script/main.js'
// ];
const log = (...msg) => {
  console.log("[test servicework]", ...msg);
};
self.addEventListener("install", function (event) {
  log("install", event);
  // Perform install steps
  // event.waitUntil(
  //   caches.open(CACHE_NAME)
  //   .then(function (cache) {
  //     console.log('Opened cache');
  //     return cache.addAll(urlsToCache);
  //   })
  // );
});

self.addEventListener("error", function (event) {
  log("error", event);
});
self.addEventListener("fetch", function (event) {
  log("fetch", event.request.url);
});

self.addEventListener("message", function (event) {
  log("message", event);
});
