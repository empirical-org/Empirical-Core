const env = process.env.NODE_ENV;
const live = (env === 'production' || env === 'staging');
const AssetsPlugin = require('assets-webpack-plugin');

const assetsPluginInstance = new AssetsPlugin();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

console.log('in prod: ', live);
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  mode: 'development',
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
  context: path.resolve(__dirname, 'app'),
  entry: {
    polyfills: ['babel-polyfill', 'whatwg-fetch'],
    vendor: ['draft-js'],
    javascript: './app.jsx',
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8090,
  },
  plugins: [
    assetsPluginInstance,
    new webpack.EnvironmentPlugin({
      EMPIRICAL_BASE_URL: 'http://localhost:3000',
      LESSONS_WEBSOCKETS_URL: 'http://localhost:8000',
      NODE_ENV: 'development',
      QUILL_CMS: 'http://localhost:3100',
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './index.html.ejs',
      inject: 'body',
      chunks: ['polyfills', 'vendor', 'javascript'],
      chunksSortMode: (chunk1, chunk2) => {
        const orders = ['vendor', 'polyfills', 'javascript'];
        const order1 = orders.indexOf(chunk1);
        const order2 = orders.indexOf(chunk2);
        if (order1 > order2) {
          return 1;
        } else if (order1 < order2) {
          return -1;
        }
        return 0;
      },
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$/,
      threshold: 10240,
      minRatio: 0.8,
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
          'ts-loader'
        ],
      },
      {
        test: /\.d.ts$/,
        use: [
          'ts-loader'
        ],
      },
      {
        test: /\.html$/,
        use: ['file-loader?name=[name].[ext]'],
      },
      {
        test: /\.scss$/,
        use: [
          !live ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
        ],
      },
      {
        test: /\.svg$/,
        include: /app\/img/,
        use: [
          'file-loader'
        ],
      },
      {
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 25000,
            },
          }
        ],
        include: /app\/img/,
      },
      {
        test: /\.(eot|woff|woff2|ttf|png|jpe?g|gif|svg)(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 25000,
            },
          }
        ],
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
  devtool: 'cheap-module-eval-source-map',
};
