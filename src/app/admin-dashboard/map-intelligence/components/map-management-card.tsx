"use client";

import { Card, CardContent } from "@/components/ui/card";
import MapDisplay from "./map-display";
import MapFilters from "./map-filters";
import type { ComplaintStatusType, ComplaintCategoryType, ComplaintType } from "@/types/complaint";
import type { ProjectStatusType, ProjectCategoryType, ProjectType } from "@/types/project";

type ComplaintFilters = {
  searchQuery: string;
  statusFilters: ComplaintStatusType[];
  categoryFilters: ComplaintCategoryType[];
  priorityFilters: string[];
  dateFrom: string;
  dateTo: string;
  showHeatmap: boolean;
};

type ProjectFilters = {
  searchQuery: string;
  statusFilters: ProjectStatusType[];
  categoryFilters: ProjectCategoryType[];
  dateFrom: string;
  dateTo: string;
  showHeatmap: boolean;
};

type MapManagementCardProps =
  | {
      type: "complaints";
      complaints: ComplaintType[];
      filteredComplaints: ComplaintType[];
      filters: ComplaintFilters;
      onFilterChange: (filters: ComplaintFilters) => void;
      projects?: never;
      filteredProjects?: never;
    }
  | {
      type: "transparency";
      projects: ProjectType[];
      filteredProjects: ProjectType[];
      filters: ProjectFilters;
      onFilterChange: (filters: ProjectFilters) => void;
      complaints?: never;
      filteredComplaints?: never;
    };

export default function MapManagementCard(props: MapManagementCardProps) {
  const { type, filters, onFilterChange } = props;

  if (type === "complaints") {
    const { filteredComplaints } = props;
    
    return (
      <Card className="py-0">
        <CardContent className="p-4 space-y-4">
          <MapFilters
            type="complaints"
            filters={filters}
            onFilterChange={onFilterChange}
          />
          <MapDisplay complaints={filteredComplaints} type="complaints" showHeatmap={filters.showHeatmap} />
        </CardContent>
      </Card>
    );
  }

  const { filteredProjects } = props;
  
  return (
    <Card className="py-0">
      <CardContent className="p-4 space-y-4">
        <MapFilters
          type="transparency"
          filters={filters}
          onFilterChange={onFilterChange}
        />
        <MapDisplay projects={filteredProjects} type="transparency" showHeatmap={filters.showHeatmap} />
      </CardContent>
    </Card>
  );
}
