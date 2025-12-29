"use client";

import { useProjectDb } from "@/contexts/project-db-context";
import { ProjectStats } from "./components/project-stats";
import { ProjectManagementCard } from "./components/project-management-card";
import { Eye } from "lucide-react";

// In production, this would be a Server Component with:
// const projects = await fetchProjects();
export default function TransparencyPage() {
  const { projects } = useProjectDb();

  return (
    <div className="container p-6 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transparency Management</h1>
            <p className="text-muted-foreground">
              Manage and track community projects and transparency data
            </p>
          </div>
        </div>
      </div>

      <ProjectStats projects={projects} />
      <ProjectManagementCard projects={projects} />
    </div>
  );
}
