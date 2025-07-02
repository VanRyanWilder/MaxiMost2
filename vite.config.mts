import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'client',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: '../public/_routes.json',
          // CHANGE THIS LINE:
          dest: '.' // Correct destination
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
  build: {
    outDir: '../dist',
  },
});
