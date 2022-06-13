// Karma configuration
// Generated on Mon Jan 23 2017 01:17:51 GMT+0100 (Paris, Madrid)

let webpackConfig = require('./webpack.config');
webpackConfig.entry = {};
webpackConfig.plugins = [];
webpackConfig.devtool = 'inline-source-map';
const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      './src/**/*.spec.ts'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.spec.ts': ['webpack']
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
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    plugins: [
      require('karma-mocha'),
      require('karma-webpack'),
      require('karma-chrome-launcher')
    ]
  })
}
