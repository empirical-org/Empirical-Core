var fs = require('fs');
var zlib = require('zlib');

var rollup = require('rollup');
var uglify = require('uglify-js');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var typescript = require('rollup-plugin-typescript2');
var json = require('rollup-plugin-json');
var nodeGlobals = require('rollup-plugin-node-globals')

var version = process.env.VERSION || require('../package.json').version;
var banner =
    '/*!\n' +
    ' * {LIB} v' + version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' {NAME}\n' +
    ' * Released under the MIT License.\n' +
    ' */';

rollup.rollup({
    input: "./src/main.ts",
    plugins: [
      nodeResolve({
            // pass custom options to the resolve plugin
            jsnext: true,
            main: true,
            browser: true,
            preferBuiltins: true
          }),
      json(),
      commonjs({
        include: 'node_modules/**',
        exclude: 'node_modules/tough-cookie/package.json',
        namedExports: {
          'node_modules/underscore/underscore.js': ['sortBy', 'reject', 'isEqual', 'where', 'find', 'filter', 'any', 'map', 'intersection', 'contains', 'zip', 'min', 'max', 'mapObject', 'omit'],
          'node_modules/diff/dist/diff.js': ['diffWords', '_params'],
          'node_modules/process/index.js': ['nextTick'],
          'node_modules/events/events.js': ['EventEmitter'],
          'node_modules/buffer/index.js': ['isBuffer']
        }
      }),
      nodeGlobals(),
      typescript(),
    ]
})
    .then(function (bundle) {
        return bundle.write({
            file: 'dist/lib.js',
            format: 'cjs',
            banner: banner,
            name: 'lib'
        })
    })
    .then(function () {
        return write(
            'dist/lib.min.js',
            banner + '\n' + uglify.minify('dist/lib.js').code
        )
    })
    .then(function () {
        return new Promise(function (resolve, reject) {
            fs.readFile('dist/lib.min.js', function (err, buf) {
                if (err) return reject(err)
                zlib.gzip(buf, function (err, buf) {
                    if (err) return reject(err)
                    write('dist/lib.min.gz', buf).then(resolve)
                })
            })
        })
    })
    .catch(logError);

function write(dest, code) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(dest, code, function (err) {
            if (err) return reject(err)
            resolve()
        })
    })
};

function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
};

function logError(e) {
    // to do, use Sentry to capture error
};

function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
};
