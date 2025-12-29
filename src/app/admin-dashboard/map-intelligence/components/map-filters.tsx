"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, ChevronDown, Tag, Flag, XCircle, CalendarIcon } from "lucide-react";
import type { ComplaintStatus, ComplaintCategory } from "@/types/complaint";
import type { ProjectStatus, ProjectCategory } from "@/types/project";

interface MapFiltersProps {
  type: "complaints" | "transparency";
  onFilterChange: (filters: {
    searchQuery: string;
    statusFilters: (ComplaintStatus | ProjectStatus)[];
    categoryFilters: (ComplaintCategory | ProjectCategory)[];
    priorityFilters?: string[];
    dateFrom?: string;
    dateTo?: string;
    showHeatmap?: boolean;
  }) => void;
}

export function MapFilters({ type, onFilterChange }: MapFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<(ComplaintStatus | ProjectStatus)[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<(ComplaintCategory | ProjectCategory)[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showHeatmap, setShowHeatmap] = useState(false);

  const hasActiveFilters =
    searchQuery ||
    statusFilters.length > 0 ||
    categoryFilters.length > 0 ||
    (type === "complaints" && priorityFilters.length > 0) ||
    dateFrom ||
    dateTo;

  const updateFilters = (updates: Partial<{
    searchQuery: string;
    statusFilters: (ComplaintStatus | ProjectStatus)[];
    categoryFilters: (ComplaintCategory | ProjectCategory)[];
    priorityFilters: string[];
    dateFrom: string;
    dateTo: string;
    showHeatmap: boolean;
  }>) => {
    const newFilters = {
      searchQuery: updates.searchQuery ?? searchQuery,
      statusFilters: updates.statusFilters ?? statusFilters,
      categoryFilters: updates.categoryFilters ?? categoryFilters,
      priorityFilters: updates.priorityFilters ?? priorityFilters,
      dateFrom: updates.dateFrom ?? dateFrom,
      dateTo: updates.dateTo ?? dateTo,
      showHeatmap: updates.showHeatmap ?? showHeatmap,
    };

    if (updates.searchQuery !== undefined) setSearchQuery(updates.searchQuery);
    if (updates.statusFilters !== undefined) setStatusFilters(updates.statusFilters);
    if (updates.categoryFilters !== undefined) setCategoryFilters(updates.categoryFilters);
    if (updates.priorityFilters !== undefined) setPriorityFilters(updates.priorityFilters);
    if (updates.dateFrom !== undefined) setDateFrom(updates.dateFrom);
    if (updates.dateTo !== undefined) setDateTo(updates.dateTo);
    if (updates.showHeatmap !== undefined) setShowHeatmap(updates.showHeatmap);

    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilters([]);
    setCategoryFilters([]);
    setPriorityFilters([]);
    setDateFrom("");
    setDateTo("");
    setShowHeatmap(false);
    onFilterChange({
      searchQuery: "",
      statusFilters: [],
      categoryFilters: [],
      priorityFilters: [],
      dateFrom: "",
      dateTo: "",
      showHeatmap: false,
    });
  };

  const complaintStatuses = [
    { value: "submitted" as ComplaintStatus, label: "Submitted" },
    { value: "under_review" as ComplaintStatus, label: "Under Review" },
    { value: "scheduled" as ComplaintStatus, label: "Scheduled" },
    { value: "in_progress" as ComplaintStatus, label: "In Progress" },
    { value: "resolved" as ComplaintStatus, label: "Resolved" },
    { value: "dismissed" as ComplaintStatus, label: "Dismissed" },
  ];

  const projectStatuses = [
    { value: "planned" as ProjectStatus, label: "Planned" },
    { value: "approved" as ProjectStatus, label: "Approved" },
    { value: "ongoing" as ProjectStatus, label: "Ongoing" },
    { value: "on_hold" as ProjectStatus, label: "On Hold" },
    { value: "completed" as ProjectStatus, label: "Completed" },
    { value: "cancelled" as ProjectStatus, label: "Cancelled" },
  ];

  const complaintCategories = [
    { value: "noise" as ComplaintCategory, label: "Noise" },
    { value: "sanitation" as ComplaintCategory, label: "Sanitation" },
    { value: "public_safety" as ComplaintCategory, label: "Public Safety" },
    { value: "traffic" as ComplaintCategory, label: "Traffic" },
    { value: "infrastructure" as ComplaintCategory, label: "Infrastructure" },
    { value: "water_electricity" as ComplaintCategory, label: "Water & Electricity" },
    { value: "domestic" as ComplaintCategory, label: "Domestic" },
    { value: "environment" as ComplaintCategory, label: "Environment" },
    { value: "others" as ComplaintCategory, label: "Others" },
  ];

  const projectCategories = [
    { value: "infrastructure" as ProjectCategory, label: "Infrastructure" },
    { value: "health" as ProjectCategory, label: "Health" },
    { value: "education" as ProjectCategory, label: "Education" },
    { value: "environment" as ProjectCategory, label: "Environment" },
    { value: "livelihood" as ProjectCategory, label: "Livelihood" },
    { value: "disaster_preparedness" as ProjectCategory, label: "Disaster Preparedness" },
    { value: "social_services" as ProjectCategory, label: "Social Services" },
    { value: "sports_culture" as ProjectCategory, label: "Sports & Culture" },
    { value: "others" as ProjectCategory, label: "Others" },
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
      {/* Search */}
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
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Status
                {statusFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {statusFilters.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Filter by Status</h4>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status.value}`}
                        checked={statusFilters.includes(status.value)}
                        onCheckedChange={(checked: boolean) => {
                          const newFilters = checked
                            ? [...statusFilters, status.value]
                            : statusFilters.filter((s) => s !== status.value);
                          updateFilters({ statusFilters: newFilters });
                        }}
                      />
                      <Label
                        htmlFor={`status-${status.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {status.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Category Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-2" />
                Category
                {categoryFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {categoryFilters.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Filter by Category</h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.value}`}
                        checked={categoryFilters.includes(category.value)}
                        onCheckedChange={(checked: boolean) => {
                          const newFilters = checked
                            ? [...categoryFilters, category.value]
                            : categoryFilters.filter((c) => c !== category.value);
                          updateFilters({ categoryFilters: newFilters });
                        }}
                      />
                      <Label
                        htmlFor={`category-${category.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
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

          {/* Priority Filter (only for complaints) */}
          {type === "complaints" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Priority
                  {priorityFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {priorityFilters.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="start">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Filter by Priority</h4>
                  <div className="space-y-2">
                    {priorities.map((priority) => (
                      <div key={priority.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`priority-${priority.value}`}
                          checked={priorityFilters.includes(priority.value)}
                          onCheckedChange={(checked: boolean) => {
                            const newFilters = checked
                              ? [...priorityFilters, priority.value]
                              : priorityFilters.filter((p) => p !== priority.value);
                            updateFilters({ priorityFilters: newFilters });
                          }}
                        />
                        <Label
                          htmlFor={`priority-${priority.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {priority.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
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
