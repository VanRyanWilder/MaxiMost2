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
    // This logic ensures the redirect is processed and the auth state is stable
    // before the rest of the app is allowed to render.

    processRedirectResult().catch((err) => {
      console.error("Error processing redirect result:", err);
      setError(err);
    });

    const unsubscribe = onAuthStateChange(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // The initial loading is complete once this fires.
    });

    return () => unsubscribe();
  }, []);

  // --- CRITICAL FIX ---
  // While the initial authentication check is running, we render nothing.
  // This prevents the router and other components from running with an
  // intermediate or incorrect auth state, which resolves the race condition.
  if (loading) {
    return null; // Or a full-page spinner component
  }

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
