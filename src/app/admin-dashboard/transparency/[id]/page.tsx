"use client";

import { use } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { ProjectHeader } from "./components/project-header";
import { ProjectStatusCard } from "./components/project-status-card";
import { ProjectTabs } from "./components/project-tabs";

// In production, this would be a Server Component with:
// const project = await fetchProject(params.id);
export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { projects } = useProjectDb();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="container p-6">
        <p className="text-muted-foreground mt-6">The requested project could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container p-6 space-y-6">
      <ProjectHeader
        project={project}
      />

      <ProjectStatusCard
        status={project.status}
        category={project.category}
        progressPercentage={project.progressPercentage}
      />

      <ProjectTabs project={project} />
    </div>
  );
}
