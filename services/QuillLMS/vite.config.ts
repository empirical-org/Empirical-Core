import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'
import friendlyTypeImports from 'rollup-plugin-friendly-type-imports';

export default defineConfig({
  plugins: [
    friendlyTypeImports(),
    RubyPlugin()
  ],
})

