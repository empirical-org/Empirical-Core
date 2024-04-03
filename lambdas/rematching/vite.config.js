import path from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Output directory for the build
    outDir: 'dist',
    // Targeting Node.js environment
    target: 'node14', // Adjust the target according to your Lambda runtime environment
    // Ensuring the output is suitable for Node.js and not browser-based
    rollupOptions: {
      output: {
        format: 'cjs',
      },
      external: ['aws-sdk'], // Mark 'aws-sdk' as external to avoid bundling it, add any other external deps you don't want to bundle
    },
    // Ensuring Vite treats your entry file as a lib (library) and not a web application
    lib: {
      entry: path.resolve(__dirname, 'index.js'), // Your Lambda's entry point
      formats: ['cjs'],
    },
    // Minimize the bundle for production
    minify: true,
  },
  // Resolve your external imports relative to the src directory
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../services/QuillLMS/client/app/bundles/Shared/quill-marking-logic/src/main'),
    },
  },
});
