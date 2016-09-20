
const env = process.env.NODE_ENV
const live = (env === "production" || env === "staging");
console.log("in prod: ", live)
var webpack = require('webpack');
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  context: __dirname + "/app",
  entry: {
    javascript: "./app.js",
    html: "./index.html",
  },
  output: {
    filename: "app.js",
    path: __dirname + "/dist",
  },
  plugins: [
    new ExtractTextPlugin("style.css"),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env || 'development'),
      'process.env.EMPIRICAL_BASE_URL': JSON.stringify(process.env.EMPIRICAL_BASE_URL || 'http://localhost:3000')
    }),
  ],
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["react-hot", "babel-loader"],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel",
        query:
          {
            presets:['es2015','react']
          }
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
      {
        test: /\.scss$/,
        loader: live ? ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap') : 'style!css?sourceMap!sass?sourceMap'
      },
      {
        test: /\.svg$/,
        loader: 'file',
        include: /app\/img/
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url?limit=25000',
        include: /app\/img/
      },
      { test: /\.json$/, loader: 'json-loader' }
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }

}
