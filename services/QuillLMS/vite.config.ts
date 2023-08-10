import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import replace from '@rollup/plugin-replace';
//import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import path, { resolve } from 'path';
import friendlyTypeImports from 'rollup-plugin-friendly-type-imports';
import { createLogger, defineConfig, loadEnv } from 'vite';
import requireTransform from 'vite-plugin-require-transform';
import RubyPlugin from 'vite-plugin-ruby';

const logger = createLogger();
const originalWarning = logger.warn;
logger.warn = (msg, options) => {
  return;
  if (msg.includes('vite:css') && msg.includes(' is empty')) return;
  originalWarning(msg, options);
};

export default defineConfig(({command, mode}) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    customLogger: logger, // ready to activate later, if we want.
    resolve: {
      alias: {
        src: resolve(__dirname, 'client', 'app'),
        '@' : path.resolve(__dirname),
        '@node_modules' : path.resolve(__dirname, 'client/node_modules'),
      }
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./app/assets/stylesheets/variables.scss";`
        }
      }
    },

    define: {
      //process: ({ env: {}}) // Doing this triggers a rollup parse error
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'), // TODO: parameterize
        'process.env.BAR': JSON.stringify('foo')
      }),
      requireTransform(),
      viteCommonjs(),
      friendlyTypeImports(),

      RubyPlugin(),
      //react() // required, to address the 'global' not found error
      // react({
      //   //jsxRuntime: 'classic',
      // })
    ],
    esbuild: {
      //loader: "tsx",//may not want this directive at all; still experimenting
      //include: /src\/.*\.jsx?$/
      // // Business as usual for .jsx and .tsx files
      // "client/**/*.jsx",
      // "client/**/*.tsx",
      // "node_modules/**/*.jsx",
      // "node_modules/**/*.tsx",
      // "client/node_modules/**/*.jsx",
      // "client/node_modules/**/*.tsx",

      // // js file rules
      // "client/**/*.js",
      // "node_modules/**/*.js",
      // "client/node_modules/**/*.js",

      // // Add these lines to allow all .ts files to contain JSX
      // "client/**/*.ts",
      // "node_modules/**/*.ts",
      // "client/node_modules/**/*.ts",
      include: /\.(tsx?|jsx?)$/,
      exclude: [],
      loader: 'tsx'

    },
    optimizeDeps: {
      esbuildOptions: {

        // so jsx syntax can be detected
        // Removing the plugin does not fix "SyntaxError: Unexpected token" in build mode
        plugins: [
          {
            name: "load-js-files-as-jsx",
            setup(build) {
              build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
                loader: "jsx",
                contents: await fs.readFile(args.path, "utf8"),
              }));
            },
          },
        ],
      }
    }
  }
})

