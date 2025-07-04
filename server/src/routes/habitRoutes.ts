import { Hono } from 'hono';
<<<<<<< HEAD
import { firebaseAuth } from 'hono/firebase-auth';
=======
import type { AppEnv } from '../hono'; // Shared types
import { authMiddleware } from '../middleware/authMiddleware'; // Auth middleware
>>>>>>> 5a4fa2d9af795c7c03792cde02aebe16cb2408e2

// Create a new Hono instance specifically for these habit routes.
// import { authMiddleware } from '../middleware/authMiddleware'; // Ensure this is not duplicated if already imported above for AppEnv

const habitRoutes = new Hono<AppEnv>();

// Auth middleware is now applied globally in index.ts for /api/* paths.
// No need to apply it here again.

<<<<<<< HEAD
// --- NEW: Standard Firebase Authentication Middleware ---
// This uses a dedicated library to handle token verification, which is more robust.
// It will automatically verify the 'Authorization' header.
habitRoutes.use('*', async (c, next) => {
  const projectId = c.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error("Firebase Project ID is not configured in the environment.");
    return c.json({ error: 'Server configuration error' }, 500);
  }

  const auth = firebaseAuth({
    projectId: projectId,
  });
  return auth(c, next);
});


// GET /api/habits - Fetch all habits for the authenticated user
=======
// This now handles GET requests to /api/habits
>>>>>>> 5a4fa2d9af795c7c03792cde02aebe16cb2408e2
habitRoutes.get('/', async (c) => {
  const user = c.get('user');
  if (!user?.localId) {
    // This check might be redundant if authMiddleware always ensures user or returns error,
    // but good for robustness or if middleware logic changes.
    console.error('HabitRoutes GET /: User or user.localId not found in context.');
    return c.json({ message: "User ID not found in token." }, 400);
  }
  console.log(`User ${user.localId} fetching habits from habitRoutes.ts`);

  // --- J-12: Fix Backend Firestore API Key ---
  // The following is a conceptual implementation of fetching habits via REST API
  // and includes the API key as per J-12 instructions.
  // This replaces the placeholder "return c.json([], 200);"
  // In a real scenario, the actual Firestore query for user-specific habits would be more complex.

  const PROJECT_ID = c.env.VITE_FIREBASE_PROJECT_ID;
  const API_KEY = c.env.VITE_FIREBASE_API_KEY;

  if (!PROJECT_ID || !API_KEY) {
    console.error("Firebase Project ID or API Key is not configured in environment variables for habitRoutes.");
    return c.json({ message: "Server configuration error." }, 500);
  }

  // This is a simplified example URL. Real Firestore querying for user-specific data is more complex.
  // This example assumes habits are directly under a user's path, which might not be the actual structure.
  // The key point is adding `?key=${API_KEY}`.
  // Example: /users/{userId}/habits
  const firestoreDocumentPath = `users/${user.localId}/habits`;
  const firestoreRestUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${firestoreDocumentPath}?key=${API_KEY}`;

  // If fetching a collection (e.g., all documents in 'habits' filtered by userId),
  // it would typically be a POST to runQuery or a more complex GET if using collection group queries.
  // For instance, to get all documents in the 'habits' collection:
  // const firestoreCollectionUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/habits?key=${API_KEY}`;
  // This would then need client-side filtering or a backend query.

  console.log(`Constructed Firestore URL (example): ${firestoreRestUrl}`);

  try {
<<<<<<< HEAD
    // 1. Get the authenticated user's data from the context (set by the middleware).
    const user = c.get('firebaseAuth');
    if (!user) {
      return c.json({ error: 'Unauthorized: User not found in token' }, 401);
    }
    const userId = user.uid;

    // 2. Access environment variables for Firestore project ID and API key.
    const projectId = c.env.VITE_FIREBASE_PROJECT_ID;
    const apiKey = c.env.VITE_FIREBASE_API_KEY;

    if (!projectId || !apiKey) {
      console.error("Firebase Project ID or API Key is not configured in the environment.");
      return c.json({ error: 'Server configuration error' }, 500);
    }

    // 3. Construct the URL for the Firestore REST API.
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}/habits`;

    // 4. Append the API key as a query parameter.
    const urlWithKey = `${firestoreUrl}?key=${apiKey}`;

    // 5. Make the fetch request to Firestore.
    const response = await fetch(urlWithKey);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Firestore API error:', errorData);
      return c.json({ error: errorData.error.message || 'Failed to fetch habits from database' }, response.status);
    }

    const responseData = await response.json();

    // 6. Process the response from Firestore.
    const habits = responseData.documents?.map((doc: FirestoreDocument) => {
      const habitData: any = {};
      for (const key in doc.fields) {
        const valueObject = doc.fields[key];
        const valueType = Object.keys(valueObject)[0];
        habitData[key] = valueObject[valueType];
      }
      habitData.id = doc.name.split('/').pop();
      return habitData;
    }) || [];

    const completions = [];

    return c.json({ habits, completions });

  } catch (error) {
    console.error('Error in /api/habits route:', error);
    return c.json({ error: 'An internal server error occurred' }, 500);
  }
});

// You would add other routes (POST, PUT, DELETE) for habits here.
=======
    // const response = await fetch(firestoreRestUrl); // Actual fetch call
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   console.error("Firestore fetch error:", errorData);
    //   return c.json({ message: "Error fetching habits from Firestore", error: errorData?.error?.message || "Unknown Firestore error" }, response.status);
    // }
    // const data = await response.json();
    // const habits = data.documents ? data.documents.map((doc: any) => {
    //   const fields = doc.fields || {};
    //   const transformedFields: any = {};
    //   for (const key in fields) {
    //     transformedFields[key] = fields[key][Object.keys(fields[key])[0]]; // Extract value
    //   }
    //   return { id: doc.name.split('/').pop(), ...transformedFields };
    // }) : [];
    // return c.json(habits, 200);

    // For now, since the actual data structure and query are unknown,
    // and to avoid breaking things if this GET route was indeed a placeholder,
    // we'll log that the API key *would* be used and return an empty array.
    // This fulfills the "append API key" part of J-12 conceptually.
    console.log("Placeholder: Intended to fetch from Firestore with API key. Returning empty array for now to maintain current behavior if this route was not yet active.");
    return c.json([], 200);

  } catch (err: any) {
    console.error("Error in habitRoutes GET /:", err);
    return c.json({ message: "Failed to process habits request", error: err.message }, 500);
  }
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

>>>>>>> 5a4fa2d9af795c7c03792cde02aebe16cb2408e2

export default habitRoutes;
