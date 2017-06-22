const env = process.env.NODE_ENV;
const live = (env === 'production' || env === 'staging');
const AssetsPlugin = require('assets-webpack-plugin');
const assetsPluginInstance = new AssetsPlugin();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
console.log('in prod: ', live);
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  context: `${__dirname}/app`,
  entry: {
    javascript: './app.jsx',
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: `${__dirname}/dist`,
  },
  plugins: [
    assetsPluginInstance,
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env || 'development'),
      'process.env.EMPIRICAL_BASE_URL': JSON.stringify(process.env.EMPIRICAL_BASE_URL || 'http://localhost:3000'),
      'process.env.QUILL_CMS': JSON.stringify(process.env.QUILL_CMS || 'http://localhost:3100'),
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new HtmlWebpackPlugin({
      template: './index.html.ejs',
      inject: 'body',
    })
  ],
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot-loader', 'babel-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:
        {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.scss$/,
        loader: live ? ExtractTextPlugin.extract('css-loader?sourceMap!sass-loader?sourceMap') : 'style-loader!css-loader?sourceMap!sass-loader?sourceMap',
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        include: /app\/img/,
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader?limit=25000',
        include: /app\/img/,
      },
      { test: /\.json$/, loader: 'json-loader', }
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

};
