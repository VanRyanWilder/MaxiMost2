import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Import the shared AppEnv type
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware';

// Import route handlers (which are individual Hono apps)
import habitRoutes from './routes/habitRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Assuming authRoutes.ts will be re-created or adapted
import userRoutes from './routes/userRoutes.js'; // Assuming userRoutes.ts will be re-created or adapted

const app = new Hono<AppEnv>();

// --- Global Middleware (applied to all requests to this 'app') ---
app.use('*', async (c, next) => {
  console.log(`[TRACE - index.ts] Request received for: ${c.req.url}, Path: ${c.req.path}, Method: ${c.req.method}`);
  await next();
  console.log(`[TRACE - index.ts] Response sent for: ${c.req.url} with status ${c.res.status}`);
});
app.use('*', logger());
app.use('*', secureHeaders());

// --- API Sub-Router Setup ---
const api = new Hono<AppEnv>();

// CORS Middleware for all /api/* routes (applied on the 'api' sub-router)
api.use('*', cors({
  origin: '*', // TODO: Restrict in production
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
  maxAge: 600,
  credentials: true,
}));

// Apply authMiddleware specifically to paths on the 'api' sub-router that need protection
api.use('/habits/*', authMiddleware);
// api.use('/users/*', authMiddleware); // Example for the future, if userRoutes needs blanket protection

// Mount individual route handlers onto the 'api' sub-router
api.route('/habits', habitRoutes);
api.route('/auth', authRoutes);
api.route('/users', userRoutes);


// --- Main App Route Registration ---
// Mount the entire API sub-router at the /api base path on the main 'app'
app.route('/api', api);


// --- Root & Health Check Routes (on the main 'app') ---
// These should be defined after the /api route mounting to ensure correct precedence.
app.get('/', (c) => {
  console.log('[TRACE - index.ts] Matched / route.');
  return c.json({ message: 'Maximost API is operational.' }); // Restored original message
});
app.get('/health', (c) => {
  console.log('[TRACE - index.ts] Health /health handler reached.');
  return c.text('OK');
});

// --- Error & Not Found Handlers (on the main 'app') ---
app.onError((err, c) => {
  console.error(`[TRACE - index.ts] Error in ${c.req.path}: ${err.message}`, err.stack);
  return c.json({ success: false, message: 'Internal Server Error', error: err.message }, 500);
});

app.notFound((c) => {
  console.log(`[TRACE - index.ts] Main app 404 Not Found for URL: ${c.req.url} (Path: ${c.req.path})`);
  return c.json({ success: false, message: `Endpoint Not Found by Main Router: ${c.req.method} ${c.req.path}` }, 404);
});

export default app;
