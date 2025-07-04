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
    // This simplified logic is more robust.
    // It first checks for a redirect result and then sets up the auth listener.

    // Process the potential redirect result from Google, etc.
    processRedirectResult()
      .then((result) => {
        if (result) {
          // A user was successfully signed in via redirect.
          // The onAuthStateChanged listener below will handle setting the user state.
          console.log("Redirect result processed successfully.");
        }
        // If result is null, the user just landed on the page normally.
      })
      .catch((err) => {
        console.error("Error processing redirect result:", err);
        setError(err);
      });

    // Set up the permanent listener for auth state changes.
    // This is the single source of truth. It will fire after a redirect
    // is processed, or on initial page load with a cached user.
    const unsubscribe = onAuthStateChange(auth, (firebaseUser) => {
      setUser(firebaseUser);
      // We are no longer loading once this observer gives us the user's status.
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts.
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
