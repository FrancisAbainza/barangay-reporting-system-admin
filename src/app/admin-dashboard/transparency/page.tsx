"use client";

import { useProjectDb } from "@/contexts/project-db-context";
import ProjectStats from "./components/project-stats";
import ProjectManagementCard from "./components/project-management-card";
import { Eye } from "lucide-react";
import PageHeader from "@/components/page-header";

// In production, this would be a Server Component with:
// const projects = await fetchProjects();
export default function TransparencyPage() {
  const { projects } = useProjectDb();

  return (
    <div className="container p-6 space-y-6">
      <PageHeader
        title="Transparency Management"
        subtitle="Manage and track community projects and transparency data"
        icon={<Eye className="h-6 w-6 text-primary" />}
      />
      <ProjectStats projects={projects} />
      <ProjectManagementCard projects={projects} />
    </div>
  );
}
