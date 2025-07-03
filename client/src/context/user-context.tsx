import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import type { User } from "@shared/schema"; // Assuming BackendUserProfile might be used later
// import { queryClient } from "@/lib/queryClient"; // queryClient not used in this version
import {
  auth,
  onAuthStateChange,
  signOut as firebaseSignOut,
  processRedirectResult // Import the new function
} from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
// getRedirectResult is no longer directly used here, processRedirectResult encapsulates it.

// Represents backend user profile data. To be fetched after Firebase auth.
// For now, it can be minimal or derived from FirebaseUser.
// import type { User as BackendUserProfile } from "@shared/schema";

interface UserContextType {
  // user: BackendUserProfile | null; // Future: for backend profile data
  firebaseUser: FirebaseUser | null; // Actual Firebase user object
  userLoading: boolean; // True while checking auth state initially
  userError: Error | null; // For any auth errors during initial load or operations
  // login method removed - components should use Firebase SDK directly
  logout: () => Promise<void>; // Make logout async
  // refetchUser might be relevant for backend profile, not directly for FirebaseUser
}

// Default context value
const defaultUserContext: UserContextType = {
  // user: null,
  firebaseUser: null,
  userLoading: true, // Start as true until first auth check completes
  userError: null,
  logout: async () => { await firebaseSignOut(); }, // Updated default logout
};

const UserContext = createContext<UserContextType>(defaultUserContext);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  // const [user, setUser] = useState<BackendUserProfile | null>(null); // For backend profile
  const [userLoading, setUserLoading] = useState(true); // True on initial load
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    setUserLoading(true);
    let unsubscribeAuth: (() => void) | undefined;

    processRedirectResult()
      .then((result) => {
        if (result) {
          console.log("Firebase redirect result processed, user:", result.user.uid);
          // User is now signed in (or was already).
          // onAuthStateChanged will handle setting the firebaseUser state.
        }
        // If result is null, no redirect was pending or it was handled.
      })
      .catch((error) => {
        console.error("Error processing Firebase redirect result:", error);
        setUserError(error as Error);
        // Consider setting userLoading false here if this is a critical error
        // that prevents onAuthStateChanged from running or being useful.
      })
      .finally(() => {
        // Setup the onAuthStateChanged listener regardless of redirect outcome.
        // This is the primary mechanism for tracking auth state.
        unsubscribeAuth = onAuthStateChange((fbUser) => {
          if (fbUser) {
            setFirebaseUser(fbUser);
            console.log("Firebase user via onAuthStateChanged:", fbUser.uid);
          } else {
            setFirebaseUser(null);
            console.log("Firebase user signed out / no user via onAuthStateChanged.");
          }
          setUserLoading(false); // Auth state determined
        });
      });

    // Cleanup function for useEffect
    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
    };
  }, []);

  // Logout function using Firebase signOut
  const logout = async () => {
    try {
      await firebaseSignOut(); // This will trigger onAuthStateChanged
      // queryClient.clear(); // Clear react-query cache if used for user-specific data
    } catch (error) {
      console.error("Error signing out with Firebase:", error);
      setUserError(error as Error);
      // Potentially re-throw or handle more gracefully
    }
  };

  // Placeholder: Function to map Firebase user to your backend user structure or fetch it
  // const mapFirebaseUserToBackendUser = (fbUser: FirebaseUser): BackendUserProfile => {
  //   return {
  //     id: 0, // This would come from your backend
  //     firebaseUid: fbUser.uid,
  //     email: fbUser.email || "",
  //     name: fbUser.displayName || "",
  //     // ... other fields
  //   };
  // };

  const value: UserContextType = {
    // user, // The backend profile user
    firebaseUser, // The Firebase auth user
    userLoading,
    userError,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}