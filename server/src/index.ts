import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

// Using relative paths with .js extension for compiled output
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Define the environment bindings for Hono.
type Bindings = {
  // e.g., DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>();

// Add this logging middleware at the very top
app.use('*', async (c, next) => {
  console.log(`Request received for URL: ${c.req.url}`);
  await next();
});

// --- Middleware ---
app.use('*', logger());
app.use('*', secureHeaders());

// CORS Configuration
// For development, '*' can be used. For production, specify allowed origins.
// Example Production Origins:
// const productionOrigins = [
//   'https://maximost.pages.dev', // Replace with your main frontend production domain
//   /\.maximost\.pages\.dev$/,    // Allows any subdomain of maximost.pages.dev
//   'https://www.maximost.com'     // If you have a custom domain
// ];
// const allowedOrigin = process.env.NODE_ENV === 'production' ? productionOrigins : '*';

app.use('/api/*', cors({
  origin: '*', // Allows all origins for now, as per dev instructions.
  // origin: allowedOrigin, // Use this for production deployment
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'], // Added PUT
  maxAge: 600,
  credentials: true, // If you need to handle cookies or authorization headers
}));

// Import and use Firebase Auth middleware for protected routes
import { authMiddleware } from './middleware/authMiddleware.js'; // Updated import name

// Define Bindings and Variables for Hono app context if not already broadly defined
// This ensures the app instance is compatible with the middleware's expected context
type AppEnv = {
  Bindings: {
    FIREBASE_WEB_API_KEY: string;
    // Add other bindings like DB, etc.
  };
  Variables: {
    user: any; // Or a more specific user type from authMiddleware
    // Add other context variables if any
  };
};

const app = new Hono<AppEnv>(); // Initialize with the AppEnv

// Add this logging middleware at the very top (keeping it from previous step)
app.use('*', async (c, next) => {
  console.log(`Request received for URL: ${c.req.url}`);
  await next();
});

// --- Middleware ---
// Logger and SecureHeaders can remain global
app.use('*', logger());
app.use('*', secureHeaders());

// CORS Configuration
app.use('/api/*', cors({
  origin: '*',
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
  maxAge: 600,
  credentials: true,
}));

// Apply the new auth middleware globally to all /api/* routes that need protection
// Note: /api/auth routes are typically not protected by this kind of middleware
// as they are used for login/signup. If some /api/auth routes need protection,
// apply middleware more granularly or exclude them here.
app.use('/api/habits/*', authMiddleware);
app.use('/api/users/*', authMiddleware);
// If you have other /api/* routes that need protection, add them here.
// For example: app.use('/api/someother/*', authMiddleware);


// --- Route Registration ---
// These routes will now be processed after the authMiddleware for /api/habits and /api/users
app.route('/api/auth', authRoutes);
app.route('/api/habits', habitRoutes);
app.route('/api/users', userRoutes);

// --- Basic & Health Check Routes ---
app.get('/', (c) => c.json({ message: 'Maximost API is operational.' }));
app.get('/health', (c) => c.text('OK'));

// --- Error & Not Found Handlers ---
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json({ success: false, message: 'Internal Server Error' }, 500);
});
app.notFound((c) => c.json({ success: false, message: 'Endpoint Not Found' }, 404));

export default app;
