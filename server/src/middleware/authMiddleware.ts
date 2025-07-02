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
  console.log('Auth middleware triggered.'); // 1. Check if middleware runs

  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth header missing or malformed.');
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const idToken = authHeader.split('Bearer ')[1];
  console.log('Received token:', idToken ? 'Yes (not logging content for security)' : 'No'); // 2. Check if token is extracted

  const apiKey = c.env.FIREBASE_WEB_API_KEY;
  const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

  if (!apiKey) {
    console.error('FIREBASE_WEB_API_KEY is not set in environment variables.');
    return c.json({ error: 'Internal Server Configuration Error', message: 'API key for token verification is missing.' }, 500);
  }

  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: idToken }),
    });

    const data = await response.json();

    // 3. Log the entire response from Google
    console.log('Google API Response Status:', response.status);
    console.log('Google API Response Body:', JSON.stringify(data, null, 2));

    if (!response.ok || data.error) {
      // Log detailed error from Google if available
      const errorMessage = data.error?.message || (response.ok ? 'Token valid but data structure unexpected.' : 'Invalid token or API error.');
      console.error('Token verification failed with Google API:', errorMessage, 'Full response data:', data);
      throw new Error(errorMessage);
    }

    // Assuming the first user in the array is the one we want
    if (data.users && data.users.length > 0) {
      c.set('user', data.users[0]);
      console.log('User set in context:', data.users[0].localId);
    } else {
      // Handle case where no user data is returned
      console.error('User data not found in token verification response, though response.ok was true.');
      throw new Error('User data not found in token verification response.');
    }
    await next();
  } catch (error: any) {
    // Log the error message that will be sent to the client
    console.error('Auth validation error, sending 401:', error.message);
    return c.json({ error: 'Unauthorized', message: error.message }, 401);
  }
});
