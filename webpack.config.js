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
  resolve: {
  // changed from extensions: [".js", ".jsx"]
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    assetsPluginInstance,
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env || 'development'),
      'process.env.EMPIRICAL_BASE_URL': JSON.stringify(process.env.EMPIRICAL_BASE_URL || 'http://localhost:3000'),
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
    rules: [
      // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' } },
      { test: /\.(t|j)sx?$/, use: { loader: 'awesome-typescript-loader', }, },
      // addition - add source-map support
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader', }
    ],
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query:
        {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.scss$/,
        loader: live ? ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap') : 'style!css?sourceMap!sass?sourceMap',
      },
      {
        test: /\.svg$/,
        loader: 'file',
        include: /app\/img/,
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url?limit=25000',
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
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  // addition - add source-map support
  devtool: 'source-map',
};
