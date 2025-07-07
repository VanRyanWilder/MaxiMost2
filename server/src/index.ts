import { Hono } from 'hono';
import type { AppEnv } from './hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware'; // The new typed middleware

// Import route handlers
import authRoutes from './routes/authRoutes';
import habitRoutes from './routes/habitRoutes';
import userRoutes from './routes/userRoutes';

const app = new Hono<AppEnv>();

// --- Global Middleware ---
app.use('*', logger());
app.use('*', secureHeaders());

// CORS for all /api routes
// This should be defined before any routes that might want to use it.
app.use('/api/*', cors({
  origin: '*', // TODO: Restrict in production
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
  credentials: true, // If your frontend sends credentials
  maxAge: 600
}));

// --- Public API Routes ---
// Mount authRoutes (e.g., for login, signup) which handle their own (or no) auth
app.route('/api/auth', authRoutes);

// --- Protected API Routes ---
// These route modules are now expected to handle their own authentication middleware internally.
app.route('/api/habits', habitRoutes);
app.route('/api/users', userRoutes); // Assuming userRoutes will also apply its own authMiddleware if needed.

// Optional: A root path for the API itself, if accessed directly
// This should not conflict with Cloudflare Pages _routes.json,
// as _routes.json would only direct /api/* to this worker.
// If the worker is accessed at its root URL without /api, this would respond.
app.get('/', (c) => {
  return c.json({ message: 'Maximost Hono API is operational.' });
});

// --- Error & Not Found Handlers (applied to the main app) ---
app.onError((err, c) => {
  console.error(`Error in ${c.req.path}: ${err.message}`, err.stack);
  return c.json({ success: false, message: 'Internal Server Error', error: err.message }, 500);
});

app.notFound((c) => {
  console.log(`Main app 404 Not Found for URL: ${c.req.url} (Path: ${c.req.path})`);
  return c.json({ success: false, message: `Endpoint Not Found by Main Router: ${c.req.method} ${c.req.path}` }, 404);
});

export default app;
