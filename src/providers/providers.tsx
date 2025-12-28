"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { AdminDbProvider } from "@/contexts/admin-db-context";
import { ComplaintDbProvider } from "@/contexts/complaint-db-context";
import { ProjectDbProvider } from "@/contexts/project-db-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminDbProvider>
        <ComplaintDbProvider>
          <ProjectDbProvider>{children}</ProjectDbProvider>
        </ComplaintDbProvider>
      </AdminDbProvider>
    </AuthProvider>
  );
}
