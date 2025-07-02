import { Hono } from 'hono';
import type { AppEnv } from '../hono'; // Import the shared AppEnv type
// If authMiddleware is needed for specific user routes, import it.
// import { authMiddleware } from '../middleware/authMiddleware';

// Create a new Hono instance specifically for these user routes.
const userRoutes = new Hono<AppEnv>();

// Example: GET /api/users/profile (Protected by authMiddleware applied in index.ts to /api/users/* or here)
// If authMiddleware is applied in index.ts to /api/users/*, then user context will be available.
// If not, and this route needs protection, apply it here:
// userRoutes.use('/profile', authMiddleware);
userRoutes.get('/profile', async (c) => {
  try {
    const user = c.get('user'); // Assumes authMiddleware has run (e.g. on /api/users/* in index.ts)
    if (!user?.localId) {
      console.error('UserRoutes GET /profile: User or user.localId not found in context.');
      return c.json({ message: "User context error or not authenticated." }, 401);
    }
    console.log(`[TRACE - userRoutes.ts] User ${user.localId} fetching profile.`);
    // Placeholder: Return mock profile data
    return c.json({
      userId: user.localId,
      email: user.email || 'N/A',
      displayName: user.displayName || 'N/A',
      message: "User profile data (mock)"
    });
  } catch (error: any) {
    console.error("Error in userRoutes GET /profile:", error);
    return c.json({ message: "Error fetching user profile.", errorDetail: error.message }, 500);
  }
});

// Example: POST /api/users/initialize (as per previous structure)
// This route might also need protection depending on its purpose.
// For now, assuming it's protected by api.use('/users/*', authMiddleware) in index.ts if that line is uncommented.
userRoutes.post('/initialize', async (c) => {
  try {
    const authenticatedUser = c.get('user');
    if (!authenticatedUser || !authenticatedUser.localId) {
      return c.json({ message: 'User not authenticated or localId missing for initialization' }, 401);
    }
    const { localId, email } = authenticatedUser;
    const displayName = authenticatedUser.displayName || email;

    const mockUserResponse = {
        userId: localId,
        email,
        displayName,
        createdAt: new Date().toISOString(),
        message: "User initialized (mock response from userRoutes.ts)"
    };
    console.log(`[TRACE - userRoutes.ts] User ${localId} initializing.`);
    return c.json(mockUserResponse, 200);
  } catch (error: any) {
    console.error('Error initializing user in userRoutes:', error);
    return c.json({ message: 'Internal server error during user initialization.', errorDetail: error.message }, 500);
  }
});


export default userRoutes;
