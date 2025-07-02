import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Import the shared AppEnv type
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware.js';

// We will temporarily bypass the external route files for /api/habits and /api/auth
// import authRoutesInstance from './routes/authRoutes.js';
// import habitRoutesInstance from './routes/habitRoutes.js';
// Still need userRoutes if it's being used for other things or to avoid build errors if referenced elsewhere
import userRoutesInstance from './routes/userRoutes.js';


// Create the main application instance, typed with AppEnv
const app = new Hono<AppEnv>();

// --- Global Middleware applied to the main app instance ---

// Verbose request logging
app.use('*', async (c, next) => {
  console.log(`Request received for URL: ${c.req.url}, Method: ${c.req.method}`);
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

// Authentication Middleware
// Apply to /api/users/* if it's still active and needs protection
app.use('/api/users/*', authMiddleware);
// Note: /api/habits/* authMiddleware will be applied directly on its new route definition below.


// --- Route Definitions ---

// Define the GET /api/habits route directly in this file for debugging
app.get('/api/habits', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user?.localId) {
      console.log('/api/habits: User ID not found in token after authMiddleware.');
      return c.json({ message: "User ID not found in token." }, 400);
    }
    console.log(`User ${user.localId} fetching habits from index.ts direct route.`);
    // Return an empty array to satisfy the frontend
    return c.json([], 200);
  } catch (error: any) {
    console.error("Error in direct /api/habits route:", error);
    return c.json({ message: "Error fetching habits.", errorDetail: error.message }, 500);
  }
});

// Mount other routes (if any are kept active, e.g., userRoutes)
// app.route('/api/auth', authRoutesInstance); // Commented out as per plan
app.route('/api/users', userRoutesInstance);   // Assuming userRoutes might still be needed or for structural integrity


// --- Basic & Health Check Routes (on the main app) ---
app.get('/', (c) => c.json({ message: 'Maximost API is operational.' }));
app.get('/health', (c) => c.text('OK'));


// --- Error & Not Found Handlers (applied to the main app) ---
app.onError((err, c) => {
  console.error(`Error in ${c.req.path}: ${err.message}`, err.stack);
  return c.json({ success: false, message: 'Internal Server Error', error: err.message }, 500);
});

app.notFound((c) => {
  console.log(`404 Not Found for URL: ${c.req.url} (from main app.notFound)`);
  return c.json({ success: false, message: `Endpoint Not Found: ${c.req.method} ${c.req.path}` }, 404);
});

export default app;
