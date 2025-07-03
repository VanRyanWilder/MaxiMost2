import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { onAuthStateChange, signOut as firebaseSignOut } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";

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
    const unsubscribe = onAuthStateChange((fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        // setUser(mapFirebaseUserToBackendUser(fbUser)); // Placeholder to map/fetch backend profile
        console.log("Firebase user signed in:", fbUser.uid);
      } else {
        setFirebaseUser(null);
        // setUser(null);
        console.log("Firebase user signed out.");
      }
      setUserLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      setUserLoading(false); // Reset loading on unmount if needed
    }
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