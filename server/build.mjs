import esbuild from 'esbuild';
import { builtinModules } from 'module';

await esbuild.build({
  entryPoints: ['src/worker.ts'],
  bundle: true,
  outfile: 'dist/worker.js',
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  // CHANGE THIS SECTION:
  // Explicitly mark all node built-ins as external.
  // This prevents esbuild from trying to bundle them.
  external: [
    ...builtinModules.filter((m) => !m.startsWith('_')),
    ...builtinModules.map((m) => `node:${m}`),
  ],
}).catch(() => process.exit(1));

console.log('Build finished successfully.');