import esbuild from 'esbuild';
import { builtinModules } from 'module';

// Custom plugin to mark all node built-ins as external
const nodeBuiltinsPlugin = {
  name: 'node-builtins',
  setup(build) {
    // Create a filter regex for all built-in modules
    const filter = new RegExp(`^(${builtinModules.join('|')})$`);

    build.onResolve({ filter }, args => {
      return { path: args.path, external: true };
    });
  },
};

await esbuild.build({
  entryPoints: ['src/worker.ts'],
  bundle: true,
  outfile: 'dist/worker.js',
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  // Use our custom plugin
  plugins: [nodeBuiltinsPlugin],
}).catch(() => process.exit(1));

console.log('Build finished successfully.');