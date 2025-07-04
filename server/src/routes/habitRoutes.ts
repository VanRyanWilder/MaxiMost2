import { Hono } from 'hono';

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

// --- TEMPORARILY DISABLED FOR DEBUGGING ---
// The authentication middleware is commented out to isolate the Firestore API call.
/*
habitRoutes.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const googleApiUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${c.env.VITE_FIREBASE_API_KEY}`;

  try {
    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });

    if (!response.ok) {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }

    const data: any = await response.json();
    const userId = data?.users?.[0]?.localId;

    if (!userId) {
      return c.json({ error: 'Unauthorized: Could not identify user' }, 401);
    }

    c.set('userId', userId);
    await next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Internal server error during authentication' }, 500);
  }
});
*/

// GET /api/habits - Fetch all habits for the authenticated user
habitRoutes.get('/', async (c) => {
  try {
    // --- TEMPORARY DEBUGGING STEP ---
    // Using a hardcoded user ID because the middleware is disabled.
    // Replace 'test-user-id' with a real user ID from your Firebase Auth console
    // for a user that you know has habits in the database.
    const userId = 'test-user-id'; 
    console.log(`--- DEBUGGING: Using hardcoded userId: ${userId} ---`);


    // 2. Access environment variables for Firestore project ID and API key.
    const projectId = c.env.VITE_FIREBASE_PROJECT_ID;
    const apiKey = c.env.VITE_FIREBASE_API_KEY;

    console.log("Project ID from env:", projectId);
    console.log("API Key from env:", apiKey ? `Exists (ends with ...${apiKey.slice(-4)})` : "NOT FOUND");

    if (!projectId || !apiKey) {
      console.error("Firebase Project ID or API Key is not configured in the environment.");
      return c.json({ error: 'Server configuration error' }, 500);
    }

    // 3. Construct the URL for the Firestore REST API.
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}/habits`;

    // 4. Append the API key as a query parameter.
    const urlWithKey = `${firestoreUrl}?key=${apiKey}`;
    
    console.log("Requesting Firestore URL:", urlWithKey);

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

export default habitRoutes;
