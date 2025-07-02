import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Import the shared AppEnv type
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware.js';

// Import route handlers (which are individual Hono apps)
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Assuming userRoutes is also structured similarly

// Create the main application instance, typed with AppEnv
const app = new Hono<AppEnv>();

// --- Global Middleware (applied to all requests to this 'app') ---
app.use('*', async (c, next) => {
  console.log(`Main app: Request received for URL: ${c.req.url}, Method: ${c.req.method}`);
  await next();
});
app.use('*', logger());
app.use('*', secureHeaders());

// --- API Sub-Router Setup ---
const api = new Hono<AppEnv>();

// CORS Middleware for all /api/* routes (applied on the 'api' sub-router)
api.use('*', cors({ // Apply CORS to all routes handled by the 'api' sub-router
  origin: '*', // TODO: Restrict in production
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
  maxAge: 600,
  credentials: true,
}));

// Apply authMiddleware specifically to paths on the 'api' sub-router that need protection
api.use('/habits/*', authMiddleware);
// Example: If userRoutes also needs protection for all its paths:
// api.use('/users/*', authMiddleware);
// Otherwise, userRoutes can handle its own auth for specific sub-paths if necessary.

// Mount individual route handlers onto the 'api' sub-router
api.route('/habits', habitRoutes);
api.route('/auth', authRoutes); // Typically public, authMiddleware won't apply unless path matches /habits/* or /users/*
api.route('/users', userRoutes);


// --- Main App Route Registration ---
// Mount the entire API sub-router at the /api base path on the main 'app'
app.route('/api', api);


// --- Root & Health Check Routes (on the main 'app') ---
// These should be defined after the /api route mounting to ensure correct precedence.
app.get('/', (c) => {
  console.log("Root / handler reached on main app");
  return c.json({ message: 'Maximost API is operational.' });
});
app.get('/health', (c) => {
  console.log("Health /health handler reached on main app");
  return c.text('OK');
});

// --- Error & Not Found Handlers (on the main 'app') ---
app.onError((err, c) => {
  console.error(`Error in ${c.req.path} (main app): ${err.message}`, err.stack);
  return c.json({ success: false, message: 'Internal Server Error', error: err.message }, 500);
});
app.notFound((c) => {
  console.log(`Main app 404 Not Found for URL: ${c.req.url} (Path: ${c.req.path})`);
  return c.json({ success: false, message: `Endpoint Not Found by Main Router: ${c.req.method} ${c.req.path}` }, 404);
});

export default app;
