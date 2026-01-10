"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { UserType, UserStatusType } from "@/types/user";

// Re-export types for backward compatibility
export type { UserType, UserStatusType };

// Context types
interface UserDbContextType {
  users: UserType[];
  banUser: (id: string) => boolean;
  unbanUser: (id: string) => boolean;
}

// Initial dummy data
const initialUsers: UserType[] = [
  {
    id: "user1",
    email: "john.doe@example.com",
    name: "John Doe",
    status: "active",
    createdAt: new Date("2025-01-01T10:00:00"),
  },
  {
    id: "user2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    status: "active",
    createdAt: new Date("2025-01-05T14:30:00"),
  },
  {
    id: "user3",
    email: "mike.wilson@example.com",
    name: "Mike Wilson",
    status: "banned",
    createdAt: new Date("2024-12-20T09:15:00"),
  },
];

// Create Context
const UserDbContext = createContext<UserDbContextType | undefined>(undefined);

// Provider Component
export default function UserDbProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserType[]>(initialUsers);

  const updateUser = (
    id: string,
    status: UserStatusType
  ): UserType | null => {
    let updatedUser: UserType | null = null;

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          updatedUser = {
            ...user,
            status,
          };
          return updatedUser;
        }
        return user;
      })
    );

    return updatedUser;
  };

  const banUser = (id: string): boolean => {
    const user = updateUser(id, "banned");
    return user !== null;
  };

  const unbanUser = (id: string): boolean => {
    const user = updateUser(id, "active");
    return user !== null;
  };

  const value: UserDbContextType = {
    users,
    banUser,
    unbanUser,
  };

  return (
    <UserDbContext.Provider value={value}>{children}</UserDbContext.Provider>
  );
}

// Custom hook to use the context
export function useUserDb() {
  const context = useContext(UserDbContext);
  if (context === undefined) {
    throw new Error("useUserDb must be used within a UserDbProvider");
  }
  return context;
}
