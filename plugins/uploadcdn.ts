/*
 * @Author: Mwing
 * @since: 2021-07-12 10:43:46
 * @lastTime: 2021-07-12 17:00:22
 * @LastAuthor: Mwing
 * @message:
 * @FilePath: \fe-scaffold\plugins\uploadcdn.ts
 */
import webpack from 'webpack';
import axios from "axios";
import globby from "globby";
import FormData from "form-data";
import path from "path";
import fs from "fs";
import chalk from "chalk";


const log = (...args: any) => {
  console.log('[Uploadcdn]', ...args)
}


export default class Uploadcdn {
  options: any = {};
  constructor(options: {
    // cdn前缀
    prefix: string,
    // 服务器上传地址
    uploadUrl: string
  }) {
    log('[init]', options)
    this.options = options;
  }
  // 不依赖webpack的构建方式
  async uploadByDirectory(distDir: string): Promise<any> {
    const buildDir = path.resolve(distDir);
    const allDirects = globby.sync(['**/*'], {
      onlyDirectories: true,
      cwd: buildDir
    });
    const distFileMap = new Map();
    // 当前目录下的也要算进去
    const buildFiles = globby.sync(['**/*'], {
      onlyFiles: true,
      objectMode: true,
      dot: false,
      deep: 1,
      cwd: path.resolve(buildDir)
    });
    if (buildFiles.length) {
      distFileMap.set('./', buildFiles)
    }
    // 当前目录下的目录
    allDirects.forEach((dir) => {
      const buildFiles = globby.sync(['**/*'], {
        onlyFiles: true,
        objectMode: true,
        dot: false,
        deep: 1,
        cwd: path.resolve(buildDir, dir)
      });
      distFileMap.set(dir, buildFiles)
    })
    const requestForms: FormData[] = [];
    if (!distFileMap.size) {
      log(chalk.cyan('没有需要上传的文件！'));
      return Promise.resolve();
    }
    log(chalk.cyan('由于需要维持publicPath的相对路径，这里分目录上传，这样上传完成的都是相对路径'));
    distFileMap.forEach((buildFiles, dir) => {
      const form = new FormData();
      let prefix = (this.options.prefix + '/' + dir + '/').replace(/\.\//gim, '/').replace(/\/{2,}/gim, '/');
      form.append('prefix', prefix);
      log(chalk.cyan('文件目录：'), dir);
      log(chalk.cyan('CDN前缀：'), prefix);
      buildFiles.forEach((file: any) => {
        log(chalk.cyan('文件列表：'), path.resolve(dir, file.name));
        // 需要加上filename，否则解析不成功！
        form.append('files', fs.createReadStream(path.resolve(buildDir, dir, file.name)), { filename: file.name })
      })
      requestForms.push(form)
    })
    return new Promise((resolve, reject) => {
      Promise.all(requestForms.map((form) => this.doUpload(form))).then(resolve).catch(reject)
    })
  }
  // 所有文件都是绝对路径，如果重名的话，会被覆盖
  async uploadNormal(distDir: string) {
    const form = new FormData();
    form.append('prefix', this.options.prefix);
    const buildDir = path.resolve(distDir);
    const buildFiles = globby.sync(['**/*'], { cwd: buildDir });
    log(chalk.cyan('文件列表：'), buildFiles);
    buildFiles.forEach((filePath) => {
      // 需要加上filename，否则解析不成功！
      form.append('files', fs.createReadStream(path.resolve(buildDir, filePath)), { filename: filePath.split('/').pop() })
    })
    return this.doUpload(form)
  }
  /**
   * @deprecated 暂时没有用
   * @param Compilation
   * @returns
   */
  async uploadcdn(Compilation: webpack.Compilation) {
    const form = new FormData();
    form.append('prefix', this.options.prefix);
    Object.keys(Compilation.assets).forEach((key) => {
      // Compilation.assets[key].buffer()这个方法读取不了
      form.append('files', fs.createReadStream(Compilation.assets[key].buffer()), { filename: key })
    })
    return this.doUpload(form)
  }
  private async doUpload(form: FormData) {
    log(chalk.cyan('上传中...'))
    return await axios.post(this.options.uploadUrl, form, {
      headers: form.getHeaders()
    }).then((res) => {
      if (res.data.code === '000001') {
        log(chalk.cyan('上传成功：'))
        res.data.data.successList.forEach((item: any) => {
          log(chalk.green('[success]'), chalk.green(item.url))
        });
        res.data.data.errorList.forEach((item: any) => {
          log(chalk.red('[error]'), chalk.red(item.fileName))
        });
      } else {
        log(chalk.cyan('上传失败：'))
        throw res.data;
      }
    }).catch((e) => {
      log(chalk.red('请求失败：'), e)
      throw e;
    })
  }

  apply(compiler: webpack.Compiler) {
    // async call的方式，回调callback标识执行完成
    // compiler.hooks.afterEmit.tapAsync("Uploadcdn-afterEmit", (Compilation: webpack.Compilation, callback) => {
    //   log('[afterEmit]', Compilation.assets)
    //   callback()
    // })
    compiler.hooks.afterEmit.tapPromise("Uploadcdn-afterEmit-promise", (Compilation: webpack.Compilation) => {
      log('[afterEmit]', '开始上传CDN')
      return this.uploadByDirectory(Compilation.outputOptions.path as string);
    })
  }
}
