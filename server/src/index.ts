import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Assuming hono.ts still exports AppEnv (only types)
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware';

const app = new Hono<AppEnv>();

// --- Global Middleware ---
// Top-level TRACE logger (can be kept for initial debugging of path)
app.use('*', async (c, next) => {
  console.log(`[V4.54 TRACE] Request: ${c.req.method} ${c.req.url}, Path: ${c.req.path}`);
  await next();
  console.log(`[V4.54 TRACE] Response: ${c.req.method} ${c.req.url} - Status ${c.res.status}`);
});

app.use('*', logger()); // Hono's built-in logger
app.use('*', secureHeaders()); // Apply security headers

// CORS for all /api/* routes
app.use('/api/*', cors({
  origin: '*', // TODO: Restrict in production
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
}));

// --- API Route Definitions ---

// Auth Routes (Public)
// GET /api/auth
app.get('/api/auth', (c) => {
  console.log('[V4.54] Matched /api/auth route.');
  return c.json({ message: 'Auth routes are operational.' });
});

// Habit Routes (Protected)
// GET /api/habits
// The authMiddleware is applied directly before the handler.
app.get('/api/habits', authMiddleware, async (c) => {
  console.log('[V4.54] Matched /api/habits route (after authMiddleware).');
  try {
    const user = c.get('user'); // Should be set by authMiddleware
    if (!user?.localId) {
      console.error('[V4.54] /api/habits: User or user.localId not found in context.');
      return c.json({ message: "User context error after authentication." }, 401);
    }
    console.log(`[V4.54] User ${user.localId} fetching habits from index.ts (GET /api/habits)`);
    // Return an empty array to satisfy the frontend
    return c.json([], 200);
  } catch (error: any) {
    console.error("[V4.54] Error in /api/habits route:", error);
    return c.json({ message: "Error fetching habits.", errorDetail: error.message }, 500);
  }
});

// Example for other habit routes (add as needed):
// app.post('/api/habits', authMiddleware, async (c) => { /* ... */ });
// app.put('/api/habits/:id', authMiddleware, async (c) => { /* ... */ });


// --- Root Health Check REMOVED ---
// REMOVED: app.get('/', (c) => c.json({ message: 'Maximost API is operational.' }));

// --- Error & Not Found Handlers ---
// It's good practice to keep these, especially notFound.
app.onError((err, c) => {
  console.error(`[V4.54] Error in ${c.req.path}: ${err.message}`, err.stack);
  return c.json({ success: false, message: 'Internal Server Error', error: err.message }, 500);
});

app.notFound((c) => {
  // This will now handle requests to '/' as well, if Cloudflare Pages passes them to the worker.
  // Or any other path not matched by the /api/* routes.
  console.log(`[V4.54] Main app 404 Not Found for URL: ${c.req.url} (Path: ${c.req.path})`);
  return c.json({ success: false, message: `Endpoint Not Found: ${c.req.method} ${c.req.path}` }, 404);
});

export default app;
