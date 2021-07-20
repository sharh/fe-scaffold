module.exports = {
  //换行宽度
  printWidth: 80,
  // 不要使用tab格式的
  useTabs: false,
  // 结尾有分号
  semi: true,
  //如果有一个对象的属性需要引号，则全部属性都加引号
  quoteProps: "consistent",
  //多行换行后，末尾加逗号
  trailingComma: "all",
  bracketSpacing: true,
  //最后的>另起一行
  jsxBracketSameLine: false,
  arrowParens: "always",
  // 不要插入/** @format */这样的格式
  insertPragma: false,
  overrides: [
    {
      files: ".prettierrc",
      options: { parser: "json" },
    },
  ],
};
