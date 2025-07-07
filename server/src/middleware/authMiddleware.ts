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
  const apiKey = c.env.FIREBASE_AUTH_API_KEY;
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
