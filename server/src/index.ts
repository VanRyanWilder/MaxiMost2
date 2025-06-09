import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

// Import the route handlers.
// Jules will need to ensure these route files are also updated to use Hono's context (c) instead of Express's (req, res).
import authRoutes from './routes/authRoutes';
import habitRoutes from './routes/habitRoutes';
import userRoutes from './routes/userRoutes';

// Define the environment bindings for Hono, which will be used for secrets in Cloudflare.
type Bindings = {
  // Example: DATABASE_URL: string;
  // Example: JWT_SECRET: string;
}

// Initialize the Hono app. Hono is a lightweight framework designed for edge environments like Cloudflare Workers.
const app = new Hono<{ Bindings: Bindings }>();

// --- Middleware Registration ---
// Middleware is applied to requests before they reach the route handlers.
// The order of middleware can be important.

// 1. Logger: Logs all incoming requests to the console for debugging.
app.use('*', logger());

// 2. Secure Headers: Adds security-related headers to responses automatically for protection.
app.use('*', secureHeaders());

// 3. CORS (Cross-Origin Resource Sharing): Allows your frontend to make requests to your API.
app.use('*', cors({
  origin: [
    'https://www.maximost.com', // Production frontend
    // Add the Cloudflare Pages preview URL for testing, if needed.
    // 'https://*.maximost-frontend.pages.dev', 
    'http://localhost:5173'  // Local development frontend
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));


// --- Route Registration ---
// We use app.route() to mount a collection of routes from another file under a specific path prefix.
// This keeps the main index file clean and organized.

app.route('/api/auth', authRoutes);
app.route('/api/habits', habitRoutes);
app.route('/api/users', userRoutes);


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
// This custom error handler ensures that any error that occurs is formatted consistently.
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json({
    success: false,
    message: 'An internal server error occurred.',
    error: err.message
  }, 500);
});

// --- Not Found Handler ---
// This handles any requests that don't match any of the above routes.
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Endpoint not found.'
  }, 404);
});


// This is the default export that Cloudflare Workers expects to run the application.
export default app;
