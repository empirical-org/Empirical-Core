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
    polyfills: ['babel-polyfill', 'whatwg-fetch'],
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
    new HardSourceWebpackPlugin(),
    assetsPluginInstance,
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env || 'development'),
      'process.env.EMPIRICAL_BASE_URL': JSON.stringify(process.env.EMPIRICAL_BASE_URL || 'http://localhost:3000'),
      'process.env.QUILL_CMS': JSON.stringify('https://cms.quill.org' || process.env.QUILL_CMS || 'http://localhost:3100'),
      'process.env.PUSHER_KEY': JSON.stringify(process.env.PUSHER_KEY || 'a253169073ce7474f0ce'),
      'process.env.OAUTH_CLIENT_ID': JSON.stringify(process.env.OAUTH_CLIENT_ID || 'd0932924044cf2f2e2c2df64a2e8d5e78eadfc8dff8687060b6856d4a62dd5d9'),
      'process.env.FIREBASE_APP_NAME': JSON.stringify(process.env.FIREBASE_APP_NAME || 'quillconnectstaging'),
    }),
    // new BundleAnalyzerPlugin(), // For visualizing package size
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', }),
    // new CompressionPlugin({
    //   asset: '[path].gz[query]',
    //   algorithm: 'gzip',
    //   test: /\.js$/,
    //   threshold: 10240,
    //   minRatio: 0.8,
    // }),
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
