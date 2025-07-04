import { createMiddleware } from 'hono/factory';

// Define the shape of your environment variables
type Bindings = {
  FIREBASE_WEB_API_KEY: string;
};

// Define the shape of the variables you'll set in the context
type Variables = {
  user: any; // Or a more specific user type
};

export const authMiddleware = createMiddleware<{
  Bindings: Bindings;
  Variables: Variables;
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const idToken = authHeader.split('Bearer ')[1];
  const apiKey = c.env.VITE_FIREBASE_API_KEY; // Corrected to VITE_FIREBASE_API_KEY as per wrangler and other usage

  console.log('[AuthMiddleware] Attempting to verify token. Key used:', apiKey ? 'SET' : 'UNDEFINED');
  // For security, don't log the full key in production, but for debugging:
  // console.log('[AuthMiddleware] API Key value:', apiKey);

  if (!apiKey) {
    console.error('[AuthMiddleware] CRITICAL: VITE_FIREBASE_API_KEY is UNDEFINED.');
    return c.json({ error: 'Unauthorized: Server configuration error' }, 500); // Should be 500 if server misconfigured
  }

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

    c.set('user', data.users[0]);
    await next();
  } catch (error: any) {
    return c.json({ error: 'Unauthorized', message: error.message }, 401);
  }
});
