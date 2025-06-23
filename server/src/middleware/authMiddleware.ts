import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebaseAdmin";
import type { DecodedIdToken } from "firebase-admin/auth"; // Import DecodedIdToken type
import { Context as HonoCtx } from 'hono'; // Import Hono Context

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken; // Use DecodedIdToken type directly
}

export const protectWithFirebase = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided or invalid format." });
  }

  const idToken = authorizationHeader.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ message: "Unauthorized: Token is missing after Bearer prefix." });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken; // Attach user payload to request
    next(); // Token is valid, proceed to the next middleware or route handler
  } catch (error: any) { // Cast error to any to access properties like 'code'
    console.error("Error verifying Firebase ID token:", error);
    if (error.code === "auth/id-token-expired") {
        return res.status(401).json({ message: "Unauthorized: Token expired." });
    }
    return res.status(403).json({ message: "Forbidden: Invalid token." });
  }
};

// --- Hono Middleware ---

// Define a type for Hono context variables, making user available on c.var or c.get('user')
export type AuthEnv = {
  Variables: {
    user: DecodedIdToken;
  };
};

// Use HonoCtx<AuthEnv> for typed context
export const honoProtectWithFirebase = async (c: HonoCtx<AuthEnv>, next: Function) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized: No token provided or invalid format.' }, 401);
  }
  const idToken = authHeader.split('Bearer ')[1];
  if (!idToken) {
    return c.json({ message: 'Unauthorized: Token is missing after Bearer prefix.' }, 401);
  }
  try {
    const decodedToken = await auth.verifyIdToken(idToken); // Use 'auth' from the top of the file
    c.set('user', decodedToken);
    await next();
  } catch (error: any) { // Cast error to any to access .code and .message
    console.error('Error verifying Firebase ID token for Hono:', error);
    if (error.code === 'auth/id-token-expired') {
      return c.json({ message: 'Unauthorized: Token expired.' }, 401);
    }
    return c.json({ message: 'Forbidden: Invalid token.', errorDetail: error.message }, 403);
  }
};
