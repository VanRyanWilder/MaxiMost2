import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { queryClient } from "@/lib/queryClient";
import { onAuthStateChange, signOut as firebaseSignOut } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";

// Define a minimal user type for our application context
interface AppUser {
  firebaseUid: string;
  email: string | null;
  name: string | null;
}

interface UserContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  userLoading: boolean;
  logout: () => void;
}

// Create context with a proper default state: no user, and loading is true.
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
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userLoading, setUserLoading] = useState(true); // Start in a loading state

  useEffect(() => {
    // This is the core of real authentication.
    // It listens to Firebase for login/logout events.
    const unsubscribe = onAuthStateChange((fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // A user is logged in via Firebase.
        // We create our app-specific user profile from the Firebase user data.
        // In a real app, you would fetch more details from your own backend here.
        setUser({
          firebaseUid: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName,
        });
      } else {
        // No user is logged in.
        setUser(null);
      }
      // We are no longer loading the initial auth state.
      setUserLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this runs only once on mount

  const logout = async () => {
    await firebaseSignOut();
    // The onAuthStateChange listener will automatically set the user to null.
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
