import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Assuming hono.ts still exports AppEnv (only types)
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware';

const app = new Hono<AppEnv>();

// --- Global Middleware ---
// Top-level TRACE logger (from previous debugging, can be kept or removed)
app.use('*', async (c, next) => {
  console.log(`[TRACE index.ts V4.52] Request: ${c.req.method} ${c.req.url}, Path: ${c.req.path}`);
  await next();
  console.log(`[TRACE index.ts V4.52] Response: ${c.req.method} ${c.req.url} - Status ${c.res.status}`);
});

app.use('*', logger()); // Hono's built-in logger
app.use('*', secureHeaders()); // Apply security headers

// CORS for all /api/* routes
app.use('/api/*', cors({
  origin: '*', // TODO: Restrict in production
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
  maxAge: 600,
  credentials: true,
}));

// --- API Route Definitions ---

// Auth Routes (Public)
// GET /api/auth
app.get('/api/auth', (c) => {
  console.log('[TRACE index.ts V4.52] Matched /api/auth route.');
  return c.json({ message: 'Auth routes are operational.' });
});

// Habit Routes (Protected)
// GET /api/habits
// The authMiddleware is applied directly before the handler.
app.get('/api/habits', authMiddleware, async (c) => {
  console.log('[TRACE index.ts V4.52] Matched /api/habits route (after authMiddleware).');
  try {
    const user = c.get('user'); // Should be set by authMiddleware
    if (!user?.localId) {
      console.error('[TRACE index.ts V4.52] /api/habits: User or user.localId not found in context.');
      return c.json({ message: "User context error after authentication." }, 401);
    }
    console.log(`[TRACE index.ts V4.52] User ${user.localId} fetching habits.`);
    // Return an empty array to satisfy the frontend
    return c.json([], 200);
  } catch (error: any) {
    console.error("[TRACE index.ts V4.52] Error in /api/habits route:", error);
    return c.json({ message: "Error fetching habits.", errorDetail: error.message }, 500);
  }
});

// Example for other habit routes (add as needed):
// app.post('/api/habits', authMiddleware, async (c) => { /* ... */ });
// app.put('/api/habits/:id', authMiddleware, async (c) => { /* ... */ });


// --- Root Health Check ---
// This should be defined AFTER specific API routes to ensure correct precedence.
app.get('/', (c) => {
  console.log('[TRACE index.ts V4.52] Matched / route.');
  return c.json({ message: 'Maximost API is operational.' }); // Original message
});

// --- Error & Not Found Handlers ---
app.onError((err, c) => {
  console.error(`[TRACE index.ts V4.52] Error in ${c.req.path}: ${err.message}`, err.stack);
  return c.json({ success: false, message: 'Internal Server Error', error: err.message }, 500);
});

app.notFound((c) => {
  console.log(`[TRACE index.ts V4.52] Main app 404 Not Found for URL: ${c.req.url} (Path: ${c.req.path})`);
  return c.json({ success: false, message: `Endpoint Not Found: ${c.req.method} ${c.req.path}` }, 404);
});

export default app;
