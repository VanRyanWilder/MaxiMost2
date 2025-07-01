import { Hono, Context as HonoCtx } from 'hono';
// REMOVED: import { honoProtectWithFirebase } from '@/middleware/authMiddleware'; // Auth is global
// REMOVED: import { db, admin } from '@/config/firebaseAdmin'; // firebase-admin is uninstalled
// REMOVED: import type { DecodedIdToken } from 'firebase-admin/auth'; // No longer using firebase-admin types

// Define the expected environment for this router, similar to habitRoutes
type UserAppEnv = {
  Variables: {
    user: any; // From the global authMiddleware (Firebase REST API user object)
  };
  Bindings: {
    FIREBASE_WEB_API_KEY: string; // From global app env
     // Potentially add DB binding here
  };
};

// Placeholder for Firestore interaction logic (similar to habitRoutes.ts)
const getDbClient = (c: HonoCtx<UserAppEnv>) => {
  console.warn("Firestore client not implemented for Cloudflare Workers without firebase-admin (userRoutes).");
  return {
    collection: (name: string) => ({
      doc: (id: string) => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async (data: any) => {},
      }),
    }),
    FieldValue: {
        serverTimestamp: () => new Date().toISOString(),
      },
  };
};


const app = new Hono<UserAppEnv>();

// REMOVED: honoProtectWithFirebase from individual route
app.post('/initialize', async (c: HonoCtx<UserAppEnv>) => {
  try {
    const authenticatedUser = c.get('user'); // User from global authMiddleware

    if (!authenticatedUser || !authenticatedUser.localId) {
      // This case should ideally be handled by global authMiddleware already
      return c.json({ message: 'User not authenticated or localId missing' }, 401);
    }
    const db = getDbClient(c);

    const { localId, email } = authenticatedUser;
    // The user object from Firebase REST API (accounts:lookup) might have users[0].displayName
    const displayName = authenticatedUser.displayName || email; // Fallback to email if displayName is not present

    const userRef = db.collection('users').doc(localId);
    const doc = await userRef.get();

    if (!doc.exists) {
      const newUser = {
        userId: localId,
        email,
        displayName,
        createdAt: db.FieldValue.serverTimestamp(), // Using mocked FieldValue
        // roles: ['user'], // Example default role
        // preferences: {}, // Example default preferences
      };
      await userRef.set(newUser);
      c.status(201);
      return c.json(newUser);
    } else {
      c.status(200);
      return c.json(doc.data());
    }
  } catch (error) {
    console.error('Error initializing user:', error);
    const err = error as Error;
    return c.json({ message: 'Internal server error', errorName: err.name, errorDetail: err.message }, 500);
  }
});

export default app;
