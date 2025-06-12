import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers'; // Recommended for security
import { logger } from 'hono/logger'; // Optional: for logging requests
// import { bodyParse } from 'hono/body-parse'; // Hono v4 often doesn't need explicit body parsing for JSON

// Initialize Firebase Admin SDK - This needs to run to configure Firebase
import './config/firebaseAdmin';
// import { admin } from './config/firebaseAdmin'; // admin import for token verification is now in authMiddleware

// Import Hono-compatible auth middleware
// import { honoProtectWithFirebase } from './middleware/authMiddleware'; // No longer needed globally, applied in routes
// Routes will import and apply their own middleware as needed.

// Import Hono route modules
import userRoutes from './routes/userRoutes';
import habitRoutes from './routes/habitRoutes'; // Import refactored Hono habit routes

const app = new Hono();

// --- Middleware ---

// Logging (optional, but good for development)
app.use('*', logger());

// Secure Headers (recommended)
app.use('*', secureHeaders());

// CORS configuration
app.use('*', cors({
  origin: '*', // Adjust for production: e.g., ['http://localhost:3000', 'https://yourdomain.com']
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true, // If you need to handle cookies from frontend
}));

// Note: honoProtectWithFirebase is now imported from './middleware/authMiddleware'
// and will be applied to routes directly.

// --- Routes ---
// Mount the Hono user routes
app.route('/api/users', userRoutes);

// Mount the Hono habit routes
app.route('/api/habits', habitRoutes);

// Basic root route for testing
app.get('/', (c) => {
  return c.text('Maximost Backend Server with Hono is running!');
});

// --- Error Handling ---
app.onError((err, c) => {
  console.error('Unhandled error in Hono:', err);
  // Check if the error is an instance of Hono's HTTPException
  if (err instanceof Error) { // Or check for Hono's HTTPException if available and needed
    // Potentially use err.status if it's an HTTPException
    return c.json({ message: err.message || 'An unexpected error occurred.', errorName: err.name }, (err as any).status || 500);
  }
  return c.json({ message: 'An unexpected server error occurred.' }, 500);
});

// --- Not Found Handler (Hono handles this by default if no route matches) ---
// Hono has a built-in notFound handler, but you can customize it:
// app.notFound((c) => {
//   return c.json({ message: 'Not Found - The requested resource could not be found on this server.' }, 404);
// });


export default app;
