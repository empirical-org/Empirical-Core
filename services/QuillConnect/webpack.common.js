const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const assetsPluginInstance = new AssetsPlugin();

module.exports = {
  resolve: {
    // directories where to look for modules
    modules: [
      path.resolve(__dirname, 'app'),
      'node_modules'
    ],
    // extensions that are used
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx'
    ],
  },
  // the home directory for webpack
  // the entry and module.rules.loader option
  // is resolved relative to this directory
  context: __dirname,
  entry: {
    javascript: './app/app.jsx',
    polyfills: ['babel-polyfill', 'whatwg-fetch'],
    vendor: ['pos', 'draft-js'],
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    assetsPluginInstance,
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', }),
    new HtmlWebpackPlugin({
      template: './app/index.html.ejs',
      inject: 'body',
      chunks: ['polyfills', 'vendor', 'javascript'],
      chunksSortMode: (chunk1, chunk2) => {
        const orders = ['vendor', 'polyfills', 'javascript'];
        const order1 = orders.indexOf(chunk1.names[0]);
        const order2 = orders.indexOf(chunk2.names[0]);
        if (order1 > order2) {
          return 1;
        } else if (order1 < order2) {
          return -1;
        }
        return 0;
      },
    })
  ],
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [
          'react-hot-loader',
          'babel-loader',
          'awesome-typescript-loader'
        ],
      },
      {
        test: /\.d.ts$/,
        use: [
          'awesome-typescript-loader'
        ],
      },
      {
        test: /\.html$/,
        use: ['file-loader?name=[name].[ext]'],
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
      {
        test: /\.(eot|woff|woff2|ttf|png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'url-loader?limit=25000',
        exclude: /app\/img/,
      }
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
