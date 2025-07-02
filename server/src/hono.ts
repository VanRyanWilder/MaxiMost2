// Defines the application-wide types for Hono's context.

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

// Combined type for Hono's environment, used when creating Hono instances.
export type AppEnv = {
  Bindings: Bindings,
  Variables: Variables
};

// Note: The shared 'app' instance has been removed from this file.
// Each route file will create its own Hono instance typed with AppEnv.
// The main index.ts will also create its own Hono<AppEnv> instance and mount the routes.
