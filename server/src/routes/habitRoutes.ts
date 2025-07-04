import { Hono } from 'hono';
// --- CORRECTED IMPORT SYNTAX ---
// Use a default import for the firebase-auth middleware
import firebaseAuth from '@hono/firebase-auth';

// This is a placeholder for your actual habit type.
type Habit = {
  id: string;
  title: string;
  // ... other habit properties
};

// This is the structure of the response from the Firestore REST API
type FirestoreDocument = {
  name: string;
  fields: {
    [key: string]: {
      stringValue?: string;
      integerValue?: string;
      booleanValue?: boolean;
      // ... other value types
    };
  };
  createTime: string;
  updateTime: string;
};

const habitRoutes = new Hono();

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
habitRoutes.get('/', async (c) => {
  try {
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

export default habitRoutes;
