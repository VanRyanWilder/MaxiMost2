import { Hono } from 'hono';
import type { AppEnv } from './hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware';
// We no longer import the deleted route files
// import habitRoutes from './routes/habitRoutes'; // This should also be removed if consolidated
// import authRoutes from './routes/authRoutes';
// import userRoutes from './routes/userRoutes';

const app = new Hono<AppEnv>();

// --- Global Middleware ---
app.use('*', logger());
app.use('*', secureHeaders());
app.use('/api/*', cors({
  origin: '*', // TODO: Restrict in production
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
}));

// --- API Route Definitions ---

app.get('/api/auth', (c) => {
  return c.json({ message: 'Auth routes are operational.' });
});

app.get('/api/habits', authMiddleware, async (c) => {
  const user = c.get('user');
  console.log(`User ${user.localId} fetching habits from index.ts`);
  return c.json([], 200);
});

export default app;
