import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';

// This is a placeholder for your actual habit type.
// It should match the structure you have defined elsewhere.
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

// Middleware to verify the Firebase JWT token from the frontend.
// The 'verifyToken' function would be a utility you create that uses
// the Firebase REST API to validate the token. This is a crucial security step.
// For this example, we'll assume a middleware has already run and placed
// the user's UID in the context (e.g., c.get('userId')).

// GET /api/habits - Fetch all habits for the authenticated user
habitRoutes.get('/', async (c) => {
  try {
    // 1. Get the authenticated user's ID from the context.
    // This assumes a middleware has already verified the token and set the userId.
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ error: 'Unauthorized: User ID not found in token' }, 401);
    }

    // 2. Access environment variables for Firestore project ID and API key.
    // These are set in your wrangler.toml file.
    const projectId = c.env.VITE_FIREBASE_PROJECT_ID;
    const apiKey = c.env.VITE_FIREBASE_API_KEY;

    if (!projectId || !apiKey) {
      console.error("Firebase Project ID or API Key is not configured in the environment.");
      return c.json({ error: 'Server configuration error' }, 500);
    }

    // 3. Construct the URL for the Firestore REST API.
    // This URL targets the 'habits' sub-collection for the specific user.
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}/habits`;

    // 4. Append the API key as a query parameter.
    // This is the critical fix for the "API key not valid" error.
    const urlWithKey = `${firestoreUrl}?key=${apiKey}`;

    // 5. Make the authenticated fetch request to Firestore.
    const response = await fetch(urlWithKey, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Firestore API error:', errorData);
      return c.json({ error: 'Failed to fetch habits from database' }, response.status);
    }

    const responseData = await response.json();

    // 6. Process the response from Firestore to a more friendly format.
    // The Firestore REST API returns a complex object that we need to simplify.
    const habits = responseData.documents?.map((doc: FirestoreDocument) => {
      const habitData: any = {};
      for (const key in doc.fields) {
        // This simple version assumes all fields are stringValue.
        // A real implementation would need to handle different types (integerValue, booleanValue, etc.)
        habitData[key] = Object.values(doc.fields[key])[0];
      }
      // Extract the document ID from the full 'name' path
      habitData.id = doc.name.split('/').pop();
      return habitData;
    }) || [];

    // For now, we return an empty completions array as in the original code.
    // This would be fetched from a separate 'completions' collection in a real app.
    const completions = [];

    return c.json({ habits, completions });

  } catch (error) {
    console.error('Error in /api/habits route:', error);
    return c.json({ error: 'An internal server error occurred' }, 500);
  }
});

// You would add other routes (POST, PUT, DELETE) for habits here.

export default habitRoutes;
