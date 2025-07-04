import { Hono } from 'hono';
// This 'import * as' syntax is more robust for handling complex module exports.
import * as firebaseAuthMiddleware from '@hono/firebase-auth';

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

// --- Authentication Middleware ---
habitRoutes.use('*', async (c, next) => {
  // --- FIX: Use the backend-specific environment variable ---
  const projectId = c.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error("Backend FIREBASE_PROJECT_ID is not configured in the environment.");
    return c.json({ error: 'Server configuration error' }, 500);
  }

  const auth = firebaseAuthMiddleware.firebaseAuth({
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

    // 2. Access backend-specific environment variables.
    // --- FIX: Use the backend-specific environment variables ---
    const projectId = c.env.FIREBASE_PROJECT_ID;
    const apiKey = c.env.FIREBASE_API_KEY;

    if (!projectId || !apiKey) {
      console.error("Backend FIREBASE_PROJECT_ID or FIREBASE_API_KEY is not configured.");
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
    const habits = (responseData.documents || []).map((doc: FirestoreDocument) => {
      if (!doc || !doc.fields) return null;
      
      const habitData: any = {};
      for (const key in doc.fields) {
        const valueObject = doc.fields[key];
        if (valueObject && typeof valueObject === 'object') {
          const valueType = Object.keys(valueObject)[0];
          if (valueType) {
            habitData[key] = valueObject[valueType];
          }
        }
      }
      habitData.id = doc.name ? doc.name.split('/').pop() : null;
      return habitData;
    }).filter(habit => habit !== null);

    const completions = [];

    return c.json({ habits, completions });

  } catch (error: any) {
    console.error('CRITICAL: Unhandled error in /api/habits route:', error.message);
    return c.json({ error: 'An internal server error occurred' }, 500);
  }
});

export default habitRoutes;
