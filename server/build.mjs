import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'], // Point to your main server entry file
  bundle: true,
  // CHANGE THIS LINE:
  outfile: '../dist/_worker.js', // Output to the root dist folder
  format: 'esm',
  platform: 'node', // Correct platform for firebase-admin
  target: 'esnext', // Target modern JS
  // external: ['node:*'] // Keep if using node:* imports and nodejs_compat flag in wrangler.toml
                         // If firebase-admin is the main driver, nodejs_compat handles this.
                         // If you directly use 'node:crypto', etc., this is useful.
                         // For now, let's rely on nodejs_compat in wrangler.toml to handle these for firebase-admin.
}).catch((e) => {
    console.error("ESBuild failed:", e);
    process.exit(1);
});

console.log('Build finished successfully: dist/worker.js');
