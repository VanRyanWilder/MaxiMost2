import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Assuming hono.ts still exports AppEnv (only types)
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware';

const app = new Hono<AppEnv>();

// --- Global Middleware ---
// Note: The top-level TRACE logger from v4.52 has been removed as per plan v4.53
// to simplify and focus on route order.
app.use('*', logger()); // Hono's built-in logger
app.use('*', secureHeaders()); // Apply security headers

// CORS for all /api/* routes
app.use('/api/*', cors({
  origin: '*', // TODO: Restrict in production
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
  // maxAge: 600, // Optional
  // credentials: true, // Optional
}));

// --- API Route Definitions (MOST SPECIFIC ROUTES FIRST) ---

// Auth Routes (Public)
// GET /api/auth
app.get('/api/auth', (c) => {
  console.log('[V4.53] Matched /api/auth route.');
  return c.json({ message: 'Auth routes are operational.' });
});

// Habit Routes (Protected)
// GET /api/habits
// The authMiddleware is applied directly before the handler.
app.get('/api/habits', authMiddleware, async (c) => {
  console.log('[V4.53] Matched /api/habits route (after authMiddleware).');
  try {
    const user = c.get('user'); // Should be set by authMiddleware
    if (!user?.localId) {
      console.error('[V4.53] /api/habits: User or user.localId not found in context.');
      return c.json({ message: "User context error after authentication." }, 401);
    }
    console.log(`[V4.53] User ${user.localId} fetching habits from index.ts (GET /api/habits)`);
    // Return an empty array to satisfy the frontend
    return c.json([], 200);
  } catch (error: any) {
    console.error("[V4.53] Error in /api/habits route:", error);
    return c.json({ message: "Error fetching habits.", errorDetail: error.message }, 500);
  }
});

// Example for other habit routes (add as needed):
// app.post('/api/habits', authMiddleware, async (c) => { /* ... */ });
// app.put('/api/habits/:id', authMiddleware, async (c) => { /* ... */ });


// --- Root Health Check (MOST GENERAL ROUTE LAST) ---
// This should be defined AFTER specific API routes to ensure correct precedence.
app.get('/', (c) => {
  console.log('[V4.53] Matched / route.');
  return c.json({ message: 'Maximost API is operational.' }); // Original message
});

// Note: onError and notFound handlers from v4.52 are removed as per v4.53's simplification.
// Hono has default handlers for these. If specific behavior is needed, they can be re-added.

export default app;
