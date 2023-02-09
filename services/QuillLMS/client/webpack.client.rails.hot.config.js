const webpack = require('webpack');
const config = require('./webpack.client.base.config');
const merge = require('webpack-merge');
const { resolve, } = require('path');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');

const configPath = resolve('..', 'config');
const { output, } = webpackConfigLoader(configPath);
const hotReloadingUrl = output.publicPathWithHost;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge(config, {
  devtool: 'eval-source-map',

  output: {
    crossOriginLoading: 'anonymous',
    filename: '[name]-bundle-[hash].js',
    publicPath: output.publicPath,
    path: output.path,
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 0,
              localIdentName: '[local]',
            },
          },
          'postcss-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 3,
              localIdentName: '[local]',
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: './app/assets/styles/app-variables.scss',
            },
          }
        ],
      }
    ],

  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: '[name]-bundle.css',
      allChunks: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-bundle-[hash].js',
      minChunks: Infinity,
    })
  ],
});

console.log('Webpack HOT dev build for Rails Env');
