// client/src/lib/apiClient.ts

import { auth, listenToAuthChanges } from "./firebase"; // Added listenToAuthChanges
import type { User as FirebaseUser } from "firebase/auth";

// Helper to get current user's ID token, waiting for auth init if needed
const getIdTokenReliably = (): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (auth.currentUser) {
      auth.currentUser.getIdToken().then(resolve).catch(error => {
        console.error("Error getting ID token from auth.currentUser:", error);
        // Potentially resolve(null) or reject depending on desired handling of token errors
        reject(new Error("Failed to get ID token from current user."));
      });
    } else {
      // If currentUser is null, wait for the initial auth state
      const unsubscribe = listenToAuthChanges((user: FirebaseUser | null) => {
        unsubscribe(); // Important to prevent memory leaks
        if (user) {
          user.getIdToken().then(resolve).catch(error => {
            console.error("Error getting ID token from onAuthStateChanged user:", error);
            reject(new Error("Failed to get ID token from authenticated user."));
          });
        } else {
          resolve(null); // No user, so no token
        }
      });
      // Add a timeout to prevent hanging indefinitely if Firebase doesn't respond
      setTimeout(() => {
        unsubscribe(); // Clean up listener
        reject(new Error("Timeout waiting for Firebase auth state."));
      }, 10000); // 10-second timeout
    }
  });
};

interface ApiClientOptions extends RequestInit {
  body?: any; // Allow any type for body, will be stringified if object
  token?: string | null; // Optional token, can be fetched here or passed in
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { method = "GET", body, headers: customHeaders, token: passedToken, ...restOptions } = options;

  let idToken = passedToken;
  if (idToken === undefined) { // Only try to fetch if no token was explicitly passed
    try {
      idToken = await getIdTokenReliably();
    } catch (error) {
      console.error("apiClient: Error getting Firebase ID token reliably:", error);
      // Depending on how strictly to enforce auth for all calls:
      // 1. Throw error to prevent API call without token
      // throw new Error(`Failed to retrieve Firebase ID token: ${error.message}`);
      // 2. Proceed without token (current behavior if getIdTokenReliably resolves to null)
      //    This might be okay if some endpoints are public, but dangerous for protected ones.
      //    The brief implies most actions need auth. Let's make it stricter.
      //    If getIdTokenReliably() itself rejects, the error will propagate.
      //    If it resolves to null (no user), idToken will be null, and no Authorization header will be set.
      //    This is acceptable; backend will reject if endpoint is protected.
    }
  }

  const headers: HeadersInit = {
    ...customHeaders,
  };

  if (idToken) {
    headers["Authorization"] = `Bearer ${idToken}`;
  }

  // Add cache-busting headers for GET requests
  if (method === "GET") {
    headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    headers["Pragma"] = "no-cache";
    headers["Expires"] = "0";
  }

  const config: RequestInit = {
    method,
    headers, // headers object now includes cache-control for GET
    ...restOptions,
  };

  // Only add Content-Type and body if body is present and method is not GET/HEAD
  if (body && method !== "GET" && method !== "HEAD") {
    if (typeof body === "object" && !(body instanceof FormData)) {
      config.body = JSON.stringify(body);
      // Ensure Content-Type is not duplicated if already in customHeaders
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    } else {
      config.body = body; // For FormData or other types
    }
  }

  // Construct the full URL using the VITE_API_BASE_URL environment variable
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  let fullUrl;

  if (endpoint.startsWith("http")) {
    fullUrl = endpoint;
  } else if (apiBaseUrl) {
    // Ensure no double slashes if endpoint starts with a slash
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    fullUrl = `${apiBaseUrl.replace(/\/$/, '')}/${normalizedEndpoint}`;
  } else {
    // Fallback for local development if VITE_API_BASE_URL is not set, assuming proxy is configured
    fullUrl = `/api${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    console.warn("VITE_API_BASE_URL is not set. Using relative path for API calls. Ensure proxy is configured for local development.");
  }

  // Diagnostic log for request details including token status
  console.log(`API Request: ${method} ${fullUrl}`, {
    headers: config.headers, // Log all headers being sent
    tokenStatus: idToken ? 'Present' : (passedToken === null ? 'Explicitly Null' : (idToken === null ? 'Absent (No User)' : 'Absent (Error/Undetermined)')),
    // Log body only if it's not FormData or too large
    bodyPreview: (body && !(body instanceof FormData) && JSON.stringify(body).length < 500) ? body : (body instanceof FormData ? 'FormData' : (body ? 'Omitted (Large/Binary)' : undefined))
  });

  try {
    const response = await fetch(fullUrl, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Not a JSON error response, or empty response
        errorData = { message: response.statusText || "An error occurred" };
      }
      // Include status code in the error object for better handling
      const error = new Error(errorData.message || `HTTP error ${response.status}`) as any;
      error.status = response.status;
      error.data = errorData; // Attach full error data from server
      throw error;
    }

    // Handle cases where response might be empty (e.g., 204 No Content)
    if (response.status === 204) {
      return undefined as T; // Or null, or a specific type indicating success with no content
    }

    // Check content type before parsing as JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    } else {
      // Handle non-JSON responses if necessary, e.g., text
      // For now, we assume JSON or empty. If it is not JSON and not empty, it might be an issue.
      // Or, could return response.text() if that is expected.
      // If it is not empty, not JSON, and not expected, we return undefined or throw an error.
      // For simplicity, if it is not JSON, we return undefined for now.
      return undefined as T;
    }

  } catch (error) {
    console.error(`API Client Error (${method} ${fullUrl}):`, error);
    throw error; // Re-throw the error to be caught by the calling function
  }
}

// Example Usage (for illustration, not part of the file itself):
/*
// In your component/hook:
import { apiClient } from "@/lib/apiClient";
import { useUser } from "@/context/user-context"; // If using a context for user/token

// ...
const { user, getIdToken } = useUser(); // Or however you get the token

async function fetchHabits() {
  try {
    // Pass token directly if fetched from context that provides it
    // const token = await getIdToken();
    // const habits = await apiClient<{ habitId: string; title: string }[]>("/habits", { method: "GET", token });

    // Or let apiClient fetch it if auth.currentUser is available
    const habits = await apiClient<{ habitId: string; title: string }[]>("/habits", { method: "GET" });
    console.log(habits);
  } catch (error) {
    console.error("Failed to fetch habits:", error.message, error.status, error.data);
  }
}
*/
