import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { onAuthStateChange, signOut as firebaseSignOut } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";

// Create a static mock user for development
const mockUser: User = {
  id: 1,
  username: "maximost_user",
  password: "password123",
  name: "MaxiMost User",
  email: "user@maximost.com",
  currentProgramId: 3,
  programStartDate: new Date("2023-04-15"),
  programProgress: 32,
  firebaseUid: null,
  subscriptionTier: "premium",
  subscriptionStatus: "active",
  subscriptionStartDate: new Date("2023-03-15"),
  subscriptionEndDate: new Date("2024-03-15"),
  trialEndsAt: null,
  stripeCustomerId: "cus_123456",
  stripeSubscriptionId: "sub_123456"
};

// Create a guest user
const guestUser: User = {
  id: 999,
  username: "guest",
  password: "",
  name: "Guest User",
  email: "guest@example.com",
  currentProgramId: null,
  programStartDate: null,
  programProgress: null,
  firebaseUid: null,
  subscriptionTier: "free",
  subscriptionStatus: "active",
  subscriptionStartDate: null,
  subscriptionEndDate: null,
  trialEndsAt: null,
  stripeCustomerId: null,
  stripeSubscriptionId: null
};

interface UserContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  userLoading: boolean;
  userError: Error | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

// Create context with a default value to avoid undefined checks
const defaultUserContext: UserContextType = {
  user: mockUser,
  firebaseUser: null,
  userLoading: false,
  userError: null,
  login: async () => {},
  logout: () => {},
  refetchUser: async () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(mockUser);

  const login = async (username: string, password: string) => {
    try {
      setUserLoading(true);

      // Check if this is a guest login
      if (username === "guest@example.com" && password === "guest-password") {
        console.log("Logging in as guest");
        setUser(guestUser);
        localStorage.setItem('userType', 'guest');
      } else {
        // For regular logins, use the mock user
        console.log("Logging in as regular user");
        setUser(mockUser);
        localStorage.setItem('userType', 'regular');
      }

      setUserLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setUserLoading(false);
      setUserError(new Error("Login failed"));
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    // In a real app, we would call an API to logout
    setUser(null);
    queryClient.clear();
  };

  const refetchUser = async () => {
    // In a real app, this would actually refetch the user
    setUser(mockUser);
  };

  const value: UserContextType = {
    user,
    userLoading,
    userError,
    login,
    logout,
    refetchUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  return context;
}