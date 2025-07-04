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
    // This new logic ensures that the redirect result is fully processed
    // before the main authentication state listener is established.
    
    let unsubscribe = () => {}; // Initialize an empty cleanup function.

    const initializeAuth = async () => {
      try {
        // First, wait for any pending redirect operations to complete.
        const result = await processRedirectResult();
        if (result) {
          // This log confirms a user was signed in via redirect.
          console.log("Redirect result processed successfully for user:", result.user.uid);
        }
      } catch (err: any) {
        console.error("Error processing redirect result:", err);
        setError(err);
      } finally {
        // AFTER the redirect is handled, set up the permanent listener.
        // This becomes the single source of truth for the user's auth state.
        unsubscribe = onAuthStateChange(auth, (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false); // We are no longer loading once we have the definitive user state.
        });
      }
    };

    initializeAuth();

    // The main cleanup function for the useEffect hook.
    // It will call the real unsubscribe function once it's assigned.
    return () => {
      unsubscribe();
    };
  }, []); // The empty dependency array ensures this runs only once on mount.

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
