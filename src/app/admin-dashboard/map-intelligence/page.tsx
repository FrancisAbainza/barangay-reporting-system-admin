"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MapDisplay } from "./components/map-display";
import { MapFilters } from "./components/map-filters";
import { MapStats } from "./components/map-stats";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { useProjectDb } from "@/contexts/project-db-context";
import type { ComplaintStatus, ComplaintCategory } from "@/types/complaint";
import type { ProjectStatus, ProjectCategory } from "@/types/project";
import { MapIcon, AlertCircle, Building2 } from "lucide-react";

export default function MapIntelligencePage() {
  const { complaints } = useComplaintDb();
  const { projects } = useProjectDb();
  const [activeTab, setActiveTab] = useState<"complaints" | "transparency">("complaints");

  const [complaintFilters, setComplaintFilters] = useState({
    searchQuery: "",
    statusFilters: [] as ComplaintStatus[],
    categoryFilters: [] as ComplaintCategory[],
    priorityFilters: [] as string[],
  });

  const [projectFilters, setProjectFilters] = useState({
    searchQuery: "",
    statusFilters: [] as ProjectStatus[],
    categoryFilters: [] as ProjectCategory[],
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

      return true;
    });
  }, [projects, projectFilters]);

  return (
    <div className="container p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapIcon className="h-6 w-6 text-primary" />
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
            <AlertCircle className="h-4 w-4" />
            Complaints
          </TabsTrigger>
          <TabsTrigger value="transparency" className="gap-2">
            <Building2 className="h-4 w-4" />
            Transparency
          </TabsTrigger>
        </TabsList>

        {/* Complaints Tab */}
        <TabsContent value="complaints" className="space-y-6 mt-6">
          {/* Stats */}
          <MapStats complaints={filteredComplaints} type="complaints" />

          {/* Filters and Map */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <MapFilters
                type="complaints"
                onFilterChange={(filters) =>
                  setComplaintFilters({
                    searchQuery: filters.searchQuery,
                    statusFilters: filters.statusFilters as ComplaintStatus[],
                    categoryFilters: filters.categoryFilters as ComplaintCategory[],
                    priorityFilters: filters.priorityFilters || [],
                  })
                }
              />
              <MapDisplay complaints={filteredComplaints} type="complaints" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="transparency" className="space-y-6 mt-6">
          {/* Stats */}
          <MapStats projects={filteredProjects} type="transparency" />

          {/* Filters and Map */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <MapFilters
                type="transparency"
                onFilterChange={(filters) =>
                  setProjectFilters({
                    searchQuery: filters.searchQuery,
                    statusFilters: filters.statusFilters as ProjectStatus[],
                    categoryFilters: filters.categoryFilters as ProjectCategory[],
                  })
                }
              />
              <MapDisplay projects={filteredProjects} type="transparency" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
