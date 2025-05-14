import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
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
  // For a real app, we would fetch the user from an API, but for this demo,
  // we'll just use a mock user with ID 1
  const userId = 1; // In a real app, this would come from local storage after login

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    refetch,
  } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId, // Only fetch if we have a userId
    retry: false,
  });

  const login = async (username: string, password: string) => {
    try {
      // In a real app, we would call an API to login
      // const response = await apiRequest("POST", "/api/login", { username, password });
      // localStorage.setItem("userId", response.user.id);
      // queryClient.invalidateQueries({ queryKey: [`/api/users/${response.user.id}`] });
      
      // For now, just pretend we've logged in successfully
      await refetch();
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    // In a real app, we would call an API to logout
    // localStorage.removeItem("userId");
    queryClient.clear();
  };

  const refetchUser = async () => {
    await refetch();
  };

  const value = {
    user: user || null,
    userLoading,
    userError: userError as Error | null,
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
