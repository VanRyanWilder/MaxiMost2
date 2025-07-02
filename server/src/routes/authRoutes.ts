import { Hono } from 'hono';
import type { AppEnv } from '../hono'; // Import the shared AppEnv type

// Create a new Hono instance specifically for these auth routes.
const authRoutes = new Hono<AppEnv>();

// Define authentication-related routes.
// These are typically public and won't have authMiddleware applied to them by default
// when mounted under the /api sub-router (which only applies auth to /api/habits/*).
authRoutes.get('/', (c) => {
  console.log('[TRACE - authRoutes.ts] Matched /api/auth GET /');
  return c.json({ message: 'Auth routes are operational.' });
});

// Example placeholder for a login route
authRoutes.post('/login', async (c) => {
  console.log('[TRACE - authRoutes.ts] Matched /api/auth/login POST');
  // const body = await c.req.json();
  // Perform login logic...
  return c.json({ message: 'Login endpoint placeholder' }, 200);
});

// Example placeholder for a signup route
authRoutes.post('/signup', async (c) => {
  console.log('[TRACE - authRoutes.ts] Matched /api/auth/signup POST');
  // const body = await c.req.json();
  // Perform signup logic...
  return c.json({ message: 'Signup endpoint placeholder' }, 201);
});

export default authRoutes; // Export this Hono instance
