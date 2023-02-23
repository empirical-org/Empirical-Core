import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'
import friendlyTypeImports from 'rollup-plugin-friendly-type-imports';
import requireTransform from 'vite-plugin-require-transform';

// Environmental Variables can be obtained from import.meta.env as usual.
// - https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    requireTransform(),
    friendlyTypeImports(),
    //react(),
    RubyPlugin()
  ],
  define: {
    // Note: declare node-accessible variable (i.e. CDN_URL) in .env.<mode>, not here
    'process': {}
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
})





