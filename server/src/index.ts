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

// --- Middleware ---
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', cors({
  origin: [
    'https://www.maximost.com',
    'https://*.maximost-frontend.pages.dev',
    'http://localhost:5173'
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// --- Route Registration ---
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
