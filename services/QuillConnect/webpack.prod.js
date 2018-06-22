const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.EnvironmentPlugin({
      QUILL_CMS: 'https://cms.quill.org',
      NODE_ENV: 'production',
      EMPIRICAL_BASE_URL: 'https://www.quill.org',
      FIREBASE_APP_NAME: 'quillconnect',
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      }
    ],
  },
});
