"use client";

import { useState, useMemo } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectStatus, ProjectCategory } from "@/types/project";
import { ProjectStats } from "./components/project-stats";
import { ProjectFilters } from "./components/project-filters";
import { ProjectTable } from "./components/project-table";
import { getStatusBadge, getCategoryLabel, getCategoryBadge } from "@/lib/project-helpers";
import { formatDate } from "@/lib/date-formatter";

export default function TransparencyPage() {
  const { projects, updateProject, deleteProject } = useProjectDb();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<ProjectStatus[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<ProjectCategory[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Statistics
  const stats = useMemo(() => {
    return {
      total: projects.length,
      planned: projects.filter((p) => p.status === "planned").length,
      approved: projects.filter((p) => p.status === "approved").length,
      ongoing: projects.filter((p) => p.status === "ongoing").length,
      onHold: projects.filter((p) => p.status === "on_hold").length,
      completed: projects.filter((p) => p.status === "completed").length,
      cancelled: projects.filter((p) => p.status === "cancelled").length,
    };
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.contractor && project.contractor.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(project.status);
      
      const matchesCategory =
        categoryFilters.length === 0 || categoryFilters.includes(project.category);

      const matchesDateFrom =
        !dateFrom || new Date(project.startDate) >= new Date(dateFrom);
      
      const matchesDateTo =
        !dateTo || new Date(project.startDate) <= new Date(dateTo + "T23:59:59");

      return matchesSearch && matchesStatus && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [projects, searchQuery, statusFilters, categoryFilters, dateFrom, dateTo]);

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    updateProject(projectId, { status: newStatus });
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId);
    }
  };

  return (
    <div className="container p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transparency Management</h1>
        <p className="text-muted-foreground">
          Manage and track community projects and transparency data
        </p>
      </div>

      {/* Statistics Cards */}
      <ProjectStats stats={stats} />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
          <CardDescription>View and manage all barangay projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProjectFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilters={statusFilters}
            setStatusFilters={setStatusFilters}
            categoryFilters={categoryFilters}
            setCategoryFilters={setCategoryFilters}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            getStatusBadge={getStatusBadge}
            getCategoryLabel={getCategoryLabel}
          />

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>

          {/* Projects Table */}
          <ProjectTable
            projects={filteredProjects}
            getStatusBadge={getStatusBadge}
            getCategoryLabel={getCategoryLabel}
            getCategoryBadge={getCategoryBadge}
            formatDate={formatDate}
            handleStatusChange={handleStatusChange}
            handleDeleteProject={handleDeleteProject}
          />
        </CardContent>
      </Card>
    </div>
  );
}
