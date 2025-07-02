import { Hono } from 'hono';
import type { AppEnv } from '../hono'; // Import the shared AppEnv type
import type { Context as HonoContext } from 'hono';

// Create a new Hono instance specifically for these user routes.
const userRoutes = new Hono<AppEnv>();

// Placeholder for Firestore interaction logic (similar to habitRoutes.ts)
const getDbClient = (c: HonoContext) => { // c will be typed based on AppEnv from userRoutes instance
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

// POST /initialize - Corresponds to POST /api/users/initialize
// Auth is handled by middleware in index.ts for paths matching /api/users/*
userRoutes.post('/initialize', async (c) => {
  try {
    const authenticatedUser = c.get('user');

    if (!authenticatedUser || !authenticatedUser.localId) {
      return c.json({ message: 'User not authenticated or localId missing' }, 401);
    }
    // const db = getDbClient(c); // DB client placeholder

    const { localId, email } = authenticatedUser;
    const displayName = authenticatedUser.displayName || email;

    // Temporarily return mock response
    const mockUserResponse = {
        userId: localId,
        email,
        displayName,
        createdAt: new Date().toISOString(),
        message: "User initialized (mock response)"
    };
    console.log(`User ${localId} initializing. DB logic pending.`);

    // Simulate checking if user exists and returning 200 or 201
    // For now, just return 200 with mock data as if user exists or was created.
    return c.json(mockUserResponse, 200);

    // Actual DB logic (commented out for now):
    /*
    const userRef = db.collection('users').doc(localId);
    const doc = await userRef.get();

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
      return c.json(newUser, 201);
    } else {
      return c.json(doc.data(), 200);
    }
    */
  } catch (error) {
    console.error('Error initializing user:', error);
    const err = error as Error;
    return c.json({ message: 'Internal server error', errorName: err.name, errorDetail: err.message }, 500);
  }
});

export default userRoutes; // Export this Hono instance
