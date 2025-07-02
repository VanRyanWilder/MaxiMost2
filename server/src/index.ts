import { Hono } from 'hono';
import type { AppEnv } from './hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware';

const app = new Hono<AppEnv>();

// --- Global Middleware ---
app.use('*', logger());
app.use('*', secureHeaders());
app.use('/api/*', cors({
  origin: '*', // TODO: Restrict in production
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
}));

// --- API Route Definitions (MOST SPECIFIC ROUTES FIRST) ---

// Auth Routes (Public)
app.get('/api/auth', (c) => {
  return c.json({ message: 'Auth routes are operational.' });
});

// Habit Routes (Protected)
app.get('/api/habits', authMiddleware, async (c) => {
  const user = c.get('user');
  console.log(`User ${user.localId} fetching habits from index.ts`);
  // Return an empty array to satisfy the frontend
  return c.json([], 200);
});

// Root health check removed as Cloudflare's _routes.json handles path delegation.
// Requests not matching /api/* will be served static assets by Cloudflare Pages,
// and requests to /api/* will be routed to this Hono app.
// A specific /api/health or similar can be added if a programmatic health check for the worker itself is needed.


export default app;
