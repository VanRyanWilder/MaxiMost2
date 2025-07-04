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
    // This is a more direct and robust way to handle initialization.

    // First, process any pending redirect result.
    processRedirectResult().catch((err) => {
      // We catch and log any error during redirect processing.
      console.error("Error processing redirect result:", err);
      setError(err);
    });

    // Set up the permanent listener for auth state changes.
    // This listener will fire after a redirect is processed, or on initial page load.
    const unsubscribe = onAuthStateChange(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      // We are no longer loading once we have a definitive user status.
      setLoading(false);
    });

    // Return the cleanup function for the listener.
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this runs only once.

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


