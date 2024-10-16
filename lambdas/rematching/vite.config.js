import path from 'path';

import { defineConfig } from 'vite';

export default defineConfig( () => {
  const entryPoint = process.env.ENTRY_POINT || 'index.js';
  console.log(`using entrypoint ${entryPoint}`) // eslint-disable-line no-console

  return {
    build: {
      outDir: 'dist',
      target: 'node14', // Adjust the target according to your Lambda runtime environment
      rollupOptions: {
        output: {
          format: 'cjs',
          // Specify the name of the output file here
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        },
        // external: ['aws-sdk'], // Keep 'aws-sdk' as external to avoid bundling it
      },
      lib: {
        entry: path.resolve(__dirname, entryPoint), // Your Lambda's entry point
        formats: ['es']
      },
      minify: false,
    },
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, '../../services/QuillLMS/client/app/bundles/Shared/quill-marking-logic/src/main'),
      },
    }
  }
});
