import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebaseAdmin"; // Adjust path as necessary

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: auth.DecodedIdToken;
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
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    // Check for specific error codes if needed, e.g., token-expired
    if (error.code === "auth/id-token-expired") {
        return res.status(401).json({ message: "Unauthorized: Token expired." });
    }
    return res.status(403).json({ message: "Forbidden: Invalid token." });
  }
};
