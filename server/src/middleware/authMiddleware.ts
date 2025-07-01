import { Hono } from 'hono';

const app = new Hono();

// New Auth Middleware using REST API
app.use('/api/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const idToken = authHeader.split('Bearer ')[1];
  const apiKey = c.env.FIREBASE_WEB_API_KEY; // AIzaSyAml6FYQQOuhG2_EpPRs2AahkdDWdeic5w
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

    // Optionally set the user data for downstream routes
    c.set('user', data.users[0]);
    await next();

  } catch (error) {
    return c.json({ error: 'Unauthorized', message: error.message }, 401);
  }
});

// ... Your existing API routes come AFTER this middleware
export default app;