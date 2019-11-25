const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    mode: 'production',
    context: resolve(__dirname, 'src'),
    entry: './index.tsx',
    output: {
        filename: 'index.js',
        // the output bundle
        path: resolve(__dirname, 'dist'),
        publicPath: '/'
        // necessary for HMR to know where to load the hot update chunks
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(ts|tsx)?$/,
                loader: 'tslint-loader',
                exclude: [resolve(__dirname, "node_modules")],
            },
            {
                test: /\.(ts|tsx)?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            getCustomTransformers: () => ({
                              before: [ tsImportPluginFactory({
                                libraryName: 'antd',
                                libraryDirectory: 'es',
                                style: 'css',
                              }) ]
                            }),
                            compilerOptions: {
                              module: 'es2015'
                            }
                        },
                    },
                ],
                exclude: [resolve(__dirname, "node_modules")],
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            // {
            //     test:/\.css$/,
            //     // use: ['css-hot-loader']
            //     use: ['css-hot-loader', 'style-loader', MiniCssExtractPlugin.loader, "css-loader"]
            // },
            {
                test:/\.(css|scss)$/,
                // use: ['css-hot-loader']
                use: ['css-hot-loader', 'style-loader', "css-loader", "sass-loader"]
            },
            { test: /\.png$/, loader: "url-loader?limit=100000" },
            { test: /\.jpg$/, loader: "file-loader" },
            { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' }
        ]
    },
    plugins: [
        // new MiniCssExtractPlugin({
        //     filename: "style.css",
        //     chunkFilename: "[id].css"
        //   }),
        new CompressionPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // enable HMR globally
        new webpack.NamedModulesPlugin(),
        // prints more readable module names in the browser console on HMR updates
        new HtmlWebpackPlugin({template: resolve(__dirname, 'src/index.html')}),
        // inject <script> in html file.
        new webpack.DefinePlugin({
          "process.env.EMPIRICAL_BASE_URL": JSON.stringify('https://www.quill.org'),
          "process.env.QUILL_GRAMMAR_URL": JSON.stringify('https://beta-grammar.quill.org/#'),
          "process.env.PUSHER_KEY": JSON.stringify('a253169073ce7474f0ce'),
          "process.env.QUILL_CDN_URL": JSON.stringify('https://assets.quill.org'),
          "process.env.NODE_ENV": JSON.stringify('production')
        })
    ],
    node: {
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
};
