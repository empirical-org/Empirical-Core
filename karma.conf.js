// Karma configuration
// Generated on Mon Jan 23 2017 01:17:51 GMT+0100 (Paris, Madrid)

var webpackConfig = require('./webpack.config');
webpackConfig.entry = {};
webpackConfig.plugins = [];
webpackConfig.devtool = 'inline-source-map';

module.exports = function (config) {
  'use strict'
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            './node_modules/babel-polyfill/dist/polyfill.js',
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            './node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
            './test/index.js',
            // './test/module.spec.ts',
            './src/**/*.spec.ts'
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/index.js': ['webpack'],
            'src/**/*.spec.ts': ['webpack']
            // './test/module.spec.ts': ['webpack']
        },

        webpack: {
            resolve: {
                extensions: [".ts", ".js"]
            },
            module: {
                rules: [
                    { test: /\.ts$/, exclude: [/node_modules/], use: ['ts-loader'] }
                ]
            },
        },

        webpackMiddleware: {
            stats: {
                colors: true
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        plugins: [
            require('karma-mocha'),
            require('karma-phantomjs-launcher'),
            require('karma-webpack'),
            require('karma-browserify'),
            require('karma-chai')
        ]
    })
}
