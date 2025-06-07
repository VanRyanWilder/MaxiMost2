import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// This is the corrected configuration for Cloudflare Pages deployment.
// All Replit-specific plugins have been removed to ensure compatibility.
// The paths have been kept as defined in your original file.

export default defineConfig({
  plugins: [
    react(),
    // The "@replit/vite-plugin-runtime-error-modal" has been removed.
    // The "@replit/vite-plugin-cartographer" has been removed.
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  // This tells Vite where your source files (like index.html) are.
  root: path.resolve(import.meta.dirname, "client"),
  
  // This tells Vite where to put the final, built website files.
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
