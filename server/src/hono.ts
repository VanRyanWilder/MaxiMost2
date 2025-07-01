import { Hono } from 'hono';

// Define the shape of your environment variables that Hono will have access to.
// These are typically set in Cloudflare Worker secrets or .dev.vars for local dev.
export type Bindings = {
  FIREBASE_WEB_API_KEY: string;
  // Example: DATABASE_URL: string;
  // Example: R2_BUCKET: R2Bucket;
};

// Define the shape of the variables you'll set and get in the context (c.set/c.get).
export type Variables = {
  user: { // Structure based on Firebase REST API lookup response
    localId: string; // This is the Firebase UID
    email?: string;
    displayName?: string;
    photoUrl?: string;
    emailVerified?: boolean;
    // Add other user properties you might need from the token lookup
    // and intend to pass through context.
  };
  // Example: requestId: string;
};

// Create a new Hono instance with these types.
// This 'app' instance can be imported and used by middleware and route files.
export const app = new Hono<{
    Bindings: Bindings,
    Variables: Variables
}>();

// You could also apply truly global middleware here if desired,
// e.g., a request ID middleware, though logger/secureHeaders are often
// applied in index.ts after importing this app.
// Example:
// app.use('*', async (c, next) => {
//   c.set('requestId', crypto.randomUUID());
//   await next();
// });
