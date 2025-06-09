import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

// Assuming you have these route files created in the /routes directory
// These will also need to be adapted to use Hono's routing context instead of Express's req/res.
// import authRoutes from './routes/authRoutes';
// import habitRoutes from './routes/habitRoutes';
// import userRoutes from './routes/userRoutes';

// Define the environment bindings for Hono, if you're using secrets/bindings in Cloudflare
type Bindings = {
    // e.g., DB: D1Database
}

// Initialize the Hono app. Hono is a lightweight framework designed for edge environments like Cloudflare Workers.
const app = new Hono<{ Bindings: Bindings }>();

// --- Middleware Registration ---
// Middleware is applied to requests before they reach the route handlers.
// We use app.use() for middleware.

// 1. Logger: Logs all incoming requests to the console for debugging.
app.use('*', logger());

// 2. Secure Headers: Adds security-related headers to responses automatically.
app.use('*', secureHeaders());

// 3. CORS (Cross-Origin Resource Sharing): Allows your frontend (www.maximost.com) to make requests to your API (api.maximost.com).
app.use('*', cors({
  origin: [
    'https://www.maximost.com', // Your production frontend
    'http://localhost:5173', // Your local development frontend (adjust port if needed)
    // Add any Cloudflare Pages preview URLs if necessary for testing
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));


// --- Route Registration ---
// We use app.route() to mount a collection of routes from another file under a specific path prefix.
// This keeps the main index file clean and organized.

// Example of how you would mount your route handlers.
// Jules will need to ensure the files in './routes/*' are also using Hono syntax.
// app.route('/api/auth', authRoutes);
// app.route('/api/habits', habitRoutes);
// app.route('/api/users', userRoutes);


// --- Basic & Health Check Routes ---

// A simple root route to confirm the API is live.
app.get('/', (c) => {
  return c.json({
    message: 'Maximost API is operational.',
    timestamp: new Date().toISOString()
  });
});

// A specific health check endpoint for monitoring services.
app.get('/health', (c) => {
    return c.text('OK');
});


// --- Error Handling ---
// Hono has a built-in error handler. This is a simple custom override to ensure
// error responses are consistently formatted in JSON.
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({
    success: false,
    message: 'An internal server error occurred.',
    error: err.message
  }, 500);
});


// This is the default export that Cloudflare Workers expects.
export default app;
