const webpack = require('webpack');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');

const devBuild = process.env.RAILS_ENV === 'development';
const railsEnv = process.env.RAILS_ENV || process.env.NODE_ENV
const firebaseApiKey = process.env.FIREBASE_API_KEY;
const firebaseDatabaseUrl = process.env.FIREBASE_DATABASE_URL;
const pusherKey = process.env.PUSHER_KEY;
const defaultUrl = process.env.DEFAULT_URL;
const cdnUrl = process.env.CDN_URL;
const grammarUrl = process.env.QUILL_GRAMMAR_URL || 'http://localhost:3000/grammar/#';
const quillCmsUrl = process.env.QUILL_CMS || 'http://localhost:3100';
const { join, } = require('path');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');

const configPath = join(__dirname, '..', 'config');
const { output, } = webpackConfigLoader(configPath);
const mode = devBuild ? 'development' : 'production';

const basePlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      RAILS_ENV: JSON.stringify(railsEnv),
      FIREBASE_API_KEY: JSON.stringify(firebaseApiKey),
      FIREBASE_DATABASE_URL: JSON.stringify(firebaseDatabaseUrl),
      PUSHER_KEY: JSON.stringify(pusherKey),
      DEFAULT_URL: JSON.stringify(defaultUrl),
      CDN_URL: JSON.stringify(cdnUrl),
      QUILL_GRAMMAR_URL: JSON.stringify(grammarUrl),
      QUILL_CMS: JSON.stringify(quillCmsUrl)
    },
    TRACE_TURBOLINKS: devBuild,
  }),
  new webpack.LoaderOptionsPlugin({
    test: /\.scss$/,
    options: {
      sassResources: [
        './app/assets/styles/app-variables.scss'
      ],
    },
  }),
  new ManifestPlugin({
    publicPath: output.publicPath,
    writeToFileEmit: true,
  }),
];

module.exports = {
  mode,
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
      './app/bundles/Teacher/startup/clientRegistration'
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
    staff: [
      './app/bundles/Staff/startup/clientRegistration.js'
    ],
    comprehension: [
      './app/bundles/Comprehension/clientRegistration.js'
    ],
    proofreader: [
      './app/bundles/Proofreader/clientRegistration'
    ],
    grammar: [
      './app/bundles/Grammar/clientRegistration'
    ],
    diagnostic: [
      './app/bundles/Diagnostic/clientRegistration'
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [
      './node_modules',
      './app'
    ],
    alias: {
      lib: path.join(process.cwd(), 'app', 'lib'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  plugins: basePlugins,
  module: {
    rules: [
      {
        test: /\.(woff|woff2|jpe?g|png|gif|svg|ico|ttf|eot)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash].[ext]',
            limit: 10000,
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/test_data"),
          path.resolve(__dirname, "app/assets")
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
      {
        test: /\.jsx?$/,
        loader: 'ts-loader',
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/test_data"),
          path.resolve(__dirname, "app/assets")
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            query: 'jQuery',
          },
          {
            loader: 'expose-loader',
            query: '$',
          }
        ],
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
