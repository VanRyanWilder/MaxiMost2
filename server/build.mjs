import esbuild from 'esbuild';
import { builtinModules } from 'module';

// A more aggressive plugin to shim node built-ins
const nodeShimPlugin = {
  name: 'node-shim',
  setup(build) {
    // For each built-in module, resolve it to a virtual module named 'empty'
    for (const mod of builtinModules) {
      if (mod === 'module') continue; // 'module' is special, don't shim it
      const filter = new RegExp(`^${mod}$`);
      build.onResolve({ filter }, () => ({ path: mod, namespace: 'node-shim' }));
    }

    // The virtual 'empty' module exports nothing
    build.onLoad({ filter: /.*/, namespace: 'node-shim' }, () => ({
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
