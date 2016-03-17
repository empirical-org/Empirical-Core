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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new WebpackErrorNotificationPlugin()
  ]
  resolve: {
    alias: {
      'redbox-react': path.join(__dirname, '..', '..', 'src')
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      // {
      //   test: /\.jsx?$/,
      //   exclude: /node_modules/,
      //   loaders: ["react-hot", "babel-loader"],
      // },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot?errorReporter=redbox-react', "babel"]
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

}
