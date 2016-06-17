const live = process.env.NODE_ENV === "production";
console.log("in prod: ", live)
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackErrorNotificationPlugin = require('webpack-error-notification')
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
    new ExtractTextPlugin("style.css")
  ],
  module: {
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

      { test: /\.json$/, loader: 'json-loader' }
    ],
  }

}
