"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { AdminRoleType, AdminType } from "@/types/admin";

// Re-export types for backward compatibility
export type { AdminRoleType, AdminType };

// Context types
interface AdminDbContextType {
  admins: AdminType[];
  deleteAdmin: (id: string) => boolean;
}

// Initial dummy data
const initialAdmins: AdminType[] = [
  {
    id: "admin1",
    employeeId: "EMP001",
    name: "Admin Staff",
    role: "super_admin",
    createdAt: new Date("2025-01-01T08:00:00"),
    lastLoginAt: new Date("2026-01-05T14:30:00"),
  },
  {
    id: "admin2",
    employeeId: "EMP002",
    name: "Support Admin",
    role: "regular_admin",
    createdAt: new Date("2025-01-15T09:00:00"),
    lastLoginAt: new Date("2026-01-04T10:15:00"),
  },
];

// Create Context
const AdminDbContext = createContext<AdminDbContextType | undefined>(undefined);

// Provider Component
export function AdminDbProvider({ children }: { children: ReactNode }) {
  const [admins, setAdmins] = useState<AdminType[]>(initialAdmins);

  const deleteAdmin = (id: string): boolean => {
    const initialLength = admins.length;
    setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    return admins.length !== initialLength;
  };

  const value: AdminDbContextType = {
    admins,
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
