import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy'; // Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Add the static copy plugin configuration
    viteStaticCopy({
      targets: [
        {
          src: 'public/_routes.json',
          dest: '.' // Copy to the root of the 'dist' folder
        }
      ]
    })
  ],
  // We no longer need publicDir, as the plugin handles it explicitly
  // publicDir: 'public', 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
  build: {
    outDir: 'dist',
  },
});