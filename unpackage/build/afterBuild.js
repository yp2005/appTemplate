require('shelljs/global');
var utils = require('./utils');
// static文件合并
/* eslint-disable no-undef */
cp('-R', '../static', '../dist');
rm('-rf', '../static');

// 文件头部替换
utils.replHead();

// 读取配置文件，进行替换
utils.replaceTxtConfig('../config', '../dist');

// 进行图片的error处理
utils.replaceImg();
