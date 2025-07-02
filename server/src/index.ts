import { Hono } from 'hono';
import type { AppEnv } from './hono'; // Assuming hono.ts still exports AppEnv
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './middleware/authMiddleware';

const app = new Hono<AppEnv>();

// --- Global Middleware ---
// Verbose request logging (can be kept for debugging)
app.use('*', async (c, next) => {
  console.log(`Request received for URL: ${c.req.url}, Method: ${c.req.method}`);
  await next();
});
app.use('*', logger());
app.use('*', secureHeaders());

app.use('/api/*', cors({
  origin: '*', // TODO: Restrict in production
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
  maxAge: 600, // Optional: configure preflight caching
  credentials: true, // Optional: if you need to handle cookies or auth headers from frontend
}));

// --- API Route Definitions ---

// Auth Routes (Public)
// Example: GET /api/auth
app.get('/api/auth', (c) => {
  console.log("Accessed /api/auth route in index.ts");
  return c.json({ message: 'Auth routes are operational.' });
});

// Example: POST /api/auth/login (add more as needed)
// app.post('/api/auth/login', async (c) => {
//   // ... login logic
//   return c.json({ message: 'Login placeholder' });
// });


// Habit Routes (Protected)
// The authMiddleware is applied directly before the handler.
app.get('/api/habits', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user?.localId) {
      console.error('/api/habits: User or user.localId not found in context after authMiddleware.');
      return c.json({ message: "User ID not found in token." }, 400);
    }
    console.log(`User ${user.localId} fetching habits from index.ts (GET /api/habits)`);
    // Return an empty array to satisfy the frontend
    return c.json([], 200);
  } catch (error: any) {
    console.error("Error in /api/habits route:", error);
    return c.json({ message: "Error fetching habits.", errorDetail: error.message }, 500);
  }
});

// Example: POST /api/habits (add more as needed, remember authMiddleware)
// app.post('/api/habits', authMiddleware, async (c) => {
//   const user = c.get('user');
//   console.log(`User ${user.localId} creating habit from index.ts`);
//   // ... logic to create habit
//   return c.json({ message: 'Habit created placeholder' }, 201);
// });


// --- Root Health Check ---
// This should be one of the last routes defined to avoid capturing other paths.
app.get('/', (c) => {
  console.log("Root / handler reached in index.ts");
  return c.json({ message: 'Maximost API is operational.' });
});

// --- Error & Not Found Handlers ---
// These should generally be the very last items added to the app.
app.onError((err, c) => {
  console.error(`Error in ${c.req.path} (main app): ${err.message}`, err.stack);
  return c.json({ success: false, message: 'Internal Server Error', error: err.message }, 500);
});

app.notFound((c) => {
  console.log(`Main app 404 Not Found for URL: ${c.req.url} (Path: ${c.req.path})`);
  return c.json({ success: false, message: `Endpoint Not Found by Main Router: ${c.req.method} ${c.req.path}` }, 404);
});

export default app;
