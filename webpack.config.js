const env = process.env.NODE_ENV;
const live = (env === 'production' || env === 'staging');

console.log('in prod: ', live);
const webpack = require('webpack');
const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  resolve: {
    modules: [
      path.resolve(__dirname),
      'node_modules'
    ],
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx'
    ],
  },
  context: `${__dirname}/src`,
  entry: {
    polyfills: ['babel-polyfill'],
    javascript: './index.js',
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/dist`,
  },

  // resolve: {
  // // changed from extensions: [".js", ".jsx"]
  //   extensions: ['.ts', '.tsx', '.js', '.jsx', '.ejs'],
  // },
  plugins: [
    // assetsPluginInstance,
    // new BundleAnalyzerPlugin(), // For visualizing package size
    
  ],
  module: {
    // rules: [
    //   // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' } },
    //   { test: /\.(t|j)sx?$/, use: { loader: 'awesome-typescript-loader', }, },
    //   // addition - add source-map support
    //   { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader', }
    // ],
    // noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    rules: [
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: [
          // 'react-hot-loader',
          'babel-loader',
          // 'awesome-typescript-loader'
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options:
        {
          presets: ['es2015'],
        },
      }
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  // addition - add source-map support
  devtool: 'source-map',
};
