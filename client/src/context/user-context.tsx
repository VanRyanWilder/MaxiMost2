import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  // REMOVED: "auth" is no longer imported directly.
  onAuthStateChange,
  processRedirectResult,
} from "@/lib/firebase";

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

  useEffect(() => {
    setLoading(true); // Explicitly true at start

    // Process any pending redirect.
    // This updates Firebase's internal state. onAuthStateChanged will then fire.
    processRedirectResult()
      .catch(err => {
        console.error("Error processing redirect result:", err);
        setError(err);
        // Even on error, onAuthStateChanged should still give us the current (likely null) user state,
        // and it's responsible for setting loading to false.
      });

    // Listen for auth state changes.
    // This will be our single source of truth for setting user and stopping loading.
    const unsubscribe = onAuthStateChange(firebaseUser => {
      setUser(firebaseUser);
      setError(null); // Clear any previous redirect error if auth state changes successfully.
      setLoading(false); // Auth state is now definitively known (user or null)
    });

    // Cleanup subscription on unmount.
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs once on mount.

  // While the initial authentication check is running (loading is true), show a loading screen.
  // This prevents rendering children, including PrivateRoute, prematurely.
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        Initializing Authentication...
      </div>
    );
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
