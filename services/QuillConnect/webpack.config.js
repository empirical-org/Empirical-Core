const env = process.env.NODE_ENV;
const live = (env === 'production' || env === 'staging');
const AssetsPlugin = require('assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const assetsPluginInstance = new AssetsPlugin();

const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: live ? 'production' : 'development',
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
    polyfills: ['babel-polyfill', 'whatwg-fetch'],
    vendor: ['pos', 'draft-js'],
    javascript: './app.jsx',
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: `${__dirname}/dist`,
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [new UglifyJsPlugin()]
  },
  plugins: [
    new CompressionPlugin(),
    assetsPluginInstance,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        EMPIRICAL_BASE_URL: JSON.stringify(process.env.EMPIRICAL_BASE_URL || 'http://localhost:3000'),
        QUILL_CMS: JSON.stringify(process.env.QUILL_CMS || 'http://localhost:3100'),
        PUSHER_KEY: JSON.stringify('a253169073ce7474f0ce')
      }
    }),
    new HtmlWebpackPlugin({
      template: './index.html.ejs',
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
          'react-hot-loader/webpack',
          'babel-loader',
          'awesome-typescript-loader?errorsAsWarnings=true'
        ],
      },
      {
        test: /\.d.ts$/,
        loader: 'awesome-typescript-loader?errorsAsWarnings=true',
      },
      {
        test: /\.html$/,
        use: ['file-loader?name=[name].[ext]'],
      },
      {
        test: /\.scss$/,
        use: [
          !live ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
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
  devtool: live ? false : 'eval',
};
