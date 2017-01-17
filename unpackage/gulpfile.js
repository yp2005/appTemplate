var gulp = require('gulp');
var webserver = require('gulp-webserver');
// var webserver = require('gulp-connect');
var webpack = require('webpack');
// var gulpWebpack = require('gulp-webpack');
// var clean = require('gulp-clean');
// var named = require('vinyl-named')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var buildConfig = require('./build/webpack.prod.conf');
// var devConfig = require('./build/webpack.dev.conf');

var url = require('url');
var path = require('path');
var config = require('./config');
var utils = require('./build/utils');
var env = process.env.NODE_ENV === 'testing' ? require('./config/test.env') : config.build.env;
var projectRoot = path.resolve(__dirname, '');

// var appList = ['app'];

gulp.task('default', ['bundle'], function() {
    console.log('done');
});

// mock 的 webserver
var mockApi = require('./test/mock/mockApi');
var postparams = null;
var urlObj = null;
var mockApiGoods = require('./test/mock/mockApiGoods');
var mockApiSeller = require('./test/mock/mockApiSeller');
gulp.task('webserver', function() {
    gulp.src('./test/mock')
        .pipe(webserver({
            livereload: true,
            host:'192.168.2.66',
            directoryListing: {
                enable: true,
                path: 'market'
            },
            port: 8000,
            // 这里是关键！
            middleware: [
                (req, res, next) => {
                    setHeader(res, req);
                    urlObj = url.parse(req.url, true);
                    if (req.method === 'POST' || req.method === 'post') {
                        req.on('data', function(a) {
                            try{
                                postparams = JSON.parse(a);
                            }catch(e){
                                postparams = {};
                            }
                            mockApi(res, urlObj.pathname, postparams, next, req);
                        });
                    } else {
                        mockApi(res, urlObj.pathname, urlObj.query, next, req);
                    }
                }, (req, res, next) => {
                    if (req.method === 'POST' || req.method === 'post') {
                        mockApiGoods(res, urlObj.pathname, postparams, next, req);
                    } else {
                        mockApiGoods(res, urlObj.pathname, urlObj.query, next, req);
                    }
                }, (req, res, next) => {
                    if (req.method === 'POST' || req.method === 'post') {
                        mockApiSeller(res, urlObj.pathname, postparams, next, req);
                    } else {
                        mockApiSeller(res, urlObj.pathname, urlObj.query, next, req);
                    }
                }
            ]
        }));
});

const setHeader = (res, req) => {
    // 设置跨域访问
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, reqStartTime, instance_id, access_token');
    res.setHeader('Access-Control-Expose-Headers', 'reqStartTime, instance_id, access_token');
    res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.setHeader('X-Powered-By', ' 3.2.1');
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    if (req.method === 'OPTIONS') {
        res.end('200'); /* 让options请求快速返回 */
        return;
    }
};

// 清空图片、样式、js
// gulp.task('clean', function() {
//    gulp.src(['../dist/'], {read: false})
//        .pipe(clean({force: true}));
// });

// gulp.task('bundle', function() {
//    return gulp.src('src/**/*.*')
//        .pipe(named())
//        .pipe(gulpWebpack(getConfig()))
//        .pipe(gulp.dest('../dist/'))
// })

// gulp.task('watch', function() {
//    return gulp.src(mapFiles(appList, 'js'))
//        .pipe(named())
//        .pipe(gulpWebpack(getConfig({watch: true})))
//        .pipe(gulp.dest('dist/'))
// })

/**
 * @private
 */
/* eslint-disable*/
function getConfig(opt) {
    var _config = {
        entry: {
            demo: './src/main.js'
        },
        output: {
            path: config.build.assetsRoot,
            filename: utils.assetsPath('js/[name].[chunkhash].js'),
            chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
        },
        resolve: {
            extensions: ['', '.js', '.vue'],
            fallback: [path.join(__dirname, './node_modules')],
            alias: {
                'src': path.resolve(__dirname, './src'),
                'assets': path.resolve(__dirname, './src/assets'),
                'component': path.resolve(__dirname, './src/component')
            }
        },
        resolveLoader: {
            fallback: [path.join(__dirname, './node_modules')]
        },
        devtool: config.build.productionSourceMap ? '#source-map' : false,
        module: {
            loaders: [{
                test: /\.vue$/,
                loader: 'vue'
            }, {
                test: /\.js$/,
                loader: 'babel',
                include: projectRoot,
                exclude: /node_modules/
            }, {
                test: /\.json$/,
                loader: 'json'
            }, {
                test: /\.html$/,
                loader: 'vue-html'
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }]
        },
        vue: {
            loaders: utils.cssLoaders({
                sourceMap: config.build.productionSourceMap,
                extract: true
            })
        },
        plugins: [
            // http://vuejs.github.io/vue-loader/workflow/production.html
            new webpack.DefinePlugin({
                'process.env': env
            }),
            // new webpack.optimize.UglifyJsPlugin({
            //   compress: {
            //     warnings: false
            //   }
            // }),
            new webpack.optimize.OccurenceOrderPlugin(),
            // extract css into its own file
            new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),
            // generate dist index.html with correct asset hash for caching.
            // you can customize output by editing /index.html
            // see https://github.com/ampedandwired/html-webpack-plugin
            new HtmlWebpackPlugin({
                filename: process.env.NODE_ENV === 'testing' ? 'index.html' : config.build.index,
                template: './src/index.html',
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
                },
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                chunksSortMode: 'dependency'
            }),

            // split vendor js into its own file
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function(module, count) {
                    // any required modules inside node_modules are extracted to vendor
                    return (
                        module.resource &&
                        module.resource.indexOf(
                            path.join(__dirname, './node_modules')
                        ) === 0
                    );
                }
            }),
            // extract webpack runtime and module manifest to its own file in order to
            // prevent vendor hash from being updated whenever app bundle is updated
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                chunks: ['vendor']
            })
        ]
    };
    if (!opt) {
        return _config;
    }
    for (var i in opt) {
        _config[i] = opt[i];
    }
    return _config;
}

/**
 * @private
 */
function mapFiles(list, extname) {
    return list.map(function(app) {
        return 'src/' + app + '.' + extname;
    });
}
/**
 * @private
 */
function myMapFiles() {
    return ['src/**/*.js', 'src/**/*.vue'];
}
