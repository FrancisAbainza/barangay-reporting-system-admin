"use client";

import { useState, useMemo } from "react";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { useProjectDb } from "@/contexts/project-db-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapManagementCard from "./components/map-management-card";
import MapStats from "./components/map-stats";
import { Map, Eye, MessageSquareWarning } from "lucide-react";
import PageHeader from "@/components/page-header";
import type { ComplaintStatusType, ComplaintCategoryType } from "@/types/complaint";
import type { ProjectStatusType, ProjectCategoryType } from "@/types/project";

// In production, this would be a Server Component with:
// const complaints = await fetchComplaints();
// const projects = await fetchProjects();
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
      <PageHeader
        title="Map Intelligence"
        subtitle="Geographic visualization and analysis of complaints and projects"
        icon={<Map className="h-6 w-6 text-primary" />}
      />

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
          <MapManagementCard
            type="complaints"
            complaints={complaints}
            filteredComplaints={filteredComplaints}
            filters={complaintFilters}
            onFilterChange={setComplaintFilters}
          />
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="transparency" className="space-y-6 mt-6">
          {/* Stats */}
          <MapStats projects={filteredProjects} type="transparency" />

          {/* Filters and Map */}
          <MapManagementCard
            type="transparency"
            projects={projects}
            filteredProjects={filteredProjects}
            filters={projectFilters}
            onFilterChange={setProjectFilters}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
