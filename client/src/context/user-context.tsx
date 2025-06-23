import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { onAuthStateChange, signOut as firebaseSignOut } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";

// Create a static mock user for development until the user API is ready
const mockUser: User = {
  id: 1,
  username: "maximost_user",
  password: "password123", // This should not be stored in a real app
  name: "MaxiMost User",
  email: "user@maximost.com",
  currentProgramId: 3,
  programStartDate: new Date("2023-04-15"),
  programProgress: 32,
  firebaseUid: 'mock-firebase-uid',
  subscriptionTier: "premium",
  subscriptionStatus: "active",
  subscriptionStartDate: new Date("2023-03-15"),
  subscriptionEndDate: new Date("2024-03-15"),
  trialEndsAt: null,
  stripeCustomerId: "cus_123456",
  stripeSubscriptionId: "sub_123456"
};

interface UserContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  userLoading: boolean;
  logout: () => void;
}

// Create context with a proper default (null user)
const UserContext = createContext<UserContextType>({
  user: null,
  firebaseUser: null,
  userLoading: true, // Start in a loading state
  logout: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userLoading, setUserLoading] = useState(true); // Start as true

  useEffect(() => {
    // This is the core of real authentication.
    // It listens to Firebase for login/logout events.
    const unsubscribe = onAuthStateChange((fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // A user is logged in via Firebase.
        // In a real app, you would now fetch your app-specific user profile from your backend.
        // For now, we'll use the mockUser to represent the logged-in user's profile.
        setUser({ ...mockUser, firebaseUid: fbUser.uid, email: fbUser.email || 'no-email@maximost.com' });
      } else {
        // No user is logged in.
        setUser(null);
      }
      setUserLoading(false); // Finished loading auth state
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this runs only once

  const logout = async () => {
    await firebaseSignOut();
    setUser(null);
    setFirebaseUser(null);
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
