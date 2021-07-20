/*
 * @Author: Mwing
 * @since: 2021-02-05 15:03:11
 * @lastTime: 2021-07-15 17:42:09
 * @LastAuthor: Mwing
 * @message:
 * @FilePath: \scrm-activity\fe-scaffold\scripts\theme\theme.js
 */
const less = require('less');
const globby = require('globby');
const fs = require('fs');
const path = require('path');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
let autoprefixPlugin = new LessPluginAutoPrefix({
  browsers: ['last 2 versions']
});
var NpmImportPlugin = require('less-plugin-npm-import');
var LessPluginGlob = require('less-plugin-glob');
const workdir = path.resolve(__dirname, '../..')
// 获取全部的样式文件
const lessFiles = globby.sync(['src/themes/**/*.less', '!**/*.common.less'], {
  cwd: workdir
});

function log(action, data) {
  console.log(`theme builder: ================>${action}: `, data);
}
log('load theme files', lessFiles);

const dist = path.resolve(workdir, 'public/theme');
// 目录不存在的话创建一个新的目录
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}
(async () => {
  const theme = {
    theme: []
  };
  for (let lessFilePath of lessFiles) {
    let lessContent = fs.readFileSync(path.resolve(workdir, lessFilePath), 'utf-8');
    log('start rendering "' + lessFilePath);
    try {
      // 渲染样式文件
      let renderContent = await less.render(lessContent, {
        paths: [path.resolve(workdir, 'node_modules'), path.resolve(workdir, 'src/themes/')],
        javascriptEnabled: true,
        math: 'always',
        // 如果在样式文件中有import '~antd.less'，这种是表示引用了node_module目录下的
        plugins: [autoprefixPlugin, new NpmImportPlugin({
          prefix: '~'
        }), LessPluginGlob],
      });
      let renderName = lessFilePath.match(/([^/]*)\.less/)[1];
      let renderPath = path.resolve(dist, renderName + '.css');
      fs.writeFileSync(renderPath, renderContent.css);
      let _themeObj = {
        theme: renderName,
        fileName: renderName + '.css',
      };
      theme.theme.push(_themeObj);
      log('"' + lessFilePath + '" rendered in ' + renderPath, _themeObj);
    } catch (error) {
      console.log(error);
      log('"' + lessFilePath + '" error', error);
      throw error;
    }
  }
  if (theme.theme.length) {
    fs.writeFileSync(path.resolve(workdir, 'src/themes/theme.json'), JSON.stringify(theme, null, 2));
  }
})();
