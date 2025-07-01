import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

// Using relative paths with .js extension for compiled output
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { app } from './hono'; // Import our single, typed app instance
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware.js';

// Import route handlers
// These will now extend the 'app' from './hono'
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import userRoutes from './routes/userRoutes.js';


// --- Global Middleware applied to the shared app instance ---

// Optional: Request logging (can be kept here or moved to hono.ts if truly global)
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
// /api/auth routes are typically public for login/signup, so they are not included here.
app.use('/api/habits/*', authMiddleware);
app.use('/api/users/*', authMiddleware);
// Add other protected /api/* patterns here, e.g.:
// app.use('/api/profile/*', authMiddleware);


// --- Route Registration ---
// Routes are registered on the same 'app' instance imported from './hono'.
// The route files (authRoutes, habitRoutes, userRoutes) should now also import
// this 'app' from './hono' and define their routes on it, instead of creating new Hono instances.
app.route('/api/auth', authRoutes);
app.route('/api/habits', habitRoutes); // habitRoutes should be of type Hono<AppEnv> or compatible
app.route('/api/users', userRoutes);   // userRoutes should be of type Hono<AppEnv> or compatible


// --- Basic & Health Check Routes (can also be on the main app) ---
app.get('/', (c) => c.json({ message: 'Maximost API is operational.' }));
app.get('/health', (c) => c.text('OK'));


// --- Error & Not Found Handlers (applied to the main app) ---
app.onError((err, c) => {
  console.error(`Error: ${err.message}`, err.stack); // Log stack for more details
  return c.json({ success: false, message: 'Internal Server Error' }, 500);
});

app.notFound((c) => {
  console.log(`404 Not Found for URL: ${c.req.url}`);
  return c.json({ success: false, message: 'Endpoint Not Found' }, 404);
});

export default app; // Export the single, configured app instance
