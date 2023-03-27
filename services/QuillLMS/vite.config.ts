import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
//import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import path, { resolve } from 'path';
import friendlyTypeImports from 'rollup-plugin-friendly-type-imports';
import { createLogger, defineConfig, loadEnv } from 'vite';
import requireTransform from 'vite-plugin-require-transform';
import RubyPlugin from 'vite-plugin-ruby';

// Environmental Variables can be obtained from import.meta.env as usual.
// - https://vitejs.dev/config/

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
  //console.log("vite config: env: ", env)
  // console.log("local import meta: ", import.meta.env) not available here
  //process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

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
      // global: {}
      //process: { env: {}}

      // Note: declare node-accessible variable (i.e. CDN_URL) in .env.<mode>, not here
      // 'process': {
      //   env: {
      //     DEFAULT_URL: 1//import.meta.env.VITE_DEFAULT_URL
      //   }
      // },
      //'FOOBAR': env.LOCAL_TEST_ENV_VALUE, // not visible from js code,
      //'process.env.LOCAL_TEST_ENV_VALUE': `"${env.LOCAL_TEST_ENV_VALUE}"` // not visible


    },
    plugins: [
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
      // define: {
      //   global: "window"
      // },
      // loader: "jsx",
      //include: /src\/.*\.jsx?$/,

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

