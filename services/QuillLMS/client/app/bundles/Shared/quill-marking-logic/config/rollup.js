let fs = require('fs');
let zlib = require('zlib');
let rollup = require('rollup');
let uglify = require('uglify-js');
let commonjs = require('rollup-plugin-commonjs');
let nodeResolve = require('rollup-plugin-node-resolve');
let typescript = require('rollup-plugin-typescript2');
let json = require('rollup-plugin-json');
let nodeGlobals = require('rollup-plugin-node-globals')
let builtins = require('rollup-plugin-node-builtins-brofs');
let uglifyPlugin = require('rollup-plugin-uglify')
let version = process.env.VERSION || require('../package.json').version;
let banner =
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
    builtins({
      crypto: true,
      fs: false,
      net: false,
      tls: false
    }),
    typescript(),
    uglifyPlugin()
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
