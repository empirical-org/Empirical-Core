const webpack = require('webpack');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const devBuild = process.env.RAILS_ENV === 'development';
const railsEnv = process.env.RAILS_ENV || process.env.NODE_ENV
const firebaseApiKey = process.env.FIREBASE_API_KEY;
const firebaseDatabaseUrl = process.env.FIREBASE_DATABASE_URL;
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
    'process.env.FIREBASE_API_KEY': JSON.stringify(firebaseApiKey),
    'process.env.FIREBASE_DATABASE_URL': JSON.stringify(firebaseDatabaseUrl),
    'process.env.PUSHER_KEY': JSON.stringify(pusherKey),
    'process.env.DEFAULT_URL': JSON.stringify(defaultUrl),
    'process.env.CDN_URL': JSON.stringify(cdnUrl),
    'process.env.QUILL_GRAMMAR_URL': JSON.stringify(grammarUrl),
    'process.env.LESSONS_WEBSOCKETS_URL': JSON.stringify(lessonsWebsocketsUrl),
    'process.env.QUILL_CMS': JSON.stringify(quillCmsUrl),
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
  context: __dirname,
  entry: {
    shared: './app/bundles/Shared/clientRegistration',
    app: {
      import: './app/bundles/Teacher/startup/clientRegistration',
      dependOn: 'shared'
    },
    home: {
      import: './app/bundles/Home/home',
      dependOn: 'shared'
    },
    student: {
      import: './app/bundles/Student/startup/clientRegistration',
      dependOn: 'shared'
    },
    session: {
      import: './app/bundles/Session/startup/clientRegistration',
      dependOn: 'shared'
    },
    login: {
      import: './app/bundles/Login/startup/clientRegistration',
      dependOn: 'shared'
    },
    firewall_test: {
      import: './app/bundles/Firewall_test/firewall_test.js',
      dependOn: 'shared'
    },
    public: {
      import: './app/bundles/Public/public.js',
      dependOn: 'shared'
    },
    tools: {
      import: './app/bundles/Tools/startup/clientRegistration.js',
      dependOn: 'shared'
    },
    staff: {
      import: './app/bundles/Staff/startup/clientRegistration.js',
      dependOn: 'shared'
    },
    comprehension: {
      import: './app/bundles/Comprehension/clientRegistration',
      dependOn: 'shared'
    },
    proofreader: {
      import: './app/bundles/Proofreader/clientRegistration',
      dependOn: 'shared'
    },
    grammar: {
      import: './app/bundles/Grammar/clientRegistration',
      dependOn: 'shared'
    },
    lessons: {
      import: './app/bundles/Lessons/clientRegistration',
      dependOn: 'shared'
    },
    connect: {
      import: './app/bundles/Connect/clientRegistration',
      dependOn: 'shared'
    },
    diagnostic: {
      import: './app/bundles/Diagnostic/clientRegistration',
      dependOn: 'shared'
    }
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
