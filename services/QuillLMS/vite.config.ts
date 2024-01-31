import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import replace from '@rollup/plugin-replace';
//import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import path, { resolve } from 'path';
import friendlyTypeImports from 'rollup-plugin-friendly-type-imports';
import { createLogger, defineConfig, loadEnv } from 'vite';
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
  //const env_stuff = {...process.env, ...loadEnv(mode, process.cwd())};
  // console.log("--")
  // console.log(process.env)
  // console.log("--")


  const railsEnv = process.env.RAILS_ENV || process.env.NODE_ENV
  const pusherKey = process.env.PUSHER_KEY;
  const pusherCluster = process.env.PUSHER_CLUSTER;
  const defaultUrl = process.env.DEFAULT_URL || 'http://localhost:3000'
  const cdnUrl = process.env.CDN_URL || 'https://assets.quill.org'
  const grammarUrl = process.env.QUILL_GRAMMAR_URL || 'http://localhost:3000/grammar/#';
  const lessonsWebsocketsUrl = process.env.LESSONS_WEBSOCKETS_URL || 'http://localhost:3200';
  const quillCmsUrl = process.env.QUILL_CMS || 'http://localhost:3100';

  return {
    //customLogger: logger, // ready to activate later, if we want.
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
        'process.env.RAILS_ENV': JSON.stringify(railsEnv),
        'process.env.PUSHER_KEY': JSON.stringify(pusherKey),
        'process.env.PUSHER_CLUSTER': JSON.stringify(pusherCluster),
        'process.env.DEFAULT_URL': JSON.stringify(defaultUrl),
        'process.env.CDN_URL': JSON.stringify(cdnUrl),
        'process.env.QUILL_GRAMMAR_URL': JSON.stringify(grammarUrl),
        'process.env.LESSONS_WEBSOCKETS_URL': JSON.stringify(lessonsWebsocketsUrl),
        'process.env.QUILL_CMS': JSON.stringify(quillCmsUrl)
      }),
      viteCommonjs(),
      friendlyTypeImports(),
      RubyPlugin(),
    ],
    esbuild: {
      include: /\.(tsx?|jsx?)$/,
      exclude: [],
      loader: 'tsx'

    },
    optimizeDeps: {
      esbuildOptions: {

        // so jsx syntax can be detected
        // Removing the plugin does not fix "SyntaxError: Unexpected token" in build mode
        plugins: [
          // esbuildCommonjs(['react-moment']), This was suggested to avoid the issues importing moment lib
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
