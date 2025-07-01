import { Hono } from 'hono';
import type { Context as HonoCtx } from 'hono';
// REMOVED: import { db, admin } from '@/config/firebaseAdmin'; // firebase-admin is uninstalled
// REMOVED: import { honoProtectWithFirebase, AuthEnv } from '@/middleware/authMiddleware'; // Auth is global
import type { FirestoreHabit, HabitCompletionEntry, FirestoreTimestamp } from "@shared/types/firestore"; // Keep if types are still relevant

// Assuming db and admin (for serverTimestamp) will be handled differently or passed via context if still needed
// For now, direct usage of db and admin from firebaseAdmin will cause errors.
// This file will need significant rework if it's still meant to interact with Firestore
// without firebase-admin. The new authMiddleware provides c.get('user') which is generic.

// Define the expected environment for this router, including variables set by global middleware
type HabitAppEnv = {
  Variables: {
    user: any; // From the global authMiddleware
    // Potentially add DB client here if passed via context
  };
  Bindings: {
    // Potentially add DB binding here
    FIREBASE_WEB_API_KEY: string; // From global app env
  };
};

const app = new Hono<HabitAppEnv>();

const getCurrentDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Placeholder for Firestore interaction logic.
// This will need to be replaced with actual logic that uses a Firestore client
// compatible with Cloudflare Workers (e.g., using Firestore REST API or a lightweight client).
const getDbClient = (c: HonoCtx<HabitAppEnv>) => {
  // Example: return new FirestoreClient({ apiKey: c.env.FIREBASE_WEB_API_KEY, ... });
  console.warn("Firestore client not implemented for Cloudflare Workers without firebase-admin.");
  return {
    collection: (name: string) => ({
      where: (...args: any[]) => ({ get: async () => ({ empty: true, docs: [] }) }),
      add: async (data: any) => ({ get: async () => ({ id: 'mock-id', data: () => data }) }),
      doc: (id: string) => ({
        get: async () => ({ exists: false, data: () => null }),
        update: async (data: any) => {},
        set: async (data: any) => {},
      }),
    }),
    FieldValue: { // Mock FieldValue
        serverTimestamp: () => new Date().toISOString(), // Or appropriate mock
        arrayUnion: (data: any) => data, // Simplified mock
      },
  };
};


// GET / - Fetch all active habits for the authenticated user
// REMOVED: honoProtectWithFirebase from individual route
app.get('/', async (c: HonoCtx<HabitAppEnv>) => {
  try {
    const authenticatedUser = c.get('user'); // user is set by global authMiddleware
    if (!authenticatedUser?.localId) { // localId is typical for Firebase REST API user object
      return c.json({ message: "User ID not found in token." }, 400);
    }
    const db = getDbClient(c); // Get DB client instance

    const habitsSnapshot = await db.collection("habits")
      .where("userId", "==", authenticatedUser.localId)
      .where("isActive", "==", true)
      .get();

    if (habitsSnapshot.empty) {
      return c.json([], 200);
    }

    const habits = habitsSnapshot.docs.map((doc: any) => { // Type doc appropriately
      const data = doc.data();
      return {
        habitId: doc.id,
        ...data
      };
    });

    return c.json(habits, 200);
  } catch (error) {
    console.error("Error fetching habits:", error);
    const err = error as Error;
    return c.json({ message: "Error fetching habits.", errorDetail: err.message }, 500);
  }
});

// POST / - Create a new habit
// REMOVED: honoProtectWithFirebase
app.post('/', async (c: HonoCtx<HabitAppEnv>) => {
  try {
    const authenticatedUser = c.get('user');
    if (!authenticatedUser?.localId) {
      return c.json({ message: "User ID not found in token." }, 400);
    }
    const db = getDbClient(c);

    const body = await c.req.json();
    const { title, category, type } = body;

    if (!title || !category || !type) {
      return c.json({ message: "Missing required fields: title, category, and type." }, 400);
    }

    const newHabitData = {
      userId: authenticatedUser.localId,
      ...body,
      createdAt: db.FieldValue.serverTimestamp(), // Using mocked FieldValue
      isActive: true,
      completions: [],
      streak: 0
    };

    const habitRef = await db.collection("habits").add(newHabitData);
    const newHabitDoc = await habitRef.get();
    const newHabit = { habitId: newHabitDoc.id, ...newHabitDoc.data() };

    return c.json(newHabit, 201);
  } catch (error) {
    console.error("Error creating habit:", error);
    const err = error as Error;
    return c.json({ message: "Error creating habit.", errorDetail: err.message }, 500);
  }
});

