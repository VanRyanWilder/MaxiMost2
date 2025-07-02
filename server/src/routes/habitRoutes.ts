import { Hono } from 'hono';
import type { AppEnv } from '../hono'; // Shared types
import { authMiddleware } from '../middleware/authMiddleware'; // Auth middleware

// Create a new Hono instance specifically for these habit routes.
const habitRoutes = new Hono<AppEnv>();

// Apply auth middleware to all routes defined in this file.
// This means any request to /api/habits/* will first go through authMiddleware.
habitRoutes.use('*', authMiddleware);

// Define the root of the habits route (handles GET /api/habits)
habitRoutes.get('/', async (c) => {
  try {
    const user = c.get('user'); // User should be set by authMiddleware
    if (!user?.localId) {
      // This case should ideally be caught by authMiddleware if token is invalid/missing,
      // but an extra check here ensures user object integrity.
      console.error('HabitRoutes GET /: User or user.localId not found in context after authMiddleware.');
      return c.json({ message: "Authentication error or user ID missing." }, 401); // Or 400 if it's a data issue post-auth
    }
    console.log(`User ${user.localId} fetching habits from habitRoutes.ts (GET /)`);
    // Return an empty array to satisfy the frontend for now
    return c.json([], 200);
  } catch (error: any) {
    console.error("Error in habitRoutes GET /:", error);
    return c.json({ message: "Error fetching habits.", errorDetail: error.message }, 500);
  }
});

// Placeholder for POST /api/habits
habitRoutes.post('/', async (c) => {
    const user = c.get('user');
    console.log(`User ${user?.localId} attempting to create habit. DB logic pending.`);
    return c.json({ message: "Create habit endpoint placeholder" }, 201);
});

// Placeholder for PUT /api/habits/:id
habitRoutes.put('/:id', async (c) => {
    const user = c.get('user');
    const habitId = c.req.param('id');
    console.log(`User ${user?.localId} attempting to update habit ${habitId}. DB logic pending.`);
    return c.json({ message: `Update habit ${habitId} placeholder` }, 200);
});

// Placeholder for DELETE /api/habits/:id
habitRoutes.delete('/:id', async (c) => {
    const user = c.get('user');
    const habitId = c.req.param('id');
    console.log(`User ${user?.localId} attempting to delete habit ${habitId}. DB logic pending.`);
    return c.json({ message: `Delete habit ${habitId} placeholder` }, 200);
});

// Placeholder for POST /api/habits/:id/complete
habitRoutes.post('/:id/complete', async (c) => {
    const user = c.get('user');
    const habitId = c.req.param('id');
    console.log(`User ${user?.localId} attempting to complete habit ${habitId}. DB logic pending.`);
    return c.json({ message: `Complete habit ${habitId} placeholder` }, 200);
});


export default habitRoutes;
