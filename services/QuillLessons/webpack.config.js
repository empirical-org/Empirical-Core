if (!global._babelPolyfill) {
  require('babel-polyfill');
}


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
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

let config = {
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
    polyfills: ['whatwg-fetch'],
    vendor: ['pos', 'draft-js'],
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
    new webpack.EnvironmentPlugin({
      EMPIRICAL_BASE_URL: 'http://localhost:3000',
      LESSONS_WEBSOCKETS_URL: 'http://localhost:8000',
      NODE_ENV: 'development',
      QUILL_CMS: 'http://localhost:3100',
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', }),
    new HtmlWebpackPlugin({
      template: './index.html.ejs',
      inject: 'body',
      chunks: ['polyfills', 'vendor', 'javascript'],
      chunksSortMode: (chunk1, chunk2) => {
        let orders = ['vendor', 'polyfills', 'javascript'];
        let order1 = orders.indexOf(chunk1.names[0]);
        let order2 = orders.indexOf(chunk2.names[0]);
        if (order1 > order2) {
          return 1;
        } else if (order1 < order2) {
          return -1;
        }
        return 0;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['polyfills', 'vendor'],
      minChunks: Infinity,
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
  devtool: 'eval',
};

if (!live) {
  config.plugins.push(new HardSourceWebpackPlugin());
}

module.exports = config;
