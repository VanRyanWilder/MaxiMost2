import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Assuming hono.ts still exports AppEnv (only types)
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware';

const app = new Hono<AppEnv>();

// --- Global Middleware ---
app.use('*', async (c, next) => {
  console.log(`[TRACE] Request received for: ${c.req.url}, Path: ${c.req.path}, Method: ${c.req.method}`);
  await next();
  console.log(`[TRACE] Response sent for: ${c.req.url} with status ${c.res.status}`);
});

app.use('*', logger()); // Hono's logger
app.use('*', secureHeaders()); // Security headers

// CORS Middleware
// Note: The plan has a slightly different way of applying CORS, but Hono's typical app.use for a path is more direct.
// If issues persist, the plan's async wrapper for cors can be tried.
app.use('/api/*', cors({
  origin: '*', // TODO: Restrict in production
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
  // maxAge and credentials can be added here if needed by the cors() options
}));

// --- API Route Definitions ---

// Auth Routes (Public)
// Example: GET /api/auth
app.get('/api/auth', (c) => {
  console.log('[TRACE] Matched /api/auth route.');
  return c.json({ message: 'Auth routes are operational.' });
});

// Habit Routes (Protected)
// The authMiddleware is applied directly before the handler.
app.get('/api/habits', authMiddleware, async (c) => {
  console.log('[TRACE] Matched /api/habits route (after authMiddleware).');
  try {
    const user = c.get('user'); // Should be set by authMiddleware
    if (!user?.localId) {
      console.error('[TRACE] /api/habits: User or user.localId not found in context after authMiddleware.');
      // authMiddleware should have already returned 401 if token was invalid/missing
      return c.json({ message: "User context error after authentication." }, 401);
    }
    console.log(`[TRACE] User ${user.localId} fetching habits from index.ts (GET /api/habits)`);
    // Return an empty array to satisfy the frontend
    return c.json([], 200);
  } catch (error: any) {
    console.error("[TRACE] Error in /api/habits route:", error);
    return c.json({ message: "Error fetching habits.", errorDetail: error.message }, 500);
  }
});

// Add other habit routes here in the future, e.g.:
// app.post('/api/habits', authMiddleware, async (c) => { ... });


// --- Root Health Check ---
// This should be one of the last routes defined to avoid capturing other paths.
app.get('/', (c) => {
  console.log('[TRACE] Matched / route.');
  return c.json({ message: 'Maximost API is operational.' });
});

// --- Error & Not Found Handlers ---
// These should generally be the very last items added to the app.
app.onError((err, c) => {
  console.error(`[TRACE] Error in ${c.req.path} (main app): ${err.message}`, err.stack);
  return c.json({ success: false, message: 'Internal Server Error', error: err.message }, 500);
});

app.notFound((c) => {
  console.log(`[TRACE] Main app 404 Not Found for URL: ${c.req.url} (Path: ${c.req.path})`);
  return c.json({ success: false, message: `Endpoint Not Found by Main Router: ${c.req.method} ${c.req.path}` }, 404);
});

export default app;
