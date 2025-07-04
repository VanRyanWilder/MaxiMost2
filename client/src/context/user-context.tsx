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
    // This logic includes extra logging to pinpoint the initialization error.

    processRedirectResult().catch((err) => {
      console.error("Error processing redirect result:", err);
      setError(err);
    });

    try {
      console.log("Attempting to set up onAuthStateChanged listener...");
      const unsubscribe = onAuthStateChange(auth, (firebaseUser) => {
        console.log("onAuthStateChanged listener fired. User:", firebaseUser?.uid || "null");
        setUser(firebaseUser);
        setLoading(false);
      });
      console.log("Successfully set up onAuthStateChanged listener.");

      return () => {
        console.log("Cleaning up auth state listener.");
        unsubscribe();
      };
    } catch (e: any) {
      console.error("CRITICAL: Failed to set up onAuthStateChanged listener.", e);
      setError(e);
      setLoading(false); // Stop loading if the listener setup fails.
    }
  }, []);

  // While the initial authentication check is running, show a loading screen.
  // This prevents the router from running with an incorrect auth state.
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
