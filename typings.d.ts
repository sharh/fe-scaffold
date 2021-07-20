/// <reference types="react" />
/*
 * @Author: Mwing
 * @since: 2021-07-06 11:54:10
 * @lastTime: 2021-07-15 15:04:35
 * @LastAuthor: Mwing
 * @message:
 * @FilePath: \scrm-activity\fe-scaffold\typings.d.ts
 */
declare namespace React {
  export interface HTMLAttributes<T> extends React.HTMLAttributes<T> {
    // 申明一个styleName属性，详细见
    styleName?: string;
    jsx?: boolean;
  }
  export interface StyleHTMLAttributes<T> extends React.StyleHTMLAttributes<T> {
    // 申明jsx属性
    jsx?: boolean;
    // global属性,标识这个style的样式是全局的,否则是局部的
    global?: boolean;
  }
}

declare module "*.json";
declare module "*.svg";
declare module "*.less" {
  const resource: { [key: string]: string };
  export = resource;
}

// declare webpack plugin module;
declare module "pnp-webpack-plugin";
declare module "mini-css-extract-plugin";
declare module "css-minimizer-webpack-plugin";
declare module "copy-webpack-plugin";
declare module "json-minimizer-webpack-plugin";
