var path = require('path');
var merge = require('webpack-merge');
var baseConfig = require('../../build/webpack.base.conf');
var utils = require('../../build/utils');
var webpack = require('webpack');
var projectRoot = path.resolve(__dirname, '../../');

var webpackConfig = merge(baseConfig, {
    // use inline sourcemap for karma-sourcemap-loader
    module: {
        loaders: utils.styleLoaders()
    },
    devtool: '#inline-source-map',
    vue: {
        loaders: {
            js: 'isparta'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../../config/test.env')
        })
    ]
});

// no need for app entry during tests
delete webpackConfig.entry;

// make sure isparta loader is applied before eslint
webpackConfig.module.preLoaders = webpackConfig.module.preLoaders || [];
webpackConfig.module.preLoaders.unshift({
    test: /\.js$/,
    loader: 'isparta',
    include: path.resolve(projectRoot, 'src')
});

// only apply babel for test files when using isparta
webpackConfig.module.loaders.some(function(loader, i) {
    if (loader.loader === 'babel') {
        loader.include = path.resolve(projectRoot, 'test/unit');
        return true;
    }
});

module.exports = function(karma) {
    karma.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../../',

        frameworks: ['mocha'],

        // list of files / patterns to load in the browser
        files: [{
            pattern: 'node_modules/should/should.js',
            include: true
        }, // 对每一个测试文件都要加载should断言
            'test/unit/spec/*_spec.js'
        ],

        webpack: webpackConfig,
        // list of files to exclude
        exclude: [
            'test/unit/karma.conf.js'
        ],

        // use dots reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots', 'progress', 'junit', 'teamcity'
        // CLI --reporters progress
        reporters: ['progress', 'mocha', 'coverage', 'htmlalt'],

        mochaReporter: {
            output: 'autowatch'
        },

        preprocessors: {
            'src/component/*.vue': ['webpack'], // 用webpack插件对这些文件进行预处理
            'src/*.vue': ['webpack'],
            'test/unit/spec/*.js': ['webpack']
        },

        htmlReporter: {
            outputFile: 'test/unit/reports.html',

            // Optional
            pageTitle: 'jxdd单元测试',
            subPageTitle: 'jxdd'
        },

        // Code Coverage options. report type available:
        // - html (default)
        // - lcov (lcov and html)
        // - lcovonly
        // - text (standard output)
        // - text-summary (standard output)
        // - cobertura (xml format supported by Jenkins)
        coverageReporter: {
            // cf. http://gotwarlost.github.com/istanbul/public/apidocs/
            type: 'lcov',
            dir: 'coverage/'
        },

        // web server port
        port: 9876,

        // cli runner port
        runnerPort: 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: karma.LOG_DEBUG,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // CLI --browsers Chrome,Firefox,Safari
        browsers: ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 6000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        plugins: [
            require('karma-mocha'),
            require('karma-chrome-launcher'),
            require('karma-mocha-reporter'),
            require('karma-htmlfilealt-reporter'),
            require('karma-webpack') // 加载webpack插件
        ]
    });
};
