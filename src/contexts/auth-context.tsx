"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UserType } from "./user-db-context";

interface AuthContextType {
  user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const login = async (email: string, password: string) => {
    // Simulated login - for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user data
    setUser({
      id: "1",
      email,
      name: "Demo User",
      status: "active",
      createdAt: new Date(),
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulated signup - for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user data
    setUser({
      id: "1",
      email,
      name,
      status: "active",
      createdAt: new Date(),
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
