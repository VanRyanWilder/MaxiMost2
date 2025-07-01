import { app } from '../hono'; // Import our single, typed app instance

// No new Hono instance here. We extend the imported 'app'.
// Types for context (c) will be inferred from the imported 'app'.

// TODO: Implement authentication routes (e.g., login, signup, refresh token)
// These routes are typically public and won't go through the authMiddleware applied in index.ts
app.get('/', (c) => {
  return c.json({ message: 'Auth routes placeholder - to be implemented' });
});

// Example:
// app.post('/signup', async (c) => { /* ... */ });
// app.post('/login', async (c) => { /* ... */ });

export default app; // Export the app instance itself, not a new Hono router
