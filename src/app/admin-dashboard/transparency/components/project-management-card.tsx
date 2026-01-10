"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectStatusType, ProjectCategoryType, ProjectType } from "@/types/project";
import ProjectFilters from "./project-filters";
import ProjectTable from "./project-table";
import CreateProjectButton from "./create-project-button";

interface ProjectManagementCardProps {
  projects: ProjectType[];
}

// Client Component - Receives data as prop, uses context for CRUD operations
export default function ProjectManagementCard({ projects }: ProjectManagementCardProps) {
  const [filters, setFilters] = useState({
    searchQuery: "",
    statusFilters: [] as ProjectStatusType[],
    categoryFilters: [] as ProjectCategoryType[],
    dateFrom: "",
    dateTo: "",
  });

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (project.contractor && project.contractor.toLowerCase().includes(filters.searchQuery.toLowerCase()));
      
      const matchesStatus =
        filters.statusFilters.length === 0 || filters.statusFilters.includes(project.status);
      
      const matchesCategory =
        filters.categoryFilters.length === 0 || filters.categoryFilters.includes(project.category);

      const matchesDateFrom =
        !filters.dateFrom || new Date(project.startDate) >= new Date(filters.dateFrom);
      
      const matchesDateTo =
        !filters.dateTo || new Date(project.startDate) <= new Date(filters.dateTo + "T23:59:59");

      return matchesSearch && matchesStatus && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [projects, filters]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projects Overview</CardTitle>
              <CardDescription>View and manage all barangay projects</CardDescription>
            </div>
            <CreateProjectButton />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProjectFilters filters={filters} onFilterChange={setFilters} />

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>

          {/* Projects Table */}
          <ProjectTable
            projects={filteredProjects}
          />
        </CardContent>
      </Card>
    </>
  );
}
