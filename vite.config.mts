import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Resolve __dirname for ESM
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  // Set the root to the client directory
  root: 'client',
  plugins: [
    react(),
    // viteStaticCopy plugin removed, relying on publicDir
  ],
  resolve: {
    alias: {
      // Alias path resolved from project root (__dirname) to client/src
      '@': path.resolve(__dirname, './client/src'),
    },
  },
  build: {
    // The output directory is relative to the vite `root` directory ('client')
    // This resolves to ProjectRoot/dist
    outDir: '../dist',
    emptyOutDir: true, // Explicitly set
  },
  // publicDir is relative to the project root (where vite.config.mts is).
  // Vite will copy contents of this directory to the root of outDir.
  publicDir: path.resolve(__dirname, 'public'),
});
