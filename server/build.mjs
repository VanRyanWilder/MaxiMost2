import esbuild from 'esbuild';
import { builtinModules } from 'module';

const nodeShimPlugin = {
  name: 'node-shim',
  setup(build) {
    // Rule for bare module specifiers (e.g., 'fs')
    build.onResolve({ filter: new RegExp(`^(${builtinModules.join('|')})$`) }, args => ({
      path: args.path,
      namespace: 'node-shim-empty',
    }));

    // ADD THIS NEW RULE for "node:" prefixed specifiers
    build.onResolve({ filter: /^node:/ }, args => ({
      path: args.path,
      namespace: 'node-shim-empty',
    }));

    // The virtual 'empty' module exports nothing
    build.onLoad({ filter: /.*/, namespace: 'node-shim-empty' }, () => ({
      contents: 'export default {}',
      loader: 'js',
    }));
  },
};

await esbuild.build({
  entryPoints: ['src/worker.ts'],
  bundle: true,
  outfile: 'dist/worker.js',
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  // Use our new, more aggressive plugin
  plugins: [nodeShimPlugin],
}).catch((e) => {
  console.error(e);
  process.exit(1);
});

console.log('Build finished successfully.');