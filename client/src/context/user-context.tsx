import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  auth,
  onAuthStateChange,
  processRedirectResult,
} from "@/lib/firebase";
import { useLocation } from "wouter";

interface UserContextType {
  user: FirebaseUser | null;
  loading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // This is the most robust pattern for handling Firebase auth initialization.

    // 1. Set up the auth state listener immediately. This is the single
    //    source of truth for whether a user is logged in.
    const unsubscribe = onAuthStateChange(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // We are no longer loading once we get the first update.
      
      // If a user is found by this listener, we ensure they are on the dashboard.
      if (firebaseUser) {
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get('redirect');
        // Only redirect if we are not already on a protected route, to avoid loops.
        if (window.location.pathname === '/login' || window.location.pathname === '/signup' || window.location.pathname === '/') {
          setLocation(redirectPath || "/dashboard");
        }
      }
    });

    // 2. Separately, process any pending redirect results. If a user is found,
    //    it will trigger the onAuthStateChanged listener above to update the state.
    processRedirectResult().catch((err) => {
      console.error("Error processing redirect result:", err);
      setError(err);
    });

    // 3. Return the cleanup function for the listener.
    return () => unsubscribe();
  }, [setLocation]);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
