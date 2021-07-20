/*
 * @Author: Mwing
 * @since: 2021-06-24 16:58:56
 * @lastTime: 2021-07-07 09:09:07
 * @LastAuthor: Mwing
 * @message: 
 * @FilePath: \scrm-activity\scrm-activity\src\common\utils\storage.ts
 */
type CacheModel = {
  res: any
  expires: number
}
type SaveCacheModel = {
  key: string
  cache: number
  res: any
}
const BUILD_ENV = process.env.BUILD_ENV || "development";
/**
 * 添加缓存，设置缓存时间
 * @param key 缓存的值
 * @param cache 需要缓存的时间，单位秒
 * @param res 需要缓存的数据
 */
export function SaveCacheByKey({ key, cache, res }: SaveCacheModel) {
  try {
    localStorage.setItem(BUILD_ENV + '-' + key, JSON.stringify({
      res,
      expires: cache < 0 ? cache : Date.now() + cache * 1000
    }))
  } catch (error) {
    console.log(error)
  }
}
/**
 * 获取缓存
 * @param key 存储ID
 */
export function GetCacheByKey(key: string) {
  try {
    let cache = localStorage.getItem(BUILD_ENV + '-' + key);
    let data: CacheModel = JSON.parse(cache as string) as unknown as CacheModel
    // 永久缓存
    if (data && data.res && data.expires < 0) {
      return data.res;
    }
    // 指定缓存时间的
    if (data && data.res && data.expires && data.expires > Date.now()) {
      return data.res
    } else {
      // 过期了就删除
      RemoveCacheByKey(key)
    }
  } catch (error) {
    console.log(error)
  }
  return null
}
/**
 * 删除缓存
 * @param key 缓存名称
 */
export function RemoveCacheByKey(key: string) {
  try {
    localStorage.removeItem(BUILD_ENV + '-' + key);
  } catch (error) {
    console.log(error)
  }
}

/**
 * 删除过期缓存
 * @param keyName 要指定删除的过期存储
 */
export function ClearExpiresCache(keyName?: string) {
  if (keyName) {
    deleteExpiredCache(BUILD_ENV + '-' + keyName)
  } else {
    for (let key in localStorage) {
      deleteExpiredCache(key)
    }
  }
}
/**
 * 根据缓存key删除缓存
 * @param key 缓存值
 */
export function deleteExpiredCache(key: string) {
  try {
    let data = GetCacheByKey(BUILD_ENV + '-' + key)
    if (data) {
      RemoveCacheByKey(BUILD_ENV + '-' + key);
    }
  } catch (error) {
    console.log(error)
  }
}
