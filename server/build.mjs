import esbuild from 'esbuild';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

await esbuild.build({
  entryPoints: ['src/worker.ts'],
  bundle: true,
  outfile: 'dist/worker.js',
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  // Add this "define" configuration
  define: {
    'process.env.NODE_ENV': "'production'",
  },
  plugins: [
    polyfillNode({
      globals: {
        process: true,
        buffer: true,
      },
    }),
  ],
}).catch((e) => {
  console.error(e);
  process.exit(1);
});

console.log('Build finished successfully.');