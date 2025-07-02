import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Assuming hono.ts still exports AppEnv (only types)

const app = new Hono<AppEnv>();

// Top-level middleware to inspect incoming request details
app.use('*', async (c, next) => {
  console.log(`[REQUEST INSPECT V4.56] Hono c.req.path: "${c.req.path}"`);
  console.log(`[REQUEST INSPECT V4.56] Hono c.req.url: "${c.req.url}"`); // Full URL Hono constructed

  // Try to access the original Request URL if available (c.req.raw should be the FetchEvent Request)
  let originalUrl = 'N/A';
  if (c.req.raw && c.req.raw.url) {
    originalUrl = c.req.raw.url;
  }
  console.log(`[REQUEST INSPECT V4.56] Original Request URL (c.req.raw.url): "${originalUrl}"`);

  // Log all headers from the original request
  const headersObject: {[key: string]: string} = {};
  if (c.req.raw && c.req.raw.headers) {
    c.req.raw.headers.forEach((value, key) => {
      headersObject[key] = value;
    });
  }
  console.log('[REQUEST INSPECT V4.56] Original Request Headers:', JSON.stringify(headersObject, null, 2));

  await next();
  console.log(`[REQUEST INSPECT V4.56] Response sent for Hono c.req.path "${c.req.path}" with status ${c.res.status}`);
});

// Define ONLY the specific API route we are testing.
app.get('/api/habits', (c) => {
  console.log('[REQUEST INSPECT V4.56] Matched GET /api/habits route successfully.');
  return c.json({ message: 'SUCCESS: Reached /api/habits (V4.56)' });
});

// Define a handler for the root path to see if it's mistakenly hit.
app.get('/', (c) => {
  console.log('[REQUEST INSPECT V4.56] Matched GET / route.');
  return c.json({ message: 'ERROR: Reached / route instead of /api/habits (V4.56)' });
});

// Catch-all for any other paths not matched.
app.notFound((c) => {
  console.log(`[REQUEST INSPECT V4.56] No route matched by Hono. Path processed by Hono: "${c.req.path}".`);
  return c.json({ success: false, message: `Endpoint Not Found. Hono processed path: ${c.req.path}` }, 404);
});

// Optional: Add a specific error handler for this minimal setup
app.onError((err, c) => {
  console.error(`[REQUEST INSPECT V4.56] Error during request to Hono path ${c.req.path}:`, err);
  return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

export default app;
