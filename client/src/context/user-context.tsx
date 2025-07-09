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
  // REMOVED: "onAuthStateChange" and "processRedirectResult" as App.tsx now handles this.
  // onAuthStateChange,
  // processRedirectResult,
} from "@/lib/firebase"; // Firebase import might not be needed here anymore

interface UserContextType {
  user: FirebaseUser | null;
  loading: boolean; // This will be driven by App.tsx's isAuthLoading
  error: Error | null;   // This will be driven by App.tsx's authError
  logout: () => Promise<void>; // Added logout function type
}

// Export UserContext directly for App.tsx to use with <UserContext.Provider>
export const UserContext = createContext<UserContextType | undefined>(undefined);

// The UserProvider component is no longer responsible for fetching auth state.
// App.tsx will use UserContext.Provider directly.
// This UserProvider export can be removed if not used anywhere, or kept as a simple pass-through if preferred structure.
// For now, let's comment it out to signify it's deprecated by App.tsx's direct Provider usage.
/*
export const UserProvider = ({ children, value }: { children: ReactNode, value: UserContextType }) => {
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
*/

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
