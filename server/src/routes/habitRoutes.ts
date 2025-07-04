import { Hono } from 'hono';
import type { AppEnv } from '../hono'; // Shared types
import { authMiddleware } from '../middleware/authMiddleware'; // Correct Auth middleware

// Create a new Hono instance specifically for these habit routes.
const habitRoutes = new Hono<AppEnv>();

// Note: authMiddleware is typically applied globally in server/src/index.ts for /api/* routes,
// so it might not be needed here if already covered.
// However, having the import is not an error if it's not used directly in this file.
// The main thing is to NOT have the incorrect 'hono/firebase-auth' import.

// This now handles GET requests to /api/habits
habitRoutes.get('/', async (c) => {
  const user = c.get('user'); // Provided by the global authMiddleware
  if (!user?.localId) {
    console.error('HabitRoutes GET /: User or user.localId not found in context.');
    return c.json({ message: "User ID not found in token." }, 400);
  }
  console.log(`User ${user.localId} fetching habits from habitRoutes.ts`);

  const PROJECT_ID = c.env.VITE_FIREBASE_PROJECT_ID;
  const API_KEY = c.env.VITE_FIREBASE_API_KEY;

  if (!PROJECT_ID || !API_KEY) {
    console.error("Firebase Project ID or API Key is not configured in environment variables for habitRoutes.");
    return c.json({ message: "Server configuration error." }, 500);
  }

  const firestoreDocumentPath = `users/${user.localId}/habits`;
  const firestoreRestUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${firestoreDocumentPath}?key=${API_KEY}`;

  console.log(`Constructed Firestore URL (example): ${firestoreRestUrl}`);

  try {
    // Actual fetch logic is commented out as per previous steps,
    // focusing on correcting build errors and demonstrating API key usage.
    console.log("Placeholder: Intended to fetch from Firestore with API key. Returning empty array for now.");
    return c.json([], 200);

  } catch (err: any) {
    console.error("Error in habitRoutes GET /:", err);
    return c.json({ message: "Failed to process habits request", error: err.message }, 500);
  }
});

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
