var replaceTxt = require('./utils');
// 读取配置文件，进行替换
replaceTxt.replaceTxtConfig('../config', '../dist');
// 调整src下面的静态文件路径
// replaceTxt.replaceTxtConfig('../config','./src')
