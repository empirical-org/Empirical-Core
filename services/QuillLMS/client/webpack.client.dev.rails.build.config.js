/* eslint comma-dangle: ["error",
  {"functions": "never", "arrays": "only-multiline", "objects": "only-multiline"} ] */

// Run like this:
// cd client && yarn run build:client
// Note that Foreman (Procfile.dev) has also been configured to take care of this.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const config = require('./webpack.client.dev.base.config');
const { resolve } = require('path');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');

const configPath = resolve('..', 'config');
const { output } = webpackConfigLoader(configPath);

const devBuild = process.env.RAILS_ENV === 'development';

if (devBuild) {
  console.log('Webpack dev build for Rails'); // eslint-disable-line no-console
  config.devtool = 'eval-source-map';
} else {
  console.log('Webpack production build for Rails'); // eslint-disable-line no-console
}

module.exports = merge(config, {

  entry: {
    vendor: [
      // Configures extractStyles to be true if NODE_ENV is production
      'bootstrap-loader'
    ],
  },

  mode: devBuild ? 'development' : 'production',

  output: {
    filename: '[name]-bundle-[chunkhash].js',
    publicPath: output.publicPath,
    path: output.path,
    pathinfo: false
  },

  optimization: {
    splitChunks: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    minimize: false,
  },

  // See webpack.client.base.config for adding modules common to both webpack dev server and rails

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: require.resolve('react'),
        use: {
          loader: 'imports-loader',
          options: {
            shim: 'es5-shim/es5-shim',
            sham: 'es5-shim/es5-sham',
          }
        }
      },
      {
        test: require.resolve('jquery-ujs'),
        use: {
          loader: 'imports-loader',
          options: {
            jQuery: 'jquery',
          }
        }
      }
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name]-bundle-[hash].css',
      chunkFilename: '[id].css',
    }),
  ],
});
