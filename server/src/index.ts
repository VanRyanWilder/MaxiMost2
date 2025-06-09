import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
// bodyParser import removed, using express built-ins
import habitRoutes from "./routes/habitRoutes"; // Import habit routes
import userRoutes from "./routes/userRoutes"; // Import user routes

// Initialize Firebase Admin SDK - Ensure this is done before routes that need it.
// This import will execute the firebaseAdmin.ts file.
import "./config/firebaseAdmin";

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Enable CORS for all routes - Already added, ensuring it is here.
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get("/", (req, res) => {
  res.send("Maximost Backend Server is running!");
});

// Mount the habit routes
// app.use("/api/habits", habitRoutes); // Commented out as habitRoutes is now a Hono app
console.log("Note: Express habit routes are commented out in src/index.ts as they are now Hono routes.");

// Mount the user routes
// app.use("/api/users", userRoutes); // Commented out as userRoutes is now a Hono app
console.log("Note: Express user routes are commented out in src/index.ts as they are now Hono routes.");

// Basic 404 handler for routes not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Not Found - The requested resource could not be found on this server." });
});

// Basic Error Handling Middleware (should be last middleware)
// This will catch errors passed by next(error) or unhandled synchronous errors in route handlers
// (though async errors need to be caught and passed to next() explicitly in older Express versions without Express 5 auto async error handling)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err.stack || err); // Log the error stack for debugging

  // Avoid sending stack trace to client in production for security
  const errorResponse = {
    message: err.message || "An unexpected error occurred.",
    // ...(process.env.NODE_ENV === "development" && { stack: err.stack }) // Optionally include stack in dev
  };

  // If headers have already been sent, delegate to the default Express error handler.
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json(errorResponse);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
