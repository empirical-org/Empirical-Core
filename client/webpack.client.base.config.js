const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ManifestPlugin = require('webpack-manifest-plugin');
const devBuild = process.env.NODE_ENV !== 'production';
const firebaseApiKey = process.env.FIREBASE_API_KEY;
const firebaseDatabaseUrl = process.env.FIREBASE_DATABASE_URL;
const pusherKey = process.env.PUSHER_KEY;
const defaultUrl = process.env.DEFAULT_URL;
const cdnUrl = process.env.CDN_URL;
const { resolve } = require('path');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');
const configPath = resolve('..', 'config');
const { output } = webpackConfigLoader(configPath);
const nodeEnv = devBuild ? 'development' : 'production';

module.exports = {
  context: __dirname,
  entry: {
    vendor: [
      'babel-polyfill',
      'es5-shim/es5-shim',
      'es5-shim/es5-sham',
      'jquery-ujs',
      'jquery'
    ],
    app: [
      './app/bundles/HelloWorld/startup/clientRegistration'
    ],
    home: [
      './app/bundles/Home/home'
    ],
    student: [
      './app/bundles/Student/startup/clientRegistration'
    ],
    session: [
      './app/bundles/Session/startup/clientRegistration'
    ],
    login: [
      './app/bundles/Login/startup/clientRegistration'
    ],
    firewall_test: [
      './app/bundles/Firewall_test/firewall_test.js'
    ],
    public: [
      './app/bundles/Public/public.js'
    ],
    tools: [
      './app/bundles/Tools/tools.js'
    ],

  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: ['node_modules'],
    alias: {
      lib: path.join(process.cwd(), 'app', 'lib'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
        FIREBASE_API_KEY: JSON.stringify(firebaseApiKey),
        FIREBASE_DATABASE_URL: JSON.stringify(firebaseDatabaseUrl),
        PUSHER_KEY: JSON.stringify(pusherKey),
        DEFAULT_URL: JSON.stringify(defaultUrl),
        CDN_URL: JSON.stringify(cdnUrl),
      },
      TRACE_TURBOLINKS: devBuild,
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/,
      options: {
        sassResources: [
          './app/assets/styles/app-variables.scss',
        ]
      }
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.s?css$/,
      options: {
        postcss: [autoprefixer]
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-bundle.js',
      minChunks: Infinity,
    }),
    new ManifestPlugin({
      publicPath: output.publicPath,
      writeToFileEmit: true
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ttf|eot)$/,
        use: 'file-loader',
      },
      {
        test: /\.(woff2?|jpe?g|png|gif|svg|ico)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash].[ext]',
            limit: 10000,
          },
        },
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            query: 'jQuery'
          },
          {
            loader: 'expose-loader',
            query: '$'
          }
        ]
      },
      {
        test: /\.json$/,
        use: [
          {
            loader: 'json-loader',
          }
        ]
      }
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
