import { Hono } from 'hono';
import type { AppEnv } from '../hono'; // Import the shared AppEnv type
import type { Context as HonoContext } from 'hono';
// Assuming these types are still relevant for request/response bodies or eventual DB interaction
import type { FirestoreHabit as HabitDoc, HabitCompletionEntry as CompletionDoc, FirestoreTimestamp as TimestampDoc } from "@shared/types/firestore";

// Create a new Hono instance specifically for these habit routes.
const habitRoutes = new Hono<AppEnv>();

// Placeholder for Firestore interaction logic.
// This will need to be replaced with actual logic that uses a Firestore client
// compatible with Cloudflare Workers (e.g., using Firestore REST API or a lightweight client).
const getDbClient = (c: HonoContext) => { // c will be typed based on AppEnv from habitRoutes instance
    // Example: return new FirestoreClient({ apiKey: c.env.FIREBASE_WEB_API_KEY, ... });
    // console.warn("Firestore client not implemented for Cloudflare Workers without firebase-admin.");
    return {
      collection: (name: string) => ({
        where: (...args: any[]) => ({
          get: async () => ({
            empty: true,
            docs: [] as { id: string; data: () => any }[]
          })
        }),
        add: async (data: any) => ({
          get: async () => ({
            id: 'mock-id',
            data: () => data
          })
        }),
        doc: (id: string) => ({
          get: async () => ({
            exists: false,
            data: () => (null as any)
          }),
          update: async (data: any) => {},
          set: async (data: any) => {},
        }),
      }),
      FieldValue: {
          serverTimestamp: () => new Date().toISOString(),
          arrayUnion: (data: any) => data,
        },
    };
  };

const getCurrentDateString = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// GET / - Corresponds to GET /api/habits/
// Auth is handled by middleware in index.ts for paths matching /api/habits/*
habitRoutes.get('/', async (c) => {
  try {
    const authenticatedUser = c.get('user'); // User from global authMiddleware
    if (!authenticatedUser?.localId) {
      return c.json({ message: "User ID not found in token." }, 400);
    }
    // const db = getDbClient(c);
    console.log(`User ${authenticatedUser.localId} fetching habits. DB logic pending.`);
    return c.json([], 200); // Return empty array as per plan

    // Actual DB logic (commented out for now):
    /*
    const habitsSnapshot = await db.collection("habits")
      .where("userId", "==", authenticatedUser.localId)
      .where("isActive", "==", true)
      .get();

    if (habitsSnapshot.empty) {
      return c.json([], 200);
    }

    const habits = habitsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        habitId: doc.id,
        ...data
      };
    });

    return c.json(habits, 200);
    */
  } catch (error) {
    console.error("Error fetching habits:", error);
    const err = error as Error;
    return c.json({ message: "Error fetching habits.", errorDetail: err.message }, 500);
  }
});

// POST / - Corresponds to POST /api/habits/
habitRoutes.post('/', async (c) => {
  try {
    const authenticatedUser = c.get('user');
    if (!authenticatedUser?.localId) {
      return c.json({ message: "User ID not found in token." }, 400);
    }
    // const db = getDbClient(c);

    const body = await c.req.json();
    const { title, category, type } = body;

    if (!title || !category || !type) {
      return c.json({ message: "Missing required fields: title, category, and type." }, 400);
    }

    const mockNewHabit = {
      habitId: `mock-${Date.now()}`,
      userId: authenticatedUser.localId,
      ...body,
      createdAt: new Date().toISOString(),
      isActive: true,
      completions: [],
      streak: 0
    };
    console.log(`User ${authenticatedUser.localId} creating habit. DB logic pending. Payload:`, body);
    return c.json(mockNewHabit, 201);

    // Actual DB logic (commented out for now):
    /*
    const newHabitData = {
      userId: authenticatedUser.localId,
      ...body,
      createdAt: db.FieldValue.serverTimestamp(),
      isActive: true,
      completions: [],
      streak: 0
    };

    const habitRef = await db.collection("habits").add(newHabitData);
    const newHabitDoc = await habitRef.get();
    const newHabit = { habitId: newHabitDoc.id, ...newHabitDoc.data() };

    return c.json(newHabit, 201);
    */
  } catch (error) {
    console.error("Error creating habit:", error);
    const err = error as Error;
    return c.json({ message: "Error creating habit.", errorDetail: err.message }, 500);
  }
});

