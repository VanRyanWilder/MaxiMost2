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
  getRedirectResult,
} from "@/lib/firebase"; // Assuming getRedirectResult is exported from firebase.ts

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
    // This is the corrected logic.
    // We set up the listener immediately, but we also process the redirect.
    const unsubscribe = onAuthStateChange(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Separately, process the redirect result on initial load.
    // This will not interfere with the listener above. If a user is found,
    // the onAuthStateChanged listener will fire with the new user.
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // A user was successfully signed in via redirect.
          // The onAuthStateChanged listener will handle setting the user state.
          console.log("Redirect result processed successfully.");
        }
      })
      .catch((err) => {
        console.error("Error processing redirect result:", err);
        setError(err);
      })
      .finally(() => {
        // If there was no redirect, or after it's processed,
        // we ensure loading is false. The listener might have already done this,
        // but this is a safe fallback.
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
