import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
    viteStaticCopy({
      targets: [
        {
          // The source path is relative to the project root (where vite.config.mts is)
          // NOT relative to the vite `root` ('client') setting.
          // So, public/_routes.json refers to ProjectRoot/public/_routes.json
          src: path.resolve(__dirname, '../public/_routes.json'),
          // dest is relative to build.outDir. Empty string means root of outDir.
          dest: ''
        }
      ]
    })
  ],
  resolve: {
    alias: {
      // The alias path should be relative to the vite.config.mts file,
      // or use absolute paths.
      // Since root is 'client', '@' can point to 'src' directly if a baseUrl is also set,
      // or resolve from project root.
      // For clarity, resolving from __dirname (project root) to client/src
      '@': path.resolve(__dirname, './client/src'),
    },
  },
  build: {
    // The output directory is relative to the vite `root` directory ('client')
    outDir: '../dist', // This resolves to ProjectRoot/dist
    emptyOutDir: true, // Explicitly set
  },
  // publicDir should be relative to project root if vite.config.mts is in project root,
  // or an absolute path.
  // Given `viteStaticCopy` is now handling `_routes.json`, `publicDir` might not be strictly needed
  // for that file, but it's good practice for other static assets in `ProjectRoot/public`.
  // It defaults to 'public' relative to `root` if `root` is set, i.e. 'client/public'.
  // To use ProjectRoot/public, it needs to be set correctly.
  // Let's explicitly set it to ProjectRoot/public.
  publicDir: path.resolve(__dirname, '../public'),
});
