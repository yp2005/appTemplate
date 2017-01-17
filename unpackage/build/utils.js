var path = require('path');
var config = require('../config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require('glob');
var fs = require('fs');

var encode = function(a) {
    var reg = /([^\w\d\s])/g;
    return a.replace(reg, '\\' + '$1');
};

exports.assetsPath = function(_path) {
    return path.posix.join(process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.build.assetsSubDirectoryOfDev, _path);
};

exports.cssLoaders = function(options) {
    options = options || {};
  // generate loader string to be used with extract text plugin
    function generateLoaders(loaders) {
        var sourceLoader = loaders.map(function(loader) {
            var extraParamChar;
            if (/\?/.test(loader)) {
                loader = loader.replace(/\?/, '-loader?');
                extraParamChar = '&';
            } else {
                loader = loader + '-loader';
                extraParamChar = '?';
            }
            return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '');
        }).join('!');

        if (options.extract) {
            return ExtractTextPlugin.extract('vue-style-loader', sourceLoader);
        } else {
            return ['vue-style-loader', sourceLoader].join('!');
        }
    }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
    return {
        css: generateLoaders(['css']),
        postcss: generateLoaders(['css']),
        less: generateLoaders(['css', 'less']),
        sass: generateLoaders(['css', 'sass?indentedSyntax']),
        scss: generateLoaders(['css', 'sass']),
        stylus: generateLoaders(['css', 'stylus']),
        styl: generateLoaders(['css', 'stylus'])
    };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
    var output = [];
    var loaders = exports.cssLoaders(options);
    for (var extension in loaders) {
        var loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            loader: loader
        });
    }
    return output;
};

/**
 * 入口文件处理方法
 * @param {String} globPath  路径，支持正则
 * 这里也可以处理任意层级目录，鉴于规范，直接定义成固定层级
 * 返回路径对象
 * @public
 */
exports.getEntry = function(globPath) {
    var entries = {};
    var tmp1 = '';
    var tmp = '';
    var pathname = '';

    glob.sync(globPath).forEach(function(entry) {
        tmp1 = entry.split('/');
        tmp = entry.split('/').splice(-3);
        if (tmp1[3] === tmp[0]) {
            pathname = tmp.splice(0, 1) + '/' + tmp.splice(0, 1); // 正确输出js和html的路径
        } else {
            pathname = tmp1[3] + '/' + tmp.splice(0, 1) + '/' + tmp.splice(0, 1); // 正确输出js和html的路径
        }
        entries[pathname] = entry;
    });
  // 处理首页
  // entries['index'] = './src/index.js'
  // console.log('getEntry:'+JSON.stringify(entries))
    return entries;
};

/**
 * 替换指定目录下的文件里的字符串
 * @param {String} oldtxt 需要替换的字符串
 * @param {String} newtxt 新的字符串
 * @param {String} fileType 文件类型，默认是html
 * @param {String} dir 进行处理的目录，会递归遍历改目录下的所有文件
 * @public
 */
exports.replaceTxt = function(oldtxt, newtxt, fileType, dir) {
    var _dir = path.join(path.resolve(__dirname, '../'), dir);
    var reg = _dir + '/**/*.' + (fileType === '' ? 'html' : fileType);
    glob(reg, {
        nodir: true
    }, function(err, files) {
        if (err) {
            throw err;
        } else {
            for (var i = 0; i < files.length; i++) {
                (function(i) {
                    fs.readFile(files[i], 'utf8', function(er, data) {
                        if (er) {
                            throw er;
                        }
                        var pattern = new RegExp(encode(oldtxt), 'g');
                        if (!pattern.test(data)) {
                            return;
                        }
                        fs.writeFile(files[i], data.replace(pattern, newtxt), function(error) {
                            if (error) {
                                throw error;
                            }
            //	            console.log("match and success --- "+files[i])
                        });
                    });
                })(i);
            }
        }
    });
};

/**
 * 替换指定目录下的文件里的字符串
 * @param {String} configPath 配置文件路径
 * @param {String} dir 需要处理的目录
 * @public
 */
exports.replaceTxtConfig = function(configPath, dir) {
    configPath = path.resolve(__dirname, configPath);
    var config = require(configPath);
    var properties = config.props;
  // 文件类型
    var fileTypes = {
        'file.js': 'js',
        'file.css': 'css',
        'file.html': 'html',
        'file.vue': 'vue'
    };
    for (var prop in properties) {
        if (properties.hasOwnProperty(prop)) {
            for (var ft in fileTypes) {
                if (fileTypes.hasOwnProperty(ft)) {
                    this.replaceTxt(prop, properties[prop], fileTypes[ft], dir);
                }
            }
        }
    }
};

