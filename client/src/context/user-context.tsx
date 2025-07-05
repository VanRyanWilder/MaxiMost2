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
    // setLoading(true) explicitly at the start of effect, though initial state is true.
    // This handles potential re-runs if deps were ever added, though not the case here.
    setLoading(true);
    let authStateEstablishedByObserver = false;
    let redirectProcessed = false;

    const checkLoadingComplete = () => {
      if (authStateEstablishedByObserver && redirectProcessed) {
        setLoading(false);
      }
    };

    // Process any pending redirect.
    // getRedirectResult should only be called once per page load.
    processRedirectResult()
      .then(userCredential => {
        if (userCredential && userCredential.user) {
          // If getRedirectResult successfully authenticates a user,
          // onAuthStateChanged will also fire with this user.
          // We don't need to setUser here; let onAuthStateChanged be the single source of truth for user state.
          console.log("Redirect sign-in successful for user:", userCredential.user.uid);
        }
        // If userCredential is null, it means no redirect operation was pending or it didn't result in a user.
      })
      .catch(err => {
        console.error("Error processing redirect result:", err);
        setError(err); // Set error state to display to the user if needed.
      })
      .finally(() => {
        redirectProcessed = true;
        checkLoadingComplete();
      });

    // Listen for auth state changes.
    const unsubscribe = onAuthStateChange(firebaseUser => {
      setUser(firebaseUser);
      authStateEstablishedByObserver = true;
      checkLoadingComplete();
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
