let path = require('path'),
  webpack = require('webpack');

module.exports = {
  entry: './example/main.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'index.js'
  },
  module: {
    rules: [
      { test: /\.ts$/, exclude: [/node_modules/], use: ['ts-loader'] }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devServer: {
    contentBase: path.resolve(__dirname, './example'),
    historyApiFallback: true,
    noInfo: true
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
// devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
// module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false
    //     }
    // })
  ])
}
