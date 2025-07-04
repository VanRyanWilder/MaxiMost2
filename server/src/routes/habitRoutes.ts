import { Hono } from 'hono';
import type { AppEnv } from '../hono'; // Shared types
import { authMiddleware } from '../middleware/authMiddleware'; // Correct Auth middleware

const habitRoutes = new Hono<AppEnv>();

// GET /api/habits - Simplified for diagnosing environment variable issues
habitRoutes.get('/', async (c) => {
  const user = c.get('user');
  if (!user?.localId) {
    console.error('HabitRoutes GET /: User or user.localId not found in context.');
    return c.json({ message: "User ID not found in token." }, 400);
  }
  console.log(`User ${user.localId} attempting to fetch habits.`);

  // --- J-12: Debugging 500 Internal Server Error ---
  // Simplified to check environment variable access.

  const PROJECT_ID = c.env.VITE_FIREBASE_PROJECT_ID;
  const API_KEY = c.env.VITE_FIREBASE_API_KEY;

  console.log("Attempting to read env vars in GET /api/habits:");
  console.log("VITE_FIREBASE_PROJECT_ID:", PROJECT_ID ? "SET" : "UNDEFINED");
  console.log("VITE_FIREBASE_API_KEY:", API_KEY ? "SET" : "UNDEFINED");

  if (!PROJECT_ID || !API_KEY) {
    console.error("CRITICAL: Firebase Project ID or API Key is UNDEFINED in the worker environment for habitRoutes.");
    return c.json({ message: "Server configuration error: Firebase environment variables not set." }, 500);
  }

  // If env vars are set, proceed with placeholder logic for now.
  console.log("Firebase env vars seem to be set. Conceptual Firestore URL construction would follow.");
  const firestoreDocumentPath = `users/${user.localId}/habits`;
  const firestoreRestUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${firestoreDocumentPath}?key=${API_KEY}`;
  console.log(`Conceptual Firestore URL: ${firestoreRestUrl}`);

  console.log("Returning placeholder empty array for GET /api/habits as actual fetch is not yet implemented/debugged.");
  return c.json([], 200);
});

// Placeholder for POST /api/habits
habitRoutes.post('/', async (c) => {
    const user = c.get('user');
    console.log(`User ${user?.localId} attempting to POST to /api/habits. Logic pending. Body:`, await c.req.json().catch(() => ({})));
    // For now, to avoid a 500 if this is called, return a 201 with a clear message.
    // The actual implementation will involve saving to Firestore and returning the created habit.
    return c.json({ message: "POST /api/habits endpoint is a placeholder. Habit not saved." }, 201);
});

// Placeholder for PUT /api/habits/:id
habitRoutes.put('/:id', async (c) => {
    const user = c.get('user');
    const habitId = c.req.param('id');
    console.log(`User ${user?.localId} attempting to PUT /api/habits/${habitId}. Logic pending. Body:`, await c.req.json().catch(() => ({})));
    return c.json({ message: `Update habit ${habitId} placeholder. Habit not updated.` }, 200);
});

// Placeholder for DELETE /api/habits/:id
habitRoutes.delete('/:id', async (c) => {
    const user = c.get('user');
    const habitId = c.req.param('id');
    console.log(`User ${user?.localId} attempting to DELETE /api/habits/${habitId}. Logic pending.`);
    return c.json({ message: `Delete habit ${habitId} placeholder. Habit not deleted.` }, 200);
});

// Placeholder for POST /api/habits/:id/complete
habitRoutes.post('/:id/complete', async (c) => {
    const user = c.get('user');
    const habitId = c.req.param('id');
    console.log(`User ${user?.localId} attempting to POST /api/habits/${habitId}/complete. Logic pending. Body:`, await c.req.json().catch(() => ({})));
    return c.json({ message: `Complete habit ${habitId} placeholder. Completion not saved.` }, 200);
});

export default habitRoutes;
