'use strict';
/*!
 * html头部模板化功能,头部抽出来了，实现了简单的继承扩展
 * 使用方法：
 *      1.在headtpl/head.tpl.js里面，添加页面头部代码
 *      2.在对应的html页面，插入 <tpl name="base"></tpl>
 * ps：弄了一个页面，用来整格式的，打开页面，把现在的头部代码剪切出来，然后放进页面，选择单引号，数组拼接，将生成的代码那这里来用
 * Author: liaoxm
 * Date: 2016-06-17
 */

// 基本每个页面都必须要用的 ，然后其他的页面可以在这个基础上进行扩展
const base = ['      <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />\n',
  '        <meta name="misapplication-tap-highlight" content="no"/>\n',
  '        <meta name="HandheldFriendly" content="true"/>\n',
  '        <meta name="MobileOptimized" content="320"/>\n',
  '        <link rel="stylesheet" type="text/css" href="../../static/css/mui.min.css" />\n',
  '        <link rel="stylesheet" type="text/css" href="../../static/css/jxdd.css" />\n',
  '	       <link rel="stylesheet" type="text/css" href="../../static/css/jxddadd.css" />\n',
  '        <link rel="stylesheet" type="text/css" href="../../static/css/iconfont.css" />\n',
  '        <link rel="stylesheet" type="text/css" href="../../static/css/override_mui.css" />\n',
  '        <script src="../../vendorMui.dll.js"></script>\n',
  '        <script src="../../vendors.dll.js"></script>\n',
  '        <script src="../../vendorUtils.dll.js"></script>\n',
  '        <script src="../../vendorVue.dll.js"></script>\n',
  '        <script src="../../static/js/mui.js"></script>\n'];

exports.tplArray = {
    'base': base.join(''),
    'withpicker': base.concat([
        '    <link rel="stylesheet" type="text/css" href="../../static/css/mui.picker.css">\n',
        '    <link rel="stylesheet" type="text/css" href="../../static/css/mui.poppicker.css">\n',
        '    <script src="../../static/js/mui.picker.js"></script>\n',
        '    <script src="../../static/js/mui.poppicker.js"></script>\n'
    ]).join('')
};
