import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  // Set the root to the client directory
  root: 'client',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          // The source path is now relative to the new root
          src: '../public/_routes.json',
          dest: '..' // Copy to the root of the 'dist' folder
        }
      ]
    })
  ],
  resolve: {
    alias: {
      // The alias path needs to be adjusted for the new root
      '@': path.resolve(__dirname, './client/src'),
    },
  },
  build: {
    // The output directory is now relative to the new root
    outDir: '../dist',
  },
});