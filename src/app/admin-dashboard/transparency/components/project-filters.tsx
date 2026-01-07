import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, ChevronDown, CalendarIcon, Tag } from "lucide-react";
import type { ProjectStatusType, ProjectCategoryType } from "@/types/project";
import { getStatusBadge, getCategoryLabel } from "@/lib/project-helpers";

interface ProjectFiltersProps {
  onFilterChange: (filters: {
    searchQuery: string;
    statusFilters: ProjectStatusType[];
    categoryFilters: ProjectCategoryType[];
    dateFrom: string;
    dateTo: string;
  }) => void;
}

export function ProjectFilters({ onFilterChange }: ProjectFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<ProjectStatusType[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<ProjectCategoryType[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const hasActiveFilters = searchQuery || statusFilters.length > 0 || categoryFilters.length > 0 || dateFrom || dateTo;

  const updateFilters = (updates: Partial<{
    searchQuery: string;
    statusFilters: ProjectStatusType[];
    categoryFilters: ProjectCategoryType[];
    dateFrom: string;
    dateTo: string;
  }>) => {
    const newFilters = {
      searchQuery: updates.searchQuery ?? searchQuery,
      statusFilters: updates.statusFilters ?? statusFilters,
      categoryFilters: updates.categoryFilters ?? categoryFilters,
      dateFrom: updates.dateFrom ?? dateFrom,
      dateTo: updates.dateTo ?? dateTo,
    };

    if (updates.searchQuery !== undefined) setSearchQuery(updates.searchQuery);
    if (updates.statusFilters !== undefined) setStatusFilters(updates.statusFilters);
    if (updates.categoryFilters !== undefined) setCategoryFilters(updates.categoryFilters);
    if (updates.dateFrom !== undefined) setDateFrom(updates.dateFrom);
    if (updates.dateTo !== undefined) setDateTo(updates.dateTo);

    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilters([]);
    setCategoryFilters([]);
    setDateFrom("");
    setDateTo("");
    onFilterChange({
      searchQuery: "",
      statusFilters: [],
      categoryFilters: [],
      dateFrom: "",
      dateTo: "",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
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
                  {[
                    { value: "planned" as ProjectStatusType, label: "Planned" },
                    { value: "approved" as ProjectStatusType, label: "Approved" },
                    { value: "ongoing" as ProjectStatusType, label: "Ongoing" },
                    { value: "on_hold" as ProjectStatusType, label: "On Hold" },
                    { value: "completed" as ProjectStatusType, label: "Completed" },
                    { value: "cancelled" as ProjectStatusType, label: "Cancelled" },
                  ].map((status) => (
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
              <Button variant="outline" className="w-full sm:w-auto">
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
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[
                    { value: "infrastructure" as ProjectCategoryType, label: "Infrastructure" },
                    { value: "health" as ProjectCategoryType, label: "Health" },
                    { value: "education" as ProjectCategoryType, label: "Education" },
                    { value: "environment" as ProjectCategoryType, label: "Environment" },
                    { value: "livelihood" as ProjectCategoryType, label: "Livelihood" },
                    { value: "disaster_preparedness" as ProjectCategoryType, label: "Disaster Preparedness" },
                    { value: "social_services" as ProjectCategoryType, label: "Social Services" },
                    { value: "sports_culture" as ProjectCategoryType, label: "Sports & Culture" },
                    { value: "others" as ProjectCategoryType, label: "Others" },
                  ].map((category) => (
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
              <Button variant="outline" className="w-full sm:w-auto">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Date Range
                {(dateFrom || dateTo) && (
                  <Badge variant="secondary" className="ml-2">1</Badge>
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

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {(statusFilters.length > 0 || categoryFilters.length > 0 || dateFrom || dateTo) && (
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <Badge key={status} variant="secondary" className="gap-1">
                Status: {getStatusBadge(status).label}
                <button
                  onClick={() => updateFilters({ statusFilters: statusFilters.filter((s) => s !== status) })}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            {categoryFilters.map((category) => (
              <Badge key={category} variant="secondary" className="gap-1">
                {getCategoryLabel(category)}
                <button
                  onClick={() => updateFilters({ categoryFilters: categoryFilters.filter((c) => c !== category) })}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            {(dateFrom || dateTo) && (
              <Badge variant="secondary" className="gap-1">
                {dateFrom && dateTo ? `${dateFrom} to ${dateTo}` : dateFrom ? `From ${dateFrom}` : `Until ${dateTo}`}
                <button
                  onClick={() => updateFilters({ dateFrom: "", dateTo: "" })}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
