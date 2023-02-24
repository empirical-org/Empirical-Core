import { defineConfig, loadEnv } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'
import friendlyTypeImports from 'rollup-plugin-friendly-type-imports';
import requireTransform from 'vite-plugin-require-transform';

// Environmental Variables can be obtained from import.meta.env as usual.
// - https://vitejs.dev/config/

export default defineConfig(({command, mode}) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  console.log("vite config: env: ", env)
  // console.log("local import meta: ", import.meta.env) not available here
  //process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [
      requireTransform(),
      friendlyTypeImports(),
      //react(),
      RubyPlugin()
    ],
    define: {
      // Note: declare node-accessible variable (i.e. CDN_URL) in .env.<mode>, not here
      // 'process': {
      //   env: {
      //     DEFAULT_URL: 1//import.meta.env.DEFAULT_URL
      //   }
      // },
      //'FOOBAR': env.LOCAL_TEST_ENV_VALUE, // not visible from js code,
      //'process.env.LOCAL_TEST_ENV_VALUE': `"${env.LOCAL_TEST_ENV_VALUE}"` // not visible


    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        // Details of hack: (https://github.com/vitejs/vite/discussions/5912)
        define: {
          global: 'globalThis'
        }
      }
    }
  }
})
