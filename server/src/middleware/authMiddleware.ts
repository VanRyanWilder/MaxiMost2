import { createMiddleware } from 'hono/factory';
import type { Bindings, Variables } from '../hono'; // Import the shared types

// The middleware factory will infer context types if used with the typed app instance.
// However, explicitly typing it here with createMiddleware<{ Bindings, Variables }>()
// ensures clarity and allows this middleware to be developed/tested independently
// or used with other Hono apps sharing the same Env structure.

export const authMiddleware = createMiddleware<{
  Bindings: Bindings; // From hono.ts
  Variables: Variables; // From hono.ts
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const idToken = authHeader.split('Bearer ')[1];
  const apiKey = c.env.FIREBASE_WEB_API_KEY;
  const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: idToken }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || 'Invalid token');
    }

    // Assuming the first user in the array is the one we want
    if (data.users && data.users.length > 0) {
      c.set('user', data.users[0]);
    } else {
      // Handle case where no user data is returned, though successful lookup should return it
      throw new Error('User data not found in token verification response.');
    }
    await next();
  } catch (error: any) {
    console.error('Error in authMiddleware:', error); // Log the actual error
    return c.json({ error: 'Unauthorized', message: error.message }, 401);
  }
});
