import { Hono } from 'hono';
import type { AppEnv } from '../hono'; // Shared types
import { authMiddleware } from '../middleware/authMiddleware'; // Auth middleware

// Create a new Hono instance specifically for these habit routes.
import { authMiddleware } from '../middleware/authMiddleware';

const habitRoutes = new Hono<AppEnv>();

// Apply auth middleware to all routes within this file
habitRoutes.use('*', authMiddleware);

// This now handles GET requests to /api/habits
habitRoutes.get('/', async (c) => {
  const user = c.get('user');
  if (!user?.localId) {
    // This check might be redundant if authMiddleware always ensures user or returns error,
    // but good for robustness or if middleware logic changes.
    console.error('HabitRoutes GET /: User or user.localId not found in context.');
    return c.json({ message: "User ID not found in token." }, 400);
  }
  console.log(`User ${user.localId} fetching habits from habitRoutes.ts`);
  return c.json([], 200); // Return empty array for now
});

// Define other habit routes here (e.g., POST /, PUT /:id)
// These will also be protected by the habitRoutes.use('*', authMiddleware) above.

habitRoutes.post('/', async (c) => {
    const user = c.get('user');
    console.log(`User ${user?.localId} attempting to POST to /api/habits. Logic pending.`);
    return c.json({ message: "Create habit endpoint placeholder" }, 201);
});

habitRoutes.put('/:id', async (c) => {
    const user = c.get('user');
    const habitId = c.req.param('id');
    console.log(`User ${user?.localId} attempting to PUT /api/habits/${habitId}. Logic pending.`);
    return c.json({ message: `Update habit ${habitId} placeholder` }, 200);
});

habitRoutes.delete('/:id', async (c) => {
    const user = c.get('user');
    const habitId = c.req.param('id');
    console.log(`User ${user?.localId} attempting to DELETE /api/habits/${habitId}. Logic pending.`);
    return c.json({ message: `Delete habit ${habitId} placeholder` }, 200);
});

habitRoutes.post('/:id/complete', async (c) => {
    const user = c.get('user');
    const habitId = c.req.param('id');
    console.log(`User ${user?.localId} attempting to POST /api/habits/${habitId}/complete. Logic pending.`);
    return c.json({ message: `Complete habit ${habitId} placeholder` }, 200);
});


export default habitRoutes;
