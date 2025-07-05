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

  // If env vars are set, proceed with actual Firestore fetch.
  console.log("Firebase env vars seem to be set. Proceeding with Firestore fetch.");
  const firestoreDocumentPath = `users/${user.localId}/habits`;
  // Construct the URL to list documents in the user's habits collection
  const firestoreRestUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${firestoreDocumentPath}?key=${API_KEY}`;
  console.log(`Firestore List Documents URL: ${firestoreRestUrl}`);

  try {
    const response = await fetch(firestoreRestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error fetching habits." }));
      console.error(`Firestore error: ${response.status}`, errorData);
      return c.json({ message: "Error fetching habits from Firestore.", details: errorData }, response.status);
    }

    const responseData = await response.json();
    // Firestore returns a list of document objects, each containing fields.
    // We need to map these to a simpler array of habit objects.
    const habits = responseData.documents?.map((doc: any) => {
      // Extract fields and add the document ID (habit ID)
      const fields = doc.fields;
      const habit: any = {};
      for (const key in fields) {
        // Firestore stores values in typed properties (e.g., stringValue, integerValue)
        // We need to extract the actual value.
        if (fields[key].stringValue !== undefined) {
          habit[key] = fields[key].stringValue;
        } else if (fields[key].integerValue !== undefined) {
          habit[key] = parseInt(fields[key].integerValue, 10);
        } else if (fields[key].booleanValue !== undefined) {
          habit[key] = fields[key].booleanValue;
        } else if (fields[key].mapValue !== undefined) {
          // Handle nested map values if necessary, for now, simple properties
          habit[key] = fields[key].mapValue; // This might need further processing
        } else if (fields[key].arrayValue !== undefined) {
          habit[key] = fields[key].arrayValue.values?.map((v: any) => v.stringValue); // Assuming array of strings
        }
        // Add other type handlers as needed (e.g., timestampValue, doubleValue)
      }
      // The document ID is part of the 'name' field (e.g., projects/.../databases/(default)/documents/users/USER_ID/habits/HABIT_ID)
      // We extract the last part as the habit ID.
      habit.id = doc.name.split('/').pop();
      return habit;
    }) || [];

    console.log(`Successfully fetched ${habits.length} habits for user ${user.localId}.`);
    return c.json(habits, 200);

  } catch (error) {
    console.error("Exception during fetch to Firestore:", error);
    return c.json({ message: "Server exception while fetching habits." }, 500);
  }
});

// Placeholder for POST /api/habits
habitRoutes.post('/', async (c) => {
    const user = c.get('user');
    if (!user?.localId) {
        console.error('HabitRoutes POST /: User or user.localId not found in context.');
        return c.json({ message: "User ID not found in token." }, 400);
    }

    const PROJECT_ID = c.env.VITE_FIREBASE_PROJECT_ID;
    const API_KEY = c.env.VITE_FIREBASE_API_KEY;

    if (!PROJECT_ID || !API_KEY) {
        console.error("CRITICAL: Firebase Project ID or API Key is UNDEFINED in the worker environment for POST /api/habits.");
        return c.json({ message: "Server configuration error: Firebase environment variables not set." }, 500);
    }

    let newHabitData;
    try {
        newHabitData = await c.req.json();
    } catch (error) {
        console.error("Error parsing JSON body for POST /api/habits:", error);
        return c.json({ message: "Invalid request body." }, 400);
    }

    if (!newHabitData || typeof newHabitData.name !== 'string' || newHabitData.name.trim() === '') {
        return c.json({ message: "Habit name is required." }, 400);
    }

    // Construct Firestore document path (user's habits collection)
    // Firestore will auto-generate an ID for the new document in this collection.
    const firestoreCollectionPath = `users/${user.localId}/habits`;
    const firestoreRestUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${firestoreCollectionPath}?key=${API_KEY}`;

    // Prepare the Firestore document structure.
    // Firestore expects fields to be wrapped in type descriptors (e.g., { stringValue: "example" }).
    const firestoreDocument = {
        fields: {
            name: { stringValue: newHabitData.name },
            // Add any other fields from newHabitData, ensuring they are correctly typed.
            // Example: description: { stringValue: newHabitData.description || "" }
            // For now, only 'name' is mandatory.
        }
    };
    if (newHabitData.description) {
        firestoreDocument.fields.description = { stringValue: newHabitData.description };
    }
    // Add other potential fields as needed, e.g., frequency, reminderTime, etc.

    try {
        const response = await fetch(firestoreRestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(firestoreDocument),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Unknown error creating habit." }));
            console.error(`Firestore error during POST: ${response.status}`, errorData);
            return c.json({ message: "Error creating habit in Firestore.", details: errorData }, response.status);
        }

        const createdDocument = await response.json();

        // Construct the habit object to return, similar to GET, but from the created document.
        const habitId = createdDocument.name.split('/').pop();
        const returnedHabit: any = { id: habitId };
        for (const key in createdDocument.fields) {
            if (createdDocument.fields[key].stringValue !== undefined) {
                returnedHabit[key] = createdDocument.fields[key].stringValue;
            } else if (createdDocument.fields[key].integerValue !== undefined) {
                returnedHabit[key] = parseInt(createdDocument.fields[key].integerValue, 10);
            } // Add other types as necessary
        }

        console.log(`Successfully created habit ${habitId} for user ${user.localId}.`);
        return c.json(returnedHabit, 201); // 201 Created

    } catch (error) {
        console.error("Exception during POST to Firestore:", error);
        return c.json({ message: "Server exception while creating habit." }, 500);
    }
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
