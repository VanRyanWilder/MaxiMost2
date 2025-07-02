import { Hono } from 'hono';
import type { AppEnv } from '../hono'; // Shared types

// Create a new Hono instance specifically for these habit routes.
const habitRoutes = new Hono<AppEnv>();

// Auth middleware is now applied by the parent API sub-router in index.ts
// for paths matching /api/habits/* before this router is hit.

// This now handles GET requests to / (relative to where it's mounted, e.g., /api/habits/)
habitRoutes.get('/', async (c) => {
  try {
    const user = c.get('user'); // User should be set by authMiddleware on the parent API router
    if (!user?.localId) {
      console.error('HabitRoutes GET /: User or user.localId not found in context.');
      return c.json({ message: "User context error after authentication." }, 401);
    }
    console.log(`User ${user.localId} fetching habits from habitRoutes.ts (GET /)`);
    // As per plan v4.51 verification step, return the message format.
    // For actual dashboard loading to show an empty list, it should be: return c.json([], 200);
    return c.json({ message: `Habits for ${user.localId}` });
  } catch (error: any) {
    console.error("Error in habitRoutes GET /:", error);
    return c.json({ message: "Error fetching habits.", errorDetail: error.message }, 500);
  }
});

// Define other habit routes here (e.g., POST /, PUT /:id)
// These will also be protected by the authMiddleware applied on the api sub-router in index.ts for /habits/*
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
