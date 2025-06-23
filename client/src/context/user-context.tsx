import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { onAuthStateChange, signOut as firebaseSignOut } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";

interface UserContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  userLoading: boolean;
  logout: () => void;
}

// Create context with a proper default (null user, loading)
const UserContext = createContext<UserContextType>({
  user: null,
  firebaseUser: null,
  userLoading: true,
  logout: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userLoading, setUserLoading] = useState(true); // Start in a loading state

  useEffect(() => {
    // This listener is the core of real authentication.
    const unsubscribe = onAuthStateChange((fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // A user is logged in via Firebase.
        // We create a minimal User profile from the Firebase user data.
        // In a real app, you would fetch the full profile from your backend here.
        const appUser: User = {
          id: 0, // Placeholder ID
          firebaseUid: fbUser.uid,
          name: fbUser.displayName || "MaxiMost User",
          email: fbUser.email || "no-email@provided.com",
          username: fbUser.displayName || "maximost_user",
          // Set default/null values for other fields until they are fetched
          password: "",
          currentProgramId: null,
          programStartDate: null,
          programProgress: null,
          subscriptionTier: 'free',
          subscriptionStatus: 'active',
          subscriptionStartDate: null,
          subscriptionEndDate: null,
          trialEndsAt: null,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        };
        setUser(appUser);
      } else {
        // No user is logged in.
        setUser(null);
      }
      // Finished checking auth state, set loading to false.
      setUserLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this runs only once

  const logout = async () => {
    await firebaseSignOut();
    // The onAuthStateChange listener above will handle setting user state to null.
    queryClient.clear();
  };

  const value: UserContextType = {
    user,
    firebaseUser,
    userLoading,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
