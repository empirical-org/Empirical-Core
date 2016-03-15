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
        loaders: [ 'style', 'css?sourceMap', 'sass?sourceMap' ]
      }
    ],
  },
  // plugins: [
  //   new ExtractTextPlugin("styles/styles.css", {
  //     publicPath: '/styles/',
  //     allChunks: true
  //   })
  // ]
}
