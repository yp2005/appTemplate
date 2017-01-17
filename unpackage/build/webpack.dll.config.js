const path = require('path');
const webpack = require('webpack');
const config = require('../config');
const utils = require('./utils');
const HappyPack = require('happypack');

let pool = HappyPack.ThreadPool({
    size: config.build.happyPacklPoolSize
});
let env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env;


const commonPath = path.resolve(__dirname, '../src/common');
const apiPath = path.resolve(__dirname, '../src/api');
const libPath = path.resolve(__dirname, '../src/static/js');
const componentPath = path.resolve(__dirname, '../src/component');

module.exports = {
    entry: {
        vendors: [
            'vue', 'vue-validator', 'vue-router', 'cropper'
        ],
        vendorUtils: [
            commonPath + '/utils.js', commonPath + '/muiUtils.js', commonPath + '/logUtils.js', commonPath + '/cityData', commonPath + '/propUtils.js', commonPath + '/cacheUtils.js', commonPath + '/arrayUtils.js', commonPath + '/consts.js', apiPath + '/index.js'
        ],
        vendorMui: [
            libPath + '/mui.imageViewer.js', libPath + '/mui.indexedlist.js', libPath + '/mui.lazyload.img.js', libPath + '/mui.lazyload.js', libPath + '/mui.pullToRefresh.js', libPath + '/mui.pullToRefresh.material.js', libPath + '/mui.zoom.js', libPath + '/mui.previewimage.js'
        ],
        vendorVue: [
            componentPath + '/mui/Header.vue', componentPath + '/mui/NavTabbar.vue'
    // , componentPath + '/upload/UploadImage.vue', componentPath + '/SearchPage.vue'
        ]
    },
    resolve: {
        root: [path.resolve(__dirname, '../src')],
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, '../node_modules')]
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=babelJs',
                include: [path.resolve(__dirname, '../src')],
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.html$/,
                loader: 'vue-html'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[ext]')
                }
            }
        ]
    },
    vue: {
        loaders: utils.cssLoaders()
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new webpack.DllPlugin({
            path: path.join(config.build.assetsRoot, '[name]-mainfest.json'),
            name: '[name]_library'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new HappyPack({
            id: 'babelJs',
            threadPool: pool,
            loaders: ['babel?cacheDirectory=true'],
            verbose: true
        })
    ]
};
