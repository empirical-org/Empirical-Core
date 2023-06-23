import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
//import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';
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

    define: {
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.BAR': JSON.stringify('foo')
      }),
      requireTransform(),
      viteCommonjs(),
      friendlyTypeImports(),

      RubyPlugin(),
      //react() // required, to address the 'global' not found error
      // react({
      //   jsxRuntime: 'classic',
      // })
    ],
    esbuild: {
    },
    optimizeDeps: {
      esbuildOptions: {

        // so jsx syntax can be detected
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

