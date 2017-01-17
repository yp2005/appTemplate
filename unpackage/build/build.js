// https://github.com/shelljs/shelljs
require('shelljs/global');
process.env.NODE_ENV = 'production';

var path = require('path');
var config = require('../config');
var utils = require('./utils');
var ora = require('ora');
var webpack = require('webpack');
var webpackConfig = require('./webpack.prod.conf');

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
);

var spinner = ora('building for production...');
spinner.start();

// var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);
/* eslint-disable no-undef*/
rm('-rf', config.build.assetsRoot + '/buyer/*');
rm('-rf', config.build.assetsRoot + '/seller/*');
rm('-rf', config.build.assetsRoot + '/commonpage/*');
rm('-rf', config.build.assetsRoot + '/static/*');
// mkdir('-p', config.build.assetsRoot);
var src = path.join(path.resolve(__dirname, '../'), './src/static');
utils.copyDir(src, config.build.assetsRoot + '/static', (err) => {
    console.log('err', err);
});

webpack(webpackConfig, function(err, stats) {
    spinner.stop();
    if (err) {
        throw err;
    }
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');
});
