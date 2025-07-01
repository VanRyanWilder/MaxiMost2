import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'], // Point to your main server entry file (usually index.ts for Hono)
  bundle: true,
  outfile: 'dist/worker.js', // Output for Cloudflare Workers
  format: 'esm',
  platform: 'node', // Crucial for firebase-admin and other Node.js specific APIs
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
