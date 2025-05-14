import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

// Create a static mock user for development
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

interface UserContextType {
  user: User | null;
  userLoading: boolean;
  userError: Error | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

// Create context with a default value to avoid undefined checks
const defaultUserContext: UserContextType = {
  user: mockUser,
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