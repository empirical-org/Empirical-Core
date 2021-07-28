const webpack = require('webpack');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const devBuild = process.env.RAILS_ENV === 'development';
const railsEnv = process.env.RAILS_ENV || process.env.NODE_ENV

const goFanoutUrl = process.env.GOLANG_FANOUT_URL;
const pusherKey = process.env.PUSHER_KEY;
const defaultUrl = process.env.DEFAULT_URL;
const cdnUrl = process.env.CDN_URL;
const grammarUrl = process.env.QUILL_GRAMMAR_URL || 'http://localhost:3000/grammar/#';
const lessonsWebsocketsUrl = process.env.LESSONS_WEBSOCKETS_URL || 'http://localhost:3200';
const quillCmsUrl = process.env.QUILL_CMS || 'http://localhost:3100';
const { join, } = require('path');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');

const configPath = join(__dirname, '..', 'config');
const { output, } = webpackConfigLoader(configPath);
const mode = devBuild ? 'development' : 'production';

const basePlugins = [
  new webpack.DefinePlugin({
    'process.env.RAILS_ENV': JSON.stringify(railsEnv),
    'process.env.PUSHER_KEY': JSON.stringify(pusherKey),
    'process.env.DEFAULT_URL': JSON.stringify(defaultUrl),
    'process.env.CDN_URL': JSON.stringify(cdnUrl),
    'process.env.QUILL_GRAMMAR_URL': JSON.stringify(grammarUrl),
    'process.env.LESSONS_WEBSOCKETS_URL': JSON.stringify(lessonsWebsocketsUrl),
    'process.env.QUILL_CMS': JSON.stringify(quillCmsUrl),
    'process.env.GOLANG_FANOUT_URL': JSON.stringify(goFanoutUrl),
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
  new CompressionPlugin()
];

module.exports = {
  mode,
  output: {
    crossOriginLoading: 'anonymous'
  },
  context: __dirname,
  entry: {
    shared: [
      './app/bundles/Shared/styles/styles.scss'
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
    public: [
      './app/bundles/Public/public.js'
    ],
    tools: [
      './app/bundles/Tools/startup/clientRegistration.js'
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
    lessons: [
      './app/bundles/Lessons/clientRegistration'
    ],
    connect: [
      './app/bundles/Connect/clientRegistration'
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
      'react-dom': path.resolve('./node_modules/react-dom')
    },
    symlinks: false,
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
        use: [
          { loader: 'ts-loader', options: { transpileOnly: true } }
        ],
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/test_data"),
          path.resolve(__dirname, "app/assets")
        ],
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/test_data"),
          path.resolve(__dirname, "app/assets")
        ],
      },
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: [
            {
              globalName: '$',
              override: true
            },
            {
              globalName: 'jQuery',
              override: true
            },
          ],
        },
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
