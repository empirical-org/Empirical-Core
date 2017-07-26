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
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  resolve: {
    modules: [
      path.resolve(__dirname, 'app'),
      'node_modules'
    ],
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx'
    ],
  },
  context: `${__dirname}/app`,
  entry: {
    vendor: ['pos', 'draft-js'],
    javascript: './app.jsx',
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: `${__dirname}/dist`,
  },

  // resolve: {
  // // changed from extensions: [".js", ".jsx"]
  //   extensions: ['.ts', '.tsx', '.js', '.jsx', '.ejs'],
  // },
  plugins: [
    assetsPluginInstance,
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env || 'development'),
      'process.env.EMPIRICAL_BASE_URL': JSON.stringify(process.env.EMPIRICAL_BASE_URL || 'http://localhost:3000'),
      'process.env.QUILL_CMS': JSON.stringify(process.env.QUILL_CMS || 'http://localhost:3100'),
      'process.env.PUSHER_KEY': JSON.stringify(process.env.PUSHER_KEY || 'a253169073ce7474f0ce'),
    }),
    // new BundleAnalyzerPlugin(), // For visualizing package size
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', }),
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
    // rules: [
    //   // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' } },
    //   { test: /\.(t|j)sx?$/, use: { loader: 'awesome-typescript-loader', }, },
    //   // addition - add source-map support
    //   { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader', }
    // ],
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
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options:
        {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.html$/,
        use: ['file-loader?name=[name].[ext]'],
      },
      {
        test: /\.scss$/,
        use: live ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          // resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader'],
        }) : ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
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
  // addition - add source-map support
  devtool: 'source-map',
};
