"use client";

import { useState, useMemo } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProjectStatus, ProjectCategory, CreateProjectInput, Project } from "@/types/project";
import { ProjectStats } from "./components/project-stats";
import { ProjectFilters } from "./components/project-filters";
import { ProjectTable } from "./components/project-table";
import { ProjectFormDialog } from "./components/project-form-dialog";
import { UpdateStatusDialog, type UpdateStatusFormValues } from "./components/update-status-dialog";
import { getStatusBadge, getCategoryLabel, getCategoryBadge } from "@/lib/project-helpers";
import { formatDate } from "@/lib/date-formatter";
import { Plus } from "lucide-react";

export default function TransparencyPage() {
  const { projects, createProject, updateProject, deleteProject } = useProjectDb();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<ProjectStatus[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<ProjectCategory[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);

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

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId);
    }
  };

  const handleCreateProject = () => {
    setDialogMode("create");
    setSelectedProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setDialogMode("edit");
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (project: Project) => {
    setSelectedProject(project);
    setIsUpdateStatusDialogOpen(true);
  };

  const handleUpdateStatusSubmit = (data: UpdateStatusFormValues) => {
    if (!selectedProject) return;

    const updateData: any = {
      status: data.status,
      progressPercentage: data.progressPercentage,
    };

    // Handle actualCompletionDate based on status
    if (data.status === "completed" && selectedProject.status !== "completed") {
      // Set actualCompletionDate to today when status changes to completed
      updateData.actualCompletionDate = new Date();
    } else if (data.status !== "completed" && selectedProject.status === "completed") {
      // Clear actualCompletionDate when status changes away from completed
      updateData.actualCompletionDate = undefined;
    }

    if (data.progressUpdateDescription) {
      const newProgressUpdate: any = {
        description: data.progressUpdateDescription,
        createdAt: new Date(),
      };
      
      if (data.progressUpdateImage) {
        newProgressUpdate.image = data.progressUpdateImage;
      }
      
      updateData.progressUpdates = [
        ...(selectedProject.progressUpdates || []),
        newProgressUpdate,
      ];
    }

    updateProject(selectedProject.id, updateData);
  };

  const handleFormSubmit = (data: CreateProjectInput) => {
    if (dialogMode === "create") {
      createProject(data);
    } else if (selectedProject) {
      updateProject(selectedProject.id, data);
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projects Overview</CardTitle>
              <CardDescription>View and manage all barangay projects</CardDescription>
            </div>
            <Button onClick={handleCreateProject}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </div>
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
            handleDeleteProject={handleDeleteProject}
            handleEditProject={handleEditProject}
            handleUpdateStatus={handleUpdateStatus}
          />
        </CardContent>
      </Card>

      {/* Project Form Dialog */}
      <ProjectFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleFormSubmit}
        project={selectedProject}
        mode={dialogMode}
      />

      {/* Update Status Dialog */}
      <UpdateStatusDialog
        open={isUpdateStatusDialogOpen}
        onOpenChange={setIsUpdateStatusDialogOpen}
        onSubmit={handleUpdateStatusSubmit}
        project={selectedProject}
      />
    </div>
  );
}
