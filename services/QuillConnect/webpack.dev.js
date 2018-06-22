const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      EMPIRICAL_BASE_URL: 'http://localhost:3000',
      QUILL_CMS: 'http://localhost:3100',
      PUSHER_KEY: 'a253169073ce7474f0ce',
      FIREBASE_APP_NAME: 'quillconnectstaging',
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
      }
    ],
  },
});
