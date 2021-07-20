/*
 * @Author: Mwing
 * @since: 2021-07-08 09:32:02
 * @lastTime: 2021-07-15 17:19:51
 * @LastAuthor: Mwing
 * @message:
 * @FilePath: \scrm-activity\fe-scaffold\serviceWorker.config.ts
 */

/**
 * Which Plugin to Use
  1、GenerateSW(这个模式不需要设置什么，自动生成文件加入缓存)
  The GenerateSW plugin will create a service worker file for you and add it to the webpack asset pipeline.

  1.1、When to use generateSW
  You want to precache files.
  You have simple runtime configuration needs (e.g. the configuration allows you to define routes and strategies).

  1.2、When NOT to use generateSW
  You want to use other Service Worker features (i.e. Web Push).
  You want to import additional scripts or add additional logic.

  2、InjectManifest(这个模式由自己控制缓存)
  The InjectManifest plugin will generate a list of URLs to precache and add that precache manifest to an existing service worker file. It will otherwise leave the file as-is.

  2.1、When to use injectManifest
  You want more control over your service worker.
  You want to precache files.
  You have more complex needs in terms of routing.
  You would like to use your service worker with other API's (e.g. Web Push).

  2.2、When NOT to use injectManifest
  You want the easiest path to adding a service worker to your site.
 */
import type WorkboxPlugin from "workbox-webpack-plugin";
const GenerateSWOptions: WorkboxPlugin.GenerateSWOptions = {
  // these options encourage the ServiceWorkers to get in there fast
  // and not allow any straggling "old" SWs to hang around
  clientsClaim: true,
  skipWaiting: true,
  // 引入远程的文件，这里可以把已经写好的放进来
  importScripts: ['serviceworker.custom.js'],
  // 如果要注入自定义的serviceworker脚本，可以在webpack配置里面加个entry，然后这里写entry的名称就可以了
  // 如entry: {customServices: 'xxxx.ts'}，则可以把customServices写到下面
  importScriptsViaChunks: [],
  // cacheId: '',
  cleanupOutdatedCaches: true,
  inlineWorkboxRuntime: true,
  navigationPreload: true,
  // 排除热更新的文件，不然开发环境无法热更新了
  exclude: [/hot-update\.(js|json)/, /\/sockjs-node\//, /serviceworker\.custom\.js/, /\.html|(https?:\/\/[^?#.]+(\/|#|\?)([?#]?[^?#./]*)$)/],
  runtimeCaching: [
    {
      // html文件优先使用网络缓存，一般这部分是没有hash值的，防止入口被缓存，也可以缓存这样没有网络也是可以访问的
      urlPattern: /\.html|(https?:\/\/[^?#.]+(\/|#|\?)([?#]?[^?#./]*)$)/,
      handler: 'NetworkFirst',
      options: {
        networkTimeoutSeconds: 300,
        cacheName: "html-caches",
        backgroundSync: {
          name: 'html-cache-sync',
          options: {
            maxRetentionTime: 300
          }
        },
        // 过期时间30分钟
        expiration: {
          maxAgeSeconds: 300
        },
        cacheableResponse: {
          statuses: [200, 304, 206],
          headers: {
            'Content-Type': 'text/html; charset=UTF-8',
            'content-type': 'text/html; charset=utf-8'
          }
        }
      }
    },
    {
      // 打包的文件，优先使用缓存，这部分基本都是不变的
      urlPattern: /\/\/pinpai-portal-rs\.eebbk\.net\//,
      handler: 'CacheFirst',
      options: {
        cacheName: "cdn-caches",
        backgroundSync: {
          name: 'cdn-cache-sync',
          options: {
            maxRetentionTime: 3
          }
        },
        expiration: {
          // cdn地址都缓存7天
          maxAgeSeconds: 10080
        },
        cacheableResponse: {
          statuses: [200, 304, 206],
        }
      }
    },
    {
      // 打包的文件，优先使用缓存，这部分基本都是不变的
      urlPattern: /\/chunks\/|vendors/,
      handler: 'CacheFirst',
      options: {
        cacheName: "chunks-caches",
        backgroundSync: {
          name: 'chunks-cache-sync',
          options: {
            maxRetentionTime: 3
          }
        },
        expiration: {
          maxAgeSeconds: 300
        },
        cacheableResponse: {
          statuses: [200, 304, 206],
        }
      }
    },
    {
      urlPattern: /\/api/,
      handler: 'NetworkFirst',
      options: {
        cacheName: "api-caches",
        networkTimeoutSeconds: 300,
        expiration: {
          maxAgeSeconds: 300
        },
        backgroundSync: {
          name: 'api-cache-sync',
          options: {
            maxRetentionTime: 3
          }
        },
        cacheableResponse: {
          statuses: [200, 304, 206],
        }
      }
    }
  ]
  // swDest: 'serviceworker.js'
};
export default GenerateSWOptions
