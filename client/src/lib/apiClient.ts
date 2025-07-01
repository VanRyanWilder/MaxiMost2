// client/src/lib/apiClient.ts

import { auth } from "./firebase"; // Assuming firebase.ts exports auth for current user token

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
  if (!idToken && auth.currentUser) {
    try {
      idToken = await auth.currentUser.getIdToken();
    } catch (error) {
      console.error("Error getting Firebase ID token:", error);
      // Depending on app requirements, could throw error or proceed without token for public routes
      // For Maximost, most backend routes will be protected.
      throw new Error("Failed to retrieve Firebase ID token.");
    }
  }

  const headers: HeadersInit = {
    ...customHeaders,
  };

  if (idToken) {
    headers["Authorization"] = `Bearer ${idToken}`;
  }

  const config: RequestInit = {
    method,
    headers,
    ...restOptions,
  };

  // Only add Content-Type and body if body is present and method is not GET/HEAD
  if (body && method !== "GET" && method !== "HEAD") {
    if (typeof body === "object" && !(body instanceof FormData)) {
      config.body = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
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
