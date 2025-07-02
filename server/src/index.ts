import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Import the shared AppEnv type
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware.js';

// Import route handlers (which are now individual Hono apps)
import authRoutesInstance from './routes/authRoutes.js';
import habitRoutesInstance from './routes/habitRoutes.js';
import userRoutesInstance from './routes/userRoutes.js';

// Create the main application instance, typed with AppEnv
const app = new Hono<AppEnv>();

// --- Global Middleware applied to the main app instance ---

// Verbose request logging (from previous debugging steps)
app.use('*', async (c, next) => {
  console.log(`Request received for URL: ${c.req.url}, Method: ${c.req.method}`);
  await next();
});

app.use('*', logger());        // Hono's built-in logger
app.use('*', secureHeaders()); // Apply security headers

// CORS Configuration for all /api/* routes
app.use('/api/*', cors({
  origin: '*', // TODO: Restrict in production to specific frontend domains
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
  maxAge: 600,
  credentials: true,
}));

// Authentication Middleware for protected API routes
// Applied after CORS and general logging, but before specific route handlers for protected paths.
app.use('/api/habits/*', authMiddleware);
app.use('/api/users/*', authMiddleware);
// Note: /api/auth routes are typically public, so authMiddleware is not applied to them here.


// --- Route Mounting ---
// Mount the imported Hono instances (sub-applications) to their base paths.
app.route('/api/auth', authRoutesInstance);
app.route('/api/habits', habitRoutesInstance);
app.route('/api/users', userRoutesInstance);


// --- Basic & Health Check Routes (on the main app) ---
app.get('/', (c) => c.json({ message: 'Maximost API is operational.' }));
app.get('/health', (c) => c.text('OK'));


// --- Error & Not Found Handlers (applied to the main app) ---
app.onError((err, c) => {
  console.error(`Error in ${c.req.path}: ${err.message}`, err.stack);
  return c.json({ success: false, message: 'Internal Server Error', error: err.message }, 500);
});

app.notFound((c) => {
  console.log(`404 Not Found for URL: ${c.req.url}`);
  return c.json({ success: false, message: `Endpoint Not Found: ${c.req.method} ${c.req.path}` }, 404);
});

export default app; // Export the single, configured main app instance
