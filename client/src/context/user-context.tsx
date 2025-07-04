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
    // This simplified logic is more robust and avoids race conditions.

    // 1. Immediately set up the permanent listener for auth state changes.
    // This will be our single source of truth for the user's login status.
    const unsubscribe = onAuthStateChange(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // 2. Separately, process any pending redirect results on initial load.
    // If a user is found here, it will trigger the onAuthStateChanged listener
    // above, which will then correctly update the application state.
    processRedirectResult()
      .then((result) => {
        if (result) {
          console.log("Redirect sign-in successful.");
        }
        // If result is null, it simply means there was no pending redirect.
      })
      .catch((err) => {
        console.error("Error processing redirect result:", err);
        setError(err);
      });

    // 3. Return the cleanup function for the permanent listener.
    return () => unsubscribe();
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