/**
 * html文件里的url处理，webpack生成的html头部，层级不够，这里今天添加
 * @param {String} dir 处理的目录
 * @public
 */
exports.replaceIndexUrl = function(dir) {
  // replaceFile('../','./',dir + '/index.html')//app的首页不需要，直接在发布时指定即可
  // 修复static目录层级
    this.replaceTxt('../static', '../../static', '', dir + '/buyer');
    this.replaceTxt('../static', '../../static', '', dir + '/seller');
    this.replaceTxt('../static', '../../static', '', dir + '/commonpage');
};
/**
 * 在文件里进行字符串替换
 * @param {String} oldStr   旧值
 * @param {String} newStr   新值
 * @param {String} fileName 文件名
 * @private
 */
/* eslint-disable no-unused-vars */
const replaceFile = function(oldStr, newStr, fileName) {
    var p = path.join(path.resolve(__dirname, '../'), fileName);
  //  console.log('p:'+p)
    fs.readFile(p, 'utf8', function(er, data) {
        if (er) {
            throw er;
        }
        var pattern = new RegExp(encode(oldStr), 'g');
        console.log('pattern:' + pattern);
        if (!pattern.test(data)) {
            return;
        }
        fs.writeFile(p, data.replace(pattern, newStr), function(error) {
            if (error) {
                throw error;
            }
        });
    });
};

/**
 * html文件头部替换
 * @param {String} dir 存放html文件的目录
 * @public
 */
exports.replHead = dir => {
    let oldtxt = '';
    let newtxt = '';
    dir = dir || '../dist';
  // 指定模板位置
    let filePath = path.resolve(__dirname, '../src/headtpl/head.tpl.js');
  // 模板组
    let tplArray = require(filePath).tplArray;
  // 循环读取模板
    for (let tpl in tplArray) {
    // 模板在页面里的key
        oldtxt = '<tpl name="' + tpl + '"></tpl>';
    // 模板内容
        newtxt = tplArray[tpl];
    //    console.log(oldtxt+':::'+newtxt+'  :::  '+tplArray)
        this.replaceTxt(oldtxt, newtxt, '', dir);
    }
};

/**
 * 调整img标签，增加onerror处理函数，目前仅仅处理了js文件里面的img标签，html文件暂时不不需要处理
 * @type {[type]}
 */
exports.replaceImg = dir => {
    dir = dir || '../dist';
    let oldtxt = '<img';
    let configPath = path.resolve(__dirname, '../config');
    var config = require(configPath);
    var newtxt = oldtxt + '  ' + config.replaceImg.imgContext;
//  console.log('newtxt:' + newtxt);
    this.replaceTxt(oldtxt, newtxt, 'js', dir);
// this.replaceTxt(oldtxt, newtxt, '', dir);
};

/**
 * [description] 文件复制，排除svn相关文件
 * @param  {[type]}   src      [源路径]
 * @param  {[type]}   dist     [目的路径]
 * @param  {Function} callback [回调函数]
 * @return {[void]}            [无返回]
 */
const copyDir = (src, dist, callback) => {
  // dist = path.join(path.resolve(__dirname, '../'), dist)
  // console.log('dist', dist);
    fs.access(dist, function(err) {
        if (err) {
      // 目录不存在时创建目录
            fs.mkdirSync(dist);
        }
        _copy(null, src, dist);
    });

    var _copy = (err, src, dist) => {
        if (err) {
            callback(err);
        } else {
            fs.readdir(src, function(err, paths) {
                if (err) {
                    callback(err);
                } else {
                    paths.forEach(function(path) {
                        var _src = src + '/' + path;
                        var _dist = dist + '/' + path;
            //          console.log('src', src);
                        if (_src.indexOf('.svn') !== -1) {
                            return false;
                        }
                        fs.stat(_src, function(err, stat) {
                            if (err) {
                                callback(err);
                            } else {
                // 判断是文件还是目录
                                if (stat.isFile()) {
                  //                console.log('_src', _src);
                                    fs.writeFileSync(_dist, fs.readFileSync(_src));
                                } else if (stat.isDirectory()) {
                  // 当是目录是，递归复制
                                    copyDir(_src, _dist, callback);
                                }
                            }
                        });
                    });
                }
            });
        }
    };
};

exports.copyDir = copyDir;
