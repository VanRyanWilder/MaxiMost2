import { Hono } from 'hono';
import type { AppEnv } from './hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/authMiddleware';

const app = new Hono<AppEnv>();

app.use('/api/*', cors());
app.use('*', logger());

app.get('/api/habits', authMiddleware, async (c) => {
  const user = c.get('user');
  console.log(`User ${user.localId} fetching habits.`);
  return c.json([], 200);
});

// Add a root route to confirm the API is operational,
// ensuring it doesn't conflict with the /api/* catch-all for the worker
app.get('/', (c) => {
  return c.json({ message: 'Maximost API is operational via Hono.' });
});

export default app;
