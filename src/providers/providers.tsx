"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { AdminDbProvider } from "@/contexts/admin-db-context";
import { ComplaintDbProvider } from "@/contexts/complaint-db-context";
import { ProjectDbProvider } from "@/contexts/project-db-context";
import { UserDbProvider } from "@/contexts/user-db-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminDbProvider>
        <UserDbProvider>
          <ComplaintDbProvider>
            <ProjectDbProvider>{children}</ProjectDbProvider>
          </ComplaintDbProvider>
        </UserDbProvider>
      </AdminDbProvider>
    </AuthProvider>
  );
}
