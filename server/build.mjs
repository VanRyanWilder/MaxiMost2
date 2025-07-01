import esbuild from 'esbuild';
import { builtinModules } from 'module';

const nodeShimPlugin = {
  name: 'node-shim',
  setup(build) {
    // Add a specific rule for node-fetch
    build.onResolve({ filter: /^node-fetch$/ }, args => ({
      path: args.path,
      namespace: 'node-shim-empty',
    }));

    // For each built-in module, resolve it to a virtual module
    for (const mod of builtinModules) {
      if (mod === 'module') continue; // 'module' is special, don't shim it
      const filter = new RegExp(`^${mod}$`);
      build.onResolve({ filter }, args => ({ path: args.path, namespace: 'node-shim-empty' }));
    }

    // The virtual 'empty' module exports nothing
    build.onLoad({ filter: /.*/, namespace: 'node-shim-empty' }, () => ({
      contents: 'export default {}', // Remove module.exports
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