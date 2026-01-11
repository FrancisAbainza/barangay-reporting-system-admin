"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Search, Filter, XCircle, Tag, Flag, CalendarIcon, ChevronDown } from "lucide-react";
import type { ComplaintStatusType, ComplaintCategoryType } from "@/types/complaint";
import type { ProjectStatusType, ProjectCategoryType } from "@/types/project";
import FilterPopover from "@/components/filter-popover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

type MapFiltersProps =
  | {
    type: "complaints";
    filters: ComplaintFilters;
    onFilterChange: (filters: ComplaintFilters) => void;
  }
  | {
    type: "transparency";
    filters: ProjectFilters;
    onFilterChange: (filters: ProjectFilters) => void;
  };

export default function MapFilters(props: MapFiltersProps) {
  const { type, filters, onFilterChange } = props;

  const searchQuery = filters.searchQuery;
  const statusFilters = filters.statusFilters;
  const categoryFilters = filters.categoryFilters;
  const dateFrom = filters.dateFrom;
  const dateTo = filters.dateTo;
  const showHeatmap = filters.showHeatmap;
  const priorityFilters = type === "complaints" ? (filters as ComplaintFilters).priorityFilters : [];

  const hasActiveFilters =
    searchQuery ||
    statusFilters.length > 0 ||
    categoryFilters.length > 0 ||
    (type === "complaints" && priorityFilters.length > 0) ||
    dateFrom ||
    dateTo;

  const updateFilters = (updates: Partial<ComplaintFilters> | Partial<ProjectFilters>) => {
    if (type === "complaints") {
      onFilterChange({
        ...(filters as ComplaintFilters),
        ...updates,
      } as ComplaintFilters);
    } else {
      onFilterChange({
        ...(filters as ProjectFilters),
        ...updates,
      } as ProjectFilters);
    }
  };

  const clearAllFilters = () => {
    if (type === "complaints") {
      onFilterChange({
        searchQuery: "",
        statusFilters: [],
        categoryFilters: [],
        priorityFilters: [],
        dateFrom: "",
        dateTo: "",
        showHeatmap: false,
      });
    } else {
      onFilterChange({
        searchQuery: "",
        statusFilters: [],
        categoryFilters: [],
        dateFrom: "",
        dateTo: "",
        showHeatmap: false,
      });
    }
  };

  const complaintStatuses = [
    { value: "submitted" as ComplaintStatusType, label: "Submitted" },
    { value: "under_review" as ComplaintStatusType, label: "Under Review" },
    { value: "scheduled" as ComplaintStatusType, label: "Scheduled" },
    { value: "in_progress" as ComplaintStatusType, label: "In Progress" },
    { value: "resolved" as ComplaintStatusType, label: "Resolved" },
    { value: "dismissed" as ComplaintStatusType, label: "Dismissed" },
  ];

  const projectStatuses = [
    { value: "planned" as ProjectStatusType, label: "Planned" },
    { value: "approved" as ProjectStatusType, label: "Approved" },
    { value: "ongoing" as ProjectStatusType, label: "Ongoing" },
    { value: "on_hold" as ProjectStatusType, label: "On Hold" },
    { value: "completed" as ProjectStatusType, label: "Completed" },
    { value: "cancelled" as ProjectStatusType, label: "Cancelled" },
  ];

  const complaintCategories = [
    { value: "noise" as ComplaintCategoryType, label: "Noise" },
    { value: "sanitation" as ComplaintCategoryType, label: "Sanitation" },
    { value: "public_safety" as ComplaintCategoryType, label: "Public Safety" },
    { value: "traffic" as ComplaintCategoryType, label: "Traffic" },
    { value: "infrastructure" as ComplaintCategoryType, label: "Infrastructure" },
    { value: "water_electricity" as ComplaintCategoryType, label: "Water & Electricity" },
    { value: "domestic" as ComplaintCategoryType, label: "Domestic" },
    { value: "environment" as ComplaintCategoryType, label: "Environment" },
    { value: "others" as ComplaintCategoryType, label: "Others" },
  ];

  const projectCategories = [
    { value: "infrastructure" as ProjectCategoryType, label: "Infrastructure" },
    { value: "health" as ProjectCategoryType, label: "Health" },
    { value: "education" as ProjectCategoryType, label: "Education" },
    { value: "environment" as ProjectCategoryType, label: "Environment" },
    { value: "livelihood" as ProjectCategoryType, label: "Livelihood" },
    { value: "disaster_preparedness" as ProjectCategoryType, label: "Disaster Preparedness" },
    { value: "social_services" as ProjectCategoryType, label: "Social Services" },
    { value: "sports_culture" as ProjectCategoryType, label: "Sports & Culture" },
    { value: "others" as ProjectCategoryType, label: "Others" },
  ];

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  const statuses = type === "complaints" ? complaintStatuses : projectStatuses;
  const categories = type === "complaints" ? complaintCategories : projectCategories;

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      {/* Search and Filters */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={type === "complaints" ? "Search complaints..." : "Search projects..."}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            />
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="whitespace-nowrap"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2 2xl:flex 2xl:flex-wrap">
          {/* Status Filter */}
          {type === "complaints" ? (
            <FilterPopover<ComplaintStatusType>
              icon={Filter}
              label="Status"
              title="Filter by Status"
              options={complaintStatuses}
              selectedFilters={statusFilters as ComplaintStatusType[]}
              onFilterChange={(filters) => updateFilters({ statusFilters: filters })}
            />
          ) : (
            <FilterPopover<ProjectStatusType>
              icon={Filter}
              label="Status"
              title="Filter by Status"
              options={projectStatuses}
              selectedFilters={statusFilters as ProjectStatusType[]}
              onFilterChange={(filters) => updateFilters({ statusFilters: filters })}
            />
          )}

          {/* Category Filter */}
          {type === "complaints" ? (
            <FilterPopover<ComplaintCategoryType>
              icon={Tag}
              label="Category"
              title="Filter by Category"
              options={complaintCategories}
              selectedFilters={categoryFilters as ComplaintCategoryType[]}
              onFilterChange={(filters) => updateFilters({ categoryFilters: filters })}
            />
          ) : (
            <FilterPopover<ProjectCategoryType>
              icon={Tag}
              label="Category"
              title="Filter by Category"
              options={projectCategories}
              selectedFilters={categoryFilters as ProjectCategoryType[]}
              onFilterChange={(filters) => updateFilters({ categoryFilters: filters })}
            />
          )}

          {/* Priority Filter (only for complaints) */}
          {type === "complaints" && (
            <FilterPopover<string>
              icon={Flag}
              label="Priority"
              title="Filter by Priority"
              options={priorities}
              selectedFilters={priorityFilters}
              onFilterChange={(filters) => updateFilters({ priorityFilters: filters })}
            />
          )}

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Date Range
                {(dateFrom || dateTo) && (
                  <Badge variant="secondary" className="ml-2">
                    1
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Filter by Date Range</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="date-from" className="text-sm">From</Label>
                    <Input
                      id="date-from"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-to" className="text-sm">To</Label>
                    <Input
                      id="date-to"
                      type="date"
                      value={dateTo}
                      onChange={(e) => updateFilters({ dateTo: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Heatmap Toggle */}
      <div className="flex-1 flex items-center justify-between rounded-lg border border-input p-3 bg-card">
        <div className="flex flex-col gap-1">
          <Label htmlFor="heatmap-toggle" className="text-sm font-medium cursor-pointer">
            Heat Map View
          </Label>
          <p className="text-xs text-muted-foreground">
            Visualize data density across the map
          </p>
        </div>
        <Switch
          id="heatmap-toggle"
          checked={showHeatmap}
          onCheckedChange={(checked) => updateFilters({ showHeatmap: checked })}
        />
      </div>
    </div>
  );
}
