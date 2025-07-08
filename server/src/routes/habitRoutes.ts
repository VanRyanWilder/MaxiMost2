import { Hono } from 'hono';
import type { AppEnv } from '../hono'; // Shared types
import { authMiddleware } from '../middleware/authMiddleware'; // Correct Auth middleware
import * as firestoreClient from '../lib/firestoreClient'; // Import the new client

const habitRoutes = new Hono<AppEnv>();

// Apply authMiddleware to all routes in this file
habitRoutes.use('*', authMiddleware);

// GET /api/habits - Fetch all habits for the authenticated user
habitRoutes.get('/', async (c) => {
  const user = c.get('user');
  if (!user?.localId) {
    return c.json({ message: "User ID not found in token." }, 400);
  }

  const PROJECT_ID = c.env.VITE_FIREBASE_PROJECT_ID; // Changed to match wrangler.toml
  const API_KEY = c.env.VITE_FIREBASE_API_KEY;     // Changed to match wrangler.toml

  if (!PROJECT_ID || !API_KEY) {
    console.error("CRITICAL: Backend VITE_FIREBASE_PROJECT_ID or VITE_FIREBASE_API_KEY is UNDEFINED in habitRoutes.get.");
    return c.json({ message: "Server configuration error." }, 500);
  }

  try {
    const authHeader = c.req.header('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];
    // idToken is optional for listDocuments in firestoreClient, but good practice to ensure it's passed if present for Firestore rules.
    // If authMiddleware is strict, idToken should always be present.
    // For now, we make it optional in the client call, matching the client's current optional idToken param.

    const collectionPath = `users/${user.localId}/habits`;
    const habits = await firestoreClient.listDocuments(collectionPath, API_KEY, PROJECT_ID, idToken);
    console.log(`Successfully fetched ${habits.length} habits for user ${user.localId}.`);
    return c.json(habits, 200);
  } catch (error: any) {
    console.error("Error fetching habits using firestoreClient:", error);
    return c.json({ message: error.message || "Server exception while fetching habits.", details: error.details }, error.status || 500);
  }
});

// POST /api/habits - Create a new habit for the authenticated user
habitRoutes.post('/', async (c) => {
  const user = c.get('user');
  if (!user?.localId) {
    return c.json({ message: "User ID not found in token." }, 400);
  }

  const PROJECT_ID = c.env.VITE_FIREBASE_PROJECT_ID; // Changed to match wrangler.toml
  const API_KEY = c.env.VITE_FIREBASE_API_KEY;     // Changed to match wrangler.toml

  if (!PROJECT_ID || !API_KEY) {
    console.error("CRITICAL: Backend VITE_FIREBASE_PROJECT_ID or VITE_FIREBASE_API_KEY is UNDEFINED in habitRoutes.post.");
    return c.json({ message: "Server configuration error." }, 500);
  }

  let newHabitData;
  try {
    newHabitData = await c.req.json();
  } catch (error) {
    return c.json({ message: "Invalid request body." }, 400);
  }

  if (!newHabitData || typeof newHabitData.title !== 'string' || newHabitData.title.trim() === '') {
    return c.json({ message: "Habit title is required." }, 400);
  }

  // Add server-generated fields
  const dataToSave = {
    ...newHabitData,
    userId: user.localId, // Ensure userId is associated with the habit
    createdAt: new Date().toISOString(),
    streak: 0,
    isActive: true, // Default to active
    completions: [], // Initialize with empty completions array
  };

  try {
    const authHeader = c.req.header('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    const collectionPath = `users/${user.localId}/habits`;
    const createdHabit = await firestoreClient.addDocument(collectionPath, dataToSave, API_KEY, PROJECT_ID, idToken);
    console.log(`Successfully created habit ${createdHabit.id} for user ${user.localId}.`);
    return c.json(createdHabit, 201);
  } catch (error: any) {
    console.error("Error creating habit using firestoreClient:", error);
    return c.json({ message: error.message || "Server exception while creating habit.", details: error.details }, error.status || 500);
  }
});

// GET /api/habits/:habitId - Fetch a specific habit
habitRoutes.get('/:habitId', async (c) => {
  const user = c.get('user');
  const habitId = c.req.param('habitId');
  if (!user?.localId) {
    return c.json({ message: "User ID not found in token." }, 400);
  }

  const PROJECT_ID = c.env.VITE_FIREBASE_PROJECT_ID; // Changed to match wrangler.toml
  const API_KEY = c.env.VITE_FIREBASE_API_KEY;     // Changed to match wrangler.toml

  if (!PROJECT_ID || !API_KEY) {
    console.error("CRITICAL: Backend VITE_FIREBASE_PROJECT_ID or VITE_FIREBASE_API_KEY is UNDEFINED in habitRoutes.get single.");
    return c.json({ message: "Server configuration error." }, 500);
  }

  try {
    const authHeader = c.req.header('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    const documentPath = `users/${user.localId}/habits/${habitId}`;
    const habit = await firestoreClient.getDocument(documentPath, API_KEY, PROJECT_ID, idToken);
    if (!habit) {
      return c.json({ message: "Habit not found." }, 404);
    }
    // Ensure the fetched habit belongs to the user (though path implies it)
    if (habit.userId && habit.userId !== user.localId) {
        return c.json({ message: "Forbidden: Habit does not belong to user." }, 403);
    }
    return c.json(habit, 200);
  } catch (error: any) {
    console.error(`Error fetching habit ${habitId}:`, error);
    return c.json({ message: error.message || "Server exception while fetching habit.", details: error.details }, error.status || 500);
  }
});


// PUT /api/habits/:habitId - Update a specific habit
habitRoutes.put('/:habitId', async (c) => {
  const user = c.get('user');
  const habitId = c.req.param('habitId');
  if (!user?.localId) {
    return c.json({ message: "User ID not found in token." }, 400);
  }

  const PROJECT_ID = c.env.VITE_FIREBASE_PROJECT_ID; // Changed to match wrangler.toml
  const API_KEY = c.env.VITE_FIREBASE_API_KEY;     // Changed to match wrangler.toml

  if (!PROJECT_ID || !API_KEY) {
     console.error("CRITICAL: Backend VITE_FIREBASE_PROJECT_ID or VITE_FIREBASE_API_KEY is UNDEFINED in habitRoutes.put.");
    return c.json({ message: "Server configuration error." }, 500);
  }

  let habitUpdateData;
  try {
    habitUpdateData = await c.req.json();
  } catch (error) {
    return c.json({ message: "Invalid request body." }, 400);
  }

  // Remove fields that should not be directly updatable or are path parameters
  const { id, userId, createdAt, completions, ...dataToUpdate } = habitUpdateData;
  dataToUpdate.updatedAt = new Date().toISOString(); // Add/update timestamp

  try {
    const authHeader = c.req.header('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    const documentPath = `users/${user.localId}/habits/${habitId}`;
    // Optional: Fetch document first to ensure it exists and belongs to user (or rely on Firestore rules)
    const updatedHabit = await firestoreClient.updateDocument(documentPath, dataToUpdate, API_KEY, PROJECT_ID, idToken);
    console.log(`Successfully updated habit ${habitId} for user ${user.localId}.`);
    return c.json(updatedHabit, 200);
  } catch (error: any) {
    console.error(`Error updating habit ${habitId}:`, error);
    if (error.status === 404) return c.json({ message: "Habit not found to update." }, 404);
    return c.json({ message: error.message || "Server exception while updating habit.", details: error.details }, error.status || 500);
  }
});

// DELETE /api/habits/:habitId - Delete a specific habit
habitRoutes.delete('/:habitId', async (c) => {
  const user = c.get('user');
  const habitId = c.req.param('habitId');
  if (!user?.localId) {
    return c.json({ message: "User ID not found in token." }, 400);
  }

  const PROJECT_ID = c.env.VITE_FIREBASE_PROJECT_ID; // Changed to match wrangler.toml
  const API_KEY = c.env.VITE_FIREBASE_API_KEY;     // Changed to match wrangler.toml

   if (!PROJECT_ID || !API_KEY) {
    console.error("CRITICAL: Backend VITE_FIREBASE_PROJECT_ID or VITE_FIREBASE_API_KEY is UNDEFINED in habitRoutes.delete.");
    return c.json({ message: "Server configuration error." }, 500);
  }

  try {
    const authHeader = c.req.header('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    const documentPath = `users/${user.localId}/habits/${habitId}`;
    // Optional: Check if document exists before attempting delete if client needs specific feedback
    await firestoreClient.deleteDocument(documentPath, API_KEY, PROJECT_ID, idToken);
    console.log(`Successfully deleted habit ${habitId} for user ${user.localId}.`);
    return c.json({ message: `Habit ${habitId} deleted successfully.` }, 200); // Or 204 No Content
  } catch (error: any) {
    console.error(`Error deleting habit ${habitId}:`, error);
     if (error.status === 404) return c.json({ message: "Habit not found to delete." }, 404);
    return c.json({ message: error.message || "Server exception while deleting habit.", details: error.details }, error.status || 500);
  }
});

// POST /api/habits/:habitId/complete - Mark a habit as complete for a specific date
// This endpoint needs careful consideration for idempotency and how completions are stored.
// Assuming completions are subcollections or arrays within the habit document.
// For this example, let's assume we add a completion entry to a 'completions' subcollection.
habitRoutes.post('/:habitId/complete', async (c) => {
  const user = c.get('user');
  const habitId = c.req.param('habitId');
  if (!user?.localId) {
    return c.json({ message: "User ID not found in token." }, 400);
  }

  const PROJECT_ID = c.env.VITE_FIREBASE_PROJECT_ID; // Changed to match wrangler.toml
  const API_KEY = c.env.VITE_FIREBASE_API_KEY;     // Changed to match wrangler.toml

  if (!PROJECT_ID || !API_KEY) {
    console.error("CRITICAL: Backend VITE_FIREBASE_PROJECT_ID or VITE_FIREBASE_API_KEY is UNDEFINED in habitRoutes.complete.");
    return c.json({ message: "Server configuration error." }, 500);
  }

  let completionData;
  try {
    completionData = await c.req.json(); // Expects { date: "YYYY-MM-DD", value?: number }
  } catch (error) {
    return c.json({ message: "Invalid request body for completion." }, 400);
  }

  if (!completionData.date || typeof completionData.date !== 'string') {
    return c.json({ message: "Completion date (YYYY-MM-DD) is required." }, 400);
  }

  // The document ID for a completion could be the date string itself if unique per day.
  // Path: users/{userId}/habits/{habitId}/completions/{YYYY-MM-DD}
  const completionRecord = {
    date: completionData.date,
    value: typeof completionData.value === 'number' ? completionData.value : 1, // Default to 1 if not specified
    completedAt: new Date().toISOString(),
  };

  try {
    // Path for the completion document. Using date as ID assumes one completion entry per day per habit.
    // If multiple completions per day are possible, a different ID strategy is needed.
    const completionDocumentPath = `users/${user.localId}/habits/${habitId}/completions/${completionData.date}`;

    // Using updateDocument with date as ID effectively creates or overwrites the completion for that date.
    const authHeader = c.req.header('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    const savedCompletion = await firestoreClient.updateDocument(completionDocumentPath, completionRecord, API_KEY, PROJECT_ID, idToken);

    // TODO: Update habit's main document (e.g., streak, lastCompleted) if necessary. This might involve another Firestore call.
    // This logic can get complex and might be better handled by Firestore Functions or more sophisticated client logic.
    // For now, just saving the completion entry.

    console.log(`Successfully marked habit ${habitId} complete for date ${completionData.date} for user ${user.localId}.`);
    return c.json(savedCompletion, 201);
  } catch (error: any) {
    console.error(`Error marking habit ${habitId} complete:`, error);
    return c.json({ message: error.message || "Server exception while marking habit complete.", details: error.details }, error.status || 500);
  }
});

export default habitRoutes;
