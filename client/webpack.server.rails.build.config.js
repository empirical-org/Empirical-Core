// Common webpack configuration for server bundle

const webpack = require('webpack');
const path = require('path');
const { resolve } = require('path');
const devBuild = process.env.NODE_ENV !== 'production';
const nodeEnv = devBuild ? 'development' : 'production';
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');
const configPath = resolve('..', 'config');
const { output } = webpackConfigLoader(configPath);

module.exports = {

  // the project dir
  context: __dirname,
  entry: [
    'babel-polyfill'
    // './app/bundles/comments/startup/serverRegistration',
  ],
  output: {
    filename: 'server-bundle.js',
    publicPath: output.publicPath,
    path: output.path,
  },
  resolve: {
    extensions: ['.tx', '.txs', '.js', '.jsx'],
    alias: {
      libs: path.join(process.cwd(), 'app', 'libs'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/,
      options: {
        sassResources: ['./app/assets/styles/app-variables.scss'],
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loaders: [
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        loaders: [
          'css-loader',
          'sass-loader',
          'sass-resources-loader'
        ],
      }
    ],
  },
};
