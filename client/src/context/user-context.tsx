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
    // This logic prevents race conditions by processing the redirect
    // before the main auth state listener is fully relied upon.
    const checkAuth = async () => {
      try {
        // First, attempt to process any pending redirect results from Google, etc.
        const result = await processRedirectResult();
        if (result) {
          // If a user is found via redirect, this log will confirm it.
          // The onAuthStateChanged listener below will then fire with the user.
          console.log("Redirect result processed successfully for user:", result.user.uid);
        }
      } catch (err: any) {
        // This catches errors if the redirect processing fails.
        console.error("Error processing redirect result:", err);
        setError(err);
      }

      // After attempting to process the redirect, set up the permanent listener.
      // This listener becomes the single source of truth for the user's auth state.
      const unsubscribe = onAuthStateChange(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false); // We are no longer loading once we have a user or know there is none.
      });

      // Return the cleanup function for the listener.
      return unsubscribe;
    };

    const unsubscribePromise = checkAuth();

    // The main cleanup function for the useEffect hook.
    // It ensures that the onAuthStateChanged listener is properly detached.
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) {
          unsubscribe();
        }
      });
    };
  }, []);

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
