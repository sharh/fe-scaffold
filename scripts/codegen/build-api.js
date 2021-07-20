const codeGen = require("@humwing/swagger-code-gen");
const path = require("path");
const fs = require("fs");

const classTemplate = fs.readFileSync(
  path.resolve(__dirname, "./api.template/class.js.mustache"),
  "utf-8",
);
const methodTemplate = fs.readFileSync(
  path.resolve(__dirname, "./api.template/method.js.mustache"),
  "utf-8",
);
const apiList = ["common", "system"];
for (let name of apiList) {
  // 生成system的api
  codeGen.code2js({
    template: {
      class: classTemplate,
      method: methodTemplate,
    },
    // 传递给生成模板的变量
    mustache: {
      // 这里设置host，会合并到data里面去
      domain: `/${name}`,
    },
    filepath: path.resolve(__dirname, `../../src/services/api.${name}.js`),
    swaggerApiUrl: `http://www.baidu.com/${name}/v2/api-docs?group=api`,
  });
}
