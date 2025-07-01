import { Hono, Context as HonoCtx } from 'hono';
// REMOVED: import { honoProtectWithFirebase } from '@/middleware/authMiddleware'; // Auth is global
// REMOVED: import { db, admin } from '@/config/firebaseAdmin'; // firebase-admin is uninstalled
// REMOVED: import type { DecodedIdToken } from 'firebase-admin/auth'; // No longer using firebase-admin types

import { app } from '../hono'; // Import our single, typed app instance
import type { Context as HonoContext } from 'hono'; // Renamed to avoid conflict

// No new Hono instance here. We extend the imported 'app'.
// Types for context (c) will be inferred from the imported 'app'.

// Placeholder for Firestore interaction logic (similar to habitRoutes.ts)
const getDbClient = (c: HonoContext) => { // Using aliased HonoContext
  // console.warn("Firestore client not implemented for Cloudflare Workers without firebase-admin (userRoutes).");
  return {
    collection: (name: string) => ({
      doc: (id: string) => ({
        get: async () => ({
          exists: false,
          data: () => (null as any)
        }),
        set: async (data: any) => {},
      }),
    }),
    FieldValue: {
        serverTimestamp: () => new Date().toISOString(),
      },
  };
};

// Routes are defined on the imported 'app'
app.post('/initialize', async (c) => { // No need for explicit HonoCtx<AppEnv>
  try {
    const authenticatedUser = c.get('user');

    if (!authenticatedUser || !authenticatedUser.localId) {
      return c.json({ message: 'User not authenticated or localId missing' }, 401);
    }
    // const db = getDbClient(c);

    const { localId, email } = authenticatedUser;
    const displayName = authenticatedUser.displayName || email;

    // Temporarily return mock response
    const mockUser = {
        userId: localId,
        email,
        displayName,
        createdAt: new Date().toISOString(),
    };
    console.log(`User ${localId} initializing. DB logic pending.`);

    // Simulate new user vs existing user for testing - simplified mock
    // The 'doc' variable was not defined in this branch of the mock logic previously.
    // We'll just simulate a new user for now to pass the build.
    // A more sophisticated mock would require fetching a mock 'doc'.
    if (localId === "new-user-test-id") {
        return c.json(mockUser, 201);
    } else {
        // Simulate existing user by adding an 'existing' flag
        return c.json({ ...mockUser, existing: true }, 200);
    }

    // Actual DB logic (commented out for now):
    /*
    const userRef = db.collection('users').doc(localId);
    const doc = await userRef.get(); // This was missing in the mock logic branch

    if (!doc.exists) {
      const newUser = {
        userId: localId,
        email,
        displayName,
        createdAt: db.FieldValue.serverTimestamp(),
        // roles: ['user'],
        // preferences: {},
      };
      await userRef.set(newUser);
      c.status(201);
      return c.json(newUser);
    } else {
      c.status(200);
      return c.json(doc.data());
    }
    */
  } catch (error) {
    console.error('Error initializing user:', error);
    const err = error as Error;
    return c.json({ message: 'Internal server error', errorName: err.name, errorDetail: err.message }, 500);
  }
});

export default app;
