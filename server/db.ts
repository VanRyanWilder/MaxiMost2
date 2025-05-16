import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon database to use web sockets
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineTLS = true;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool with appropriate settings
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3, // Limit max connections to prevent overloading
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000 // Timeout after 10 seconds
});

// Log connection events
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  // Don't exit process on connection errors
  // process.exit(-1);
});

pool.on('connect', () => {
  console.log('Database connection established');
});

// Initialize Drizzle ORM with connection pool
export const db = drizzle({ client: pool, schema });