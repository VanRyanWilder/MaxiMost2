import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Assuming hono.ts still exports AppEnv (only types)

const app = new Hono<AppEnv>();

// Add a single, simple logger at the very top.
app.use('*', async (c, next) => {
  // Log the path Hono is trying to match, and the original URL.
  // c.req.path should be the pathname without query params.
  // c.req.url includes the full URL with host and query params.
  console.log(`[PATH TRACE] Hono received request. URL: "${c.req.url}", Path for matching: "${c.req.path}", Method: "${c.req.method}"`);
  await next();
});

// Define ONLY the specific API route we are testing.
app.get('/api/habits', (c) => {
  console.log('[PATH TRACE] Matched GET /api/habits route successfully.');
  return c.json({ message: 'SUCCESS: Reached /api/habits' });
});

// Define a handler for the root path to see if it's mistakenly hit.
app.get('/', (c) => {
  console.log('[PATH TRACE] Matched GET / route unexpectedly.');
  return c.json({ message: 'ERROR: Reached / route instead of /api/habits' });
});

// Catch-all for any other paths not matched.
app.notFound((c) => {
  console.log(`[PATH TRACE] No route matched. Path was: "${c.req.path}". Full URL: "${c.req.url}"`);
  return c.json({ success: false, message: `Endpoint Not Found. Path: ${c.req.path}` }, 404);
});

// Optional: Add a specific error handler for this minimal setup
app.onError((err, c) => {
  console.error(`[PATH TRACE] Error during request to ${c.req.path}:`, err);
  return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

export default app;
