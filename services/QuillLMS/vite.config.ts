import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'
import friendlyTypeImports from 'rollup-plugin-friendly-type-imports';


// Environmental Variables can be obtained from import.meta.env as usual.
// - https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    friendlyTypeImports(),
    RubyPlugin()
  ],
  define: {
    // Note: declare node-accessible varible (i.e. CDN_URL) in .env.<mode>, not here
    'process': {}
  }
})

