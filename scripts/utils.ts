/*
 * @Author: Mwing
 * @since: 2021-07-06 09:24:32
 * @lastTime: 2021-07-12 17:27:55
 * @LastAuthor: Mwing
 * @message:
 * @FilePath: \fe-scaffold\scripts\utils.ts
 */
import { cosmiconfigSync, OptionsSync } from "cosmiconfig";
type CosmiconfigResult<T> =
  | {
      config: T;
      filepath: string;
      isEmpty?: boolean;
    }
  | undefined;
/**
 * 获取配置文件
 * @param moduleName 模块名称
 * @param options 参数，参考cosmiconfig
 * @returns
 */
export function getConfig<T = any>(moduleName: string, options?: OptionsSync) {
  return cosmiconfigSync(moduleName, {
    searchPlaces: [
      "package.json",
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yaml`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `.${moduleName}rc.cjs`,
      `${moduleName}.config.js`,
      `${moduleName}.config.cjs`,
      `${moduleName}rc.ts`,
      `${moduleName}.config.ts`,
    ],
    ...options,
    loaders: {
      ".ts": (filepath: string) => {
        require("ts-node/register/transpile-only");
        const result = require(filepath);
        // console.log(result)
        return result.default ?? result;
      },
    },
  }).search() as CosmiconfigResult<T>;
}
