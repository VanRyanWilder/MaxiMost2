import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/worker.ts'],
  bundle: true,
  outfile: 'dist/worker.js',
  format: 'esm',
  // CHANGE THIS LINE:
  platform: 'node', // Correct platform for firebase-admin
  target: 'esnext',
  // This line is correct and should be kept.
  external: ['node:*'],
}).catch(() => process.exit(1));

console.log('Build finished successfully.');
