import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/worker.ts'],
  bundle: true,
  outfile: 'dist/worker.js',
  format: 'esm',
  platform: 'browser',
  target: 'esnext',
  // This is important for firebase-admin
  external: ['node:*'],
}).catch(() => process.exit(1));

console.log('Build finished successfully.');
