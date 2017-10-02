// Common client-side webpack configuration used by webpack.hot.config and webpack.rails.config.

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const devBuild = process.env.NODE_ENV !== 'production';
const firebaseApiKey = process.env.FIREBASE_API_KEY;
const firebaseDatabaseUrl = process.env.FIREBASE_DATABASE_URL;
const pusherKey = process.env.PUSHER_KEY;
const defaultUrl = process.env.DEFAULT_URL;
const cdnUrl = process.env.CDN_URL;

const nodeEnv = devBuild ? 'development' : 'production';

module.exports = {

  // the project dir
  context: __dirname,
  entry: {

    // See use of 'vendor' in the CommonsChunkPlugin inclusion below.
    vendor: [
      'babel-polyfill',
      'es5-shim/es5-shim',
      'es5-shim/es5-sham',
      'jquery-ujs',
      'jquery'
    ],

    // This will contain the app entry points defined by webpack.hot.config and
    // webpack.rails.config
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
    // add a new login in bundle here
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
    extensions: ['', '.js', '.jsx'],
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

    // https://webpack.github.io/docs/list-of-plugins.html#2-explicit-vendor-chunk
    new webpack.optimize.CommonsChunkPlugin({

      // This name 'vendor' ties into the entry definition
      name: 'vendor',

      // We don't want the default vendor.js name
      filename: 'vendor-bundle.js',

      // Passing Infinity just creates the commons chunk, but moves no modules into it.
      // In other words, we only put what's in the vendor entry definition in vendor-bundle.js
      minChunks: Infinity,
    })
  ],
  module: {
    loaders: [
      { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000', },
      { test: /\.(ttf|eot)$/, loader: 'file', },
      { test: /\.(jpe?g|png|gif|svg|ico)$/, loader: 'url?limit=10000', },
      { test: require.resolve('jquery'), loader: 'expose?jQuery', },
      { test: require.resolve('jquery'), loader: 'expose?$', },
      { test: /\.json$/, loader: 'json-loader', }
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  // Place here all postCSS plugins here, so postcss-loader will apply them
  postcss: [autoprefixer],

  // Place here all SASS files with variables, mixins etc.
  // And sass-resources-loader will load them in every CSS Module (SASS file) for you
  // (so don't need to @import them explicitly)
  // https://github.com/shakacode/sass-resources-loader
  sassResources: ['./app/assets/styles/app-variables.scss'],

};
