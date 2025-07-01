import { Hono, Context as HonoCtx } from 'hono';
// REMOVED: import { honoProtectWithFirebase } from '@/middleware/authMiddleware'; // Auth is global
// REMOVED: import { db, admin } from '@/config/firebaseAdmin'; // firebase-admin is uninstalled
// REMOVED: import type { DecodedIdToken } from 'firebase-admin/auth'; // No longer using firebase-admin types

import { app } from '../hono'; // Import our single, typed app instance
import type { Context as HonoCtx } from 'hono';

// No new Hono instance here. We extend the imported 'app'.
// Types for context (c) will be inferred from the imported 'app'.

// Placeholder for Firestore interaction logic (similar to habitRoutes.ts)
const getDbClient = (c: HonoCtx) => { // Context type will be inferred from app
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
    // Simulate new user vs existing user for testing
    if (localId === "new-user-test-id" || !doc.exists) { // Adjusted for mock
        return c.json(mockUser, 201);
    } else {
        return c.json({ ...mockUser, existing: true, ...doc.data() }, 200); // Include mock doc.data()
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
