"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MapDisplay } from "./components/map-display";
import { MapFilters } from "./components/map-filters";
import { MapStats } from "./components/map-stats";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { useProjectDb } from "@/contexts/project-db-context";
import type { ComplaintStatusType, ComplaintCategoryType } from "@/types/complaint";
import type { ProjectStatusType, ProjectCategoryType } from "@/types/project";
import { Map, Eye, MessageSquareWarning } from "lucide-react";

export default function MapIntelligencePage() {
  const { complaints } = useComplaintDb();
  const { projects } = useProjectDb();
  const [activeTab, setActiveTab] = useState<"complaints" | "transparency">("complaints");

  const [complaintFilters, setComplaintFilters] = useState({
    searchQuery: "",
    statusFilters: [] as ComplaintStatusType[],
    categoryFilters: [] as ComplaintCategoryType[],
    priorityFilters: [] as string[],
    dateFrom: "",
    dateTo: "",
    showHeatmap: false,
  });

  const [projectFilters, setProjectFilters] = useState({
    searchQuery: "",
    statusFilters: [] as ProjectStatusType[],
    categoryFilters: [] as ProjectCategoryType[],
    dateFrom: "",
    dateTo: "",
    showHeatmap: false,
  });

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      // Filter by search query
      if (
        complaintFilters.searchQuery &&
        !complaint.title.toLowerCase().includes(complaintFilters.searchQuery.toLowerCase()) &&
        !complaint.description.toLowerCase().includes(complaintFilters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Filter by status
      if (
        complaintFilters.statusFilters.length > 0 &&
        !complaintFilters.statusFilters.includes(complaint.status)
      ) {
        return false;
      }

      // Filter by category
      if (
        complaintFilters.categoryFilters.length > 0 &&
        !complaintFilters.categoryFilters.includes(complaint.category)
      ) {
        return false;
      }

      // Filter by priority
      if (
        complaintFilters.priorityFilters.length > 0 &&
        !complaintFilters.priorityFilters.includes(complaint.priority)
      ) {
        return false;
      }

      // Filter by date range
      if (complaintFilters.dateFrom || complaintFilters.dateTo) {
        const complaintDate = new Date(complaint.createdAt);
        if (complaintFilters.dateFrom && complaintDate < new Date(complaintFilters.dateFrom)) {
          return false;
        }
        if (complaintFilters.dateTo && complaintDate > new Date(complaintFilters.dateTo + "T23:59:59")) {
          return false;
        }
      }

      return true;
    });
  }, [complaints, complaintFilters]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by search query
      if (
        projectFilters.searchQuery &&
        !project.title.toLowerCase().includes(projectFilters.searchQuery.toLowerCase()) &&
        !project.description.toLowerCase().includes(projectFilters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Filter by status
      if (
        projectFilters.statusFilters.length > 0 &&
        !projectFilters.statusFilters.includes(project.status)
      ) {
        return false;
      }

      // Filter by category
      if (
        projectFilters.categoryFilters.length > 0 &&
        !projectFilters.categoryFilters.includes(project.category)
      ) {
        return false;
      }

      // Filter by date range
      if (projectFilters.dateFrom || projectFilters.dateTo) {
        const projectDate = new Date(project.createdAt);
        if (projectFilters.dateFrom && projectDate < new Date(projectFilters.dateFrom)) {
          return false;
        }
        if (projectFilters.dateTo && projectDate > new Date(projectFilters.dateTo + "T23:59:59")) {
          return false;
        }
      }

      return true;
    });
  }, [projects, projectFilters]);

  return (
    <div className="container p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Map className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Map Intelligence</h1>
            <p className="text-muted-foreground">
              Geographic visualization and analysis of complaints and projects
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "complaints" | "transparency")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="complaints" className="gap-2">
            <MessageSquareWarning className="h-4 w-4" />
            Complaints
          </TabsTrigger>
          <TabsTrigger value="transparency" className="gap-2">
            <Eye className="h-4 w-4" />
            Transparency
          </TabsTrigger>
        </TabsList>

        {/* Complaints Tab */}
        <TabsContent value="complaints" className="space-y-6 mt-6">
          {/* Stats */}
          <MapStats complaints={filteredComplaints} type="complaints" />

          {/* Filters and Map */}
          <Card className="py-0">
            <CardContent className="p-4 space-y-4">
              <MapFilters
                type="complaints"
                onFilterChange={(filters) =>
                  setComplaintFilters({
                    searchQuery: filters.searchQuery,
                    statusFilters: filters.statusFilters as ComplaintStatusType[],
                    categoryFilters: filters.categoryFilters as ComplaintCategoryType[],
                    priorityFilters: filters.priorityFilters || [],
                    dateFrom: filters.dateFrom || "",
                    dateTo: filters.dateTo || "",
                    showHeatmap: filters.showHeatmap || false,
                  })
                }
              />
              <MapDisplay complaints={filteredComplaints} type="complaints" showHeatmap={complaintFilters.showHeatmap} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="transparency" className="space-y-6 mt-6">
          {/* Stats */}
          <MapStats projects={filteredProjects} type="transparency" />

          {/* Filters and Map */}
          <Card className="py-0">
            <CardContent className="p-4 space-y-4">
              <MapFilters
                type="transparency"
                onFilterChange={(filters) =>
                  setProjectFilters({
                    searchQuery: filters.searchQuery,
                    statusFilters: filters.statusFilters as ProjectStatusType[],
                    categoryFilters: filters.categoryFilters as ProjectCategoryType[],
                    dateFrom: filters.dateFrom || "",
                    dateTo: filters.dateTo || "",
                    showHeatmap: filters.showHeatmap || false,
                  })
                }
              />
              <MapDisplay projects={filteredProjects} type="transparency" showHeatmap={projectFilters.showHeatmap} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
