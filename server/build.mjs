import esbuild from 'esbuild';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

await esbuild.build({
  entryPoints: ['src/worker.ts'],
  bundle: true,
  outfile: 'dist/worker.js',
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  // Use the professional polyfill plugin
plugins: [
  polyfillNode({
    // Add this globals configuration
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