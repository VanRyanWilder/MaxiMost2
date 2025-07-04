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
  processRedirectResult, // CORRECTED: Import processRedirectResult
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
    // Set up the listener immediately.
    const unsubscribe = onAuthStateChange(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Separately, process the redirect result on initial load.
    // This will now call the correct exported function.
    processRedirectResult() // CORRECTED: Call processRedirectResult
      .then((result) => {
        if (result) {
          // A user was successfully signed in via redirect.
          // The onAuthStateChanged listener above will handle setting the user state.
          console.log("Redirect result processed successfully.");
        }
      })
      .catch((err) => {
        console.error("Error processing redirect result:", err);
        setError(err);
      })
      .finally(() => {
        // Fallback to ensure loading is false after attempting to process the redirect.
        setLoading(false);
      });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
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
