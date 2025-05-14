import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

interface UserContextType {
  user: User | null;
  userLoading: boolean;
  userError: Error | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  // Use a static mock user for development instead of API calls
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<Error | null>(null);
  
  // Mock user data
  const mockUser: User = {
    id: 1,
    username: "beastmode_user",
    password: "password123",
    name: "John Doe",
    email: "john@example.com",
    currentProgramId: 3,
    programStartDate: new Date("2023-04-15"),
    programProgress: 32
  };
  
  const [user, setUser] = useState<User | null>(mockUser);

  const login = async (username: string, password: string) => {
    try {
      setUserLoading(true);
      // In a real app, we would call an API to login
      // For now, just simulate a successful login
      setUser(mockUser);
      setUserLoading(false);
    } catch (error) {
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

  const value = {
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
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
