"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { AdminRole, Admin } from "@/types/admin";

// Re-export types for backward compatibility
export type { AdminRole, Admin };

// Context types
interface AdminDbContextType {
  admins: Admin[];
  getAdmins: () => Admin[];
  getAdminById: (id: string) => Admin | undefined;
  createAdmin: (name: string, role: AdminRole) => Admin;
  updateAdmin: (id: string, name?: string, role?: AdminRole) => Admin | null;
  deleteAdmin: (id: string) => boolean;
}

// Initial dummy data
const initialAdmins: Admin[] = [
  {
    id: "admin1",
    name: "Admin Staff",
    role: "super_admin",
    createdAt: new Date("2025-01-01T08:00:00"),
    updatedAt: new Date("2025-01-01T08:00:00"),
  },
  {
    id: "admin2",
    name: "Support Admin",
    role: "regular_admin",
    createdAt: new Date("2025-01-15T09:00:00"),
    updatedAt: new Date("2025-01-15T09:00:00"),
  },
];

// Create Context
const AdminDbContext = createContext<AdminDbContextType | undefined>(undefined);

// Provider Component
export function AdminDbProvider({ children }: { children: ReactNode }) {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);

  // Helper function to generate unique IDs
  const generateId = (prefix: string): string => {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  };

  const getAdmins = (): Admin[] => {
    return admins;
  };

  const getAdminById = (id: string): Admin | undefined => {
    return admins.find((admin) => admin.id === id);
  };

  const createAdmin = (name: string, role: AdminRole): Admin => {
    const newAdmin: Admin = {
      id: generateId("admin"),
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAdmins((prev) => [...prev, newAdmin]);
    return newAdmin;
  };

  const updateAdmin = (
    id: string,
    name?: string,
    role?: AdminRole
  ): Admin | null => {
    let updatedAdmin: Admin | null = null;

    setAdmins((prev) =>
      prev.map((admin) => {
        if (admin.id === id) {
          updatedAdmin = {
            ...admin,
            ...(name !== undefined && { name }),
            ...(role !== undefined && { role }),
            updatedAt: new Date(),
          };
          return updatedAdmin;
        }
        return admin;
      })
    );

    return updatedAdmin;
  };

  const deleteAdmin = (id: string): boolean => {
    const initialLength = admins.length;
    setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    return admins.length !== initialLength;
  };

  const value: AdminDbContextType = {
    admins,
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
  };

  return (
    <AdminDbContext.Provider value={value}>{children}</AdminDbContext.Provider>
  );
}

// Custom hook to use the context
export function useAdminDb() {
  const context = useContext(AdminDbContext);
  if (context === undefined) {
    throw new Error("useAdminDb must be used within an AdminDbProvider");
  }
  return context;
}