// PUT /:habitId - Update an existing habit
// REMOVED: honoProtectWithFirebase
app.put('/:habitId', async (c: HonoCtx<HabitAppEnv>) => {
    try {
        const authenticatedUser = c.get('user');
        const habitId = c.req.param('habitId');
        if (!authenticatedUser?.localId) return c.json({ message: "Unauthorized." }, 401);
        if (!habitId) return c.json({ message: "Habit ID required." }, 400);
        const db = getDbClient(c);

        const body = await c.req.json();
        const habitRef = db.collection("habits").doc(habitId);
        const doc = await habitRef.get();

        if (!doc.exists) return c.json({ message: "Habit not found." }, 404);
        // Ensure doc.data() is not null before accessing userId
        const docData = doc.data();
        if (docData?.userId !== authenticatedUser.localId) return c.json({ message: "Forbidden." }, 403);


        await habitRef.update(body);
        const updatedDoc = await habitRef.get();

        return c.json({ habitId: updatedDoc.id, ...updatedDoc.data() }, 200);
    } catch (error) {
        console.error("Error updating habit:", error);
        const err = error as Error;
        return c.json({ message: "Error updating habit.", errorDetail: err.message }, 500);
    }
});


// POST /:habitId/complete - Mark a habit as complete
// REMOVED: honoProtectWithFirebase
app.post('/:habitId/complete', async (c: HonoCtx<HabitAppEnv>) => {
    try {
        const authenticatedUser = c.get('user');
        const habitId = c.req.param('habitId');
        const { value } = await c.req.json();
        const db = getDbClient(c);

        if (!authenticatedUser?.localId) return c.json({ message: "Unauthorized." }, 401);
        if (!habitId) return c.json({ message: "Habit ID required." }, 400);
        if (typeof value !== 'number') return c.json({ message: "Value must be a number." }, 400);

        const habitRef = db.collection("habits").doc(habitId);
        const habitDoc = await habitRef.get();

        if (!habitDoc.exists) return c.json({ message: "Habit not found." }, 404);

        const habitData = habitDoc.data() as FirestoreHabit; // Assuming FirestoreHabit type
        if (habitData.userId !== authenticatedUser.localId) return c.json({ message: "Forbidden." }, 403);

        const currentDateStr = getCurrentDateString();
        const serverTimestamp = db.FieldValue.serverTimestamp(); // Using mocked FieldValue

        const newCompletion: HabitCompletionEntry = {
            date: currentDateStr,
            value,
            timestamp: serverTimestamp as any // Cast for type compatibility
        };

        await habitRef.update({
            completions: db.FieldValue.arrayUnion(newCompletion) // Using mocked FieldValue
        });

        return c.json({ message: "Habit completion logged." }, 200);
    } catch (error) {
        console.error("Error completing habit:", error);
        const err = error as Error;
        return c.json({ message: "Error completing habit.", errorDetail: err.message }, 500);
    }
});

// DELETE /:habitId - Archive a habit
// REMOVED: honoProtectWithFirebase
app.delete('/:habitId', async (c: HonoCtx<HabitAppEnv>) => {
    try {
        const authenticatedUser = c.get('user');
        const habitId = c.req.param('habitId');
        if (!authenticatedUser?.localId) return c.json({ message: "Unauthorized." }, 401);
        if (!habitId) return c.json({ message: "Habit ID required." }, 400);
        const db = getDbClient(c);

        const habitRef = db.collection("habits").doc(habitId);
        const doc = await habitRef.get();

        if (!doc.exists) return c.json({ message: "Habit not found." }, 404);
        const docData = doc.data();
        if (docData?.userId !== authenticatedUser.localId) return c.json({ message: "Forbidden." }, 403);


        await habitRef.update({ isActive: false });

        return c.json({ message: "Habit archived successfully." }, 200);
    } catch (error) {
        console.error("Error archiving habit:", error);
        const err = error as Error;
        return c.json({ message: "Error archiving habit.", errorDetail: err.message }, 500);
    }
});

export default app;