// PUT /:habitId - Corresponds to PUT /api/habits/:habitId
habitRoutes.put('/:habitId', async (c) => {
    try {
        const authenticatedUser = c.get('user');
        const habitId = c.req.param('habitId');
        if (!authenticatedUser?.localId) return c.json({ message: "Unauthorized." }, 401);
        if (!habitId) return c.json({ message: "Habit ID required." }, 400);
        // const db = getDbClient(c);
        const body = await c.req.json();

        const mockUpdatedHabit = { habitId, ...body, userId: authenticatedUser.localId };
        console.log(`User ${authenticatedUser.localId} updating habit ${habitId}. DB logic pending. Payload:`, body);
        return c.json(mockUpdatedHabit, 200);

        // Actual DB logic (commented out for now):
        /*
        const habitRef = db.collection("habits").doc(habitId);
        const doc = await habitRef.get();

        if (!doc.exists) return c.json({ message: "Habit not found." }, 404);
        const docData = doc.data();
        if (docData?.userId !== authenticatedUser.localId) return c.json({ message: "Forbidden." }, 403);

        await habitRef.update(body);
        const updatedDoc = await habitRef.get();

        return c.json({ habitId: updatedDoc.id, ...updatedDoc.data() }, 200);
        */
    } catch (error) {
        console.error("Error updating habit:", error);
        const err = error as Error;
        return c.json({ message: "Error updating habit.", errorDetail: err.message }, 500);
    }
});


// POST /:habitId/complete - Corresponds to POST /api/habits/:habitId/complete
habitRoutes.post('/:habitId/complete', async (c) => {
    try {
        const authenticatedUser = c.get('user');
        const habitId = c.req.param('habitId');
        const { value } = await c.req.json();
        // const db = getDbClient(c);

        if (!authenticatedUser?.localId) return c.json({ message: "Unauthorized." }, 401);
        if (!habitId) return c.json({ message: "Habit ID required." }, 400);
        if (typeof value !== 'number') return c.json({ message: "Value must be a number." }, 400);

        console.log(`User ${authenticatedUser.localId} completing habit ${habitId}. DB logic pending. Value: ${value}`);
        return c.json({ message: "Habit completion logged (mock)." }, 200);

        // Actual DB logic (commented out for now):
        /*
        const habitRef = db.collection("habits").doc(habitId);
        const habitDoc = await habitRef.get();

        if (!habitDoc.exists) return c.json({ message: "Habit not found." }, 404);

        const habitData = habitDoc.data() as HabitDoc;
        if (habitData.userId !== authenticatedUser.localId) return c.json({ message: "Forbidden." }, 403);

        const currentDateStr = getCurrentDateString();
        const serverTimestamp = db.FieldValue.serverTimestamp();

        const newCompletion: CompletionDoc = {
            date: currentDateStr,
            value,
            timestamp: serverTimestamp as any
        };

        await habitRef.update({
            completions: db.FieldValue.arrayUnion(newCompletion)
        });

        return c.json({ message: "Habit completion logged." }, 200);
        */
    } catch (error) {
        console.error("Error completing habit:", error);
        const err = error as Error;
        return c.json({ message: "Error completing habit.", errorDetail: err.message }, 500);
    }
});

// DELETE /:habitId - Corresponds to DELETE /api/habits/:habitId
habitRoutes.delete('/:habitId', async (c) => {
    try {
        const authenticatedUser = c.get('user');
        const habitId = c.req.param('habitId');
        if (!authenticatedUser?.localId) return c.json({ message: "Unauthorized." }, 401);
        if (!habitId) return c.json({ message: "Habit ID required." }, 400);
        // const db = getDbClient(c);

        console.log(`User ${authenticatedUser.localId} archiving habit ${habitId}. DB logic pending.`);
        return c.json({ message: "Habit archived successfully (mock)." }, 200);

        // Actual DB logic (commented out for now):
        /*
        const habitRef = db.collection("habits").doc(habitId);
        const doc = await habitRef.get();

        if (!doc.exists) return c.json({ message: "Habit not found." }, 404);
        const docData = doc.data();
        if (docData?.userId !== authenticatedUser.localId) return c.json({ message: "Forbidden." }, 403);

        await habitRef.update({ isActive: false });

        return c.json({ message: "Habit archived successfully." }, 200);
        */
    } catch (error) {
        console.error("Error archiving habit:", error);
        const err = error as Error;
        return c.json({ message: "Error archiving habit.", errorDetail: err.message }, 500);
    }
});

export default habitRoutes; // Export this Hono instance
