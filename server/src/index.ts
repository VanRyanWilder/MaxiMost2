import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Import the shared AppEnv type
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
// Note: authMiddleware is NOT applied globally here anymore,
// it will be applied within specific route files or on specific app.route mounts if needed.
// For this plan (v4.42), authMiddleware is applied within habitRoutes.ts.

// Import route handlers (which are now individual Hono apps)
import authRoutes from './routes/authRoutes.js'; // authRoutes should define its own Hono<AppEnv>
import habitRoutes from './routes/habitRoutes.js'; // habitRoutes defines its own Hono<AppEnv> and applies authMiddleware internally
import userRoutes from './routes/userRoutes.js';   // userRoutes should also define its own Hono<AppEnv>

// Create the main application instance, typed with AppEnv
const app = new Hono<AppEnv>();

// --- Global Middleware applied to the main app instance ---

// Verbose request logging
app.use('*', async (c, next) => {
  console.log(`Main app: Request received for URL: ${c.req.url}, Method: ${c.req.method}`);
  await next();
});

app.use('*', logger());        // Hono's built-in logger
app.use('*', secureHeaders()); // Apply security headers

// CORS Configuration for all /api/* routes
app.use('/api/*', cors({
  origin: '*', // TODO: Restrict in production
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
  maxAge: 600,
  credentials: true,
}));

// --- Route Mounting ---
// Mount the imported Hono instances (sub-applications) to their base paths.
// authMiddleware is now handled within habitRoutes.ts.
// If other routes like userRoutes need auth, they should also handle it internally
// or have specific app.use('/api/users/*', authMiddleware) lines here.

app.route('/api/auth', authRoutes);
app.route('/api/habits', habitRoutes);
app.route('/api/users', userRoutes);


// --- Basic & Health Check Routes (on the main app) ---
// This get('/') must be after app.route calls for /api to avoid conflicts
app.get('/', (c) => {
  console.log("Root / handler reached");
  return c.json({ message: 'Maximost API is operational.' });
});

app.get('/health', (c) => {
  console.log("Health /health handler reached");
  return c.text('OK');
});


// --- Error & Not Found Handlers (applied to the main app) ---
app.onError((err, c) => {
  console.error(`Error in ${c.req.path}: ${err.message}`, err.stack);
  return c.json({ success: false, message: 'Internal Server Error', error: err.message }, 500);
});

app.notFound((c) => {
  // This will catch requests that don't match any defined Hono route,
  // including those that might have been intended for sub-routers but didn't match there.
  console.log(`Main app 404 Not Found for URL: ${c.req.url} (Path: ${c.req.path})`);
  return c.json({ success: false, message: `Endpoint Not Found by Main Router: ${c.req.method} ${c.req.path}` }, 404);
});

export default app;
