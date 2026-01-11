import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, CalendarIcon, ChevronDown, Filter, Tag } from "lucide-react";
import type { ProjectStatusType, ProjectCategoryType } from "@/types/project";
import FilterPopover from "@/components/filter-popover";
import StatusFilterBadge from "@/components/badges/status-filter-badge";
import CategoryFilterBadge from "@/components/badges/category-filter-badge";
import DateFilterBadge from "@/components/badges/date-filter-badge";

interface ProjectFiltersProps {
  filters: {
    searchQuery: string;
    statusFilters: ProjectStatusType[];
    categoryFilters: ProjectCategoryType[];
    dateFrom: string;
    dateTo: string;
  };
  onFilterChange: (filters: {
    searchQuery: string;
    statusFilters: ProjectStatusType[];
    categoryFilters: ProjectCategoryType[];
    dateFrom: string;
    dateTo: string;
  }) => void;
}

export default function ProjectFilters({ filters, onFilterChange }: ProjectFiltersProps) {
  const { searchQuery, statusFilters, categoryFilters, dateFrom, dateTo } = filters;

  const hasActiveFilters = searchQuery || statusFilters.length > 0 || categoryFilters.length > 0 || dateFrom || dateTo;

  const updateFilters = (updates: Partial<{
    searchQuery: string;
    statusFilters: ProjectStatusType[];
    categoryFilters: ProjectCategoryType[];
    dateFrom: string;
    dateTo: string;
  }>) => {
    onFilterChange({
      ...filters,
      ...updates,
    });
  };

  const clearAllFilters = () => {
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
        />
      </div>


      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:flex lg:flex-wrap">
          {/* Status Filter */}
          <FilterPopover<ProjectStatusType>
            icon={Filter}
            label="Status"
            title="Filter by Status"
            options={[
              { value: "planned", label: "Planned" },
              { value: "approved", label: "Approved" },
              { value: "ongoing", label: "Ongoing" },
              { value: "on_hold", label: "On Hold" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            selectedFilters={statusFilters}
            onFilterChange={(filters) => updateFilters({ statusFilters: filters })}
          />

          {/* Category Filter */}
          <FilterPopover<ProjectCategoryType>
            icon={Tag}
            label="Category"
            title="Filter by Category"
            options={[
              { value: "infrastructure", label: "Infrastructure" },
              { value: "health", label: "Health" },
              { value: "education", label: "Education" },
              { value: "environment", label: "Environment" },
              { value: "livelihood", label: "Livelihood" },
              { value: "disaster_preparedness", label: "Disaster Preparedness" },
              { value: "social_services", label: "Social Services" },
              { value: "sports_culture", label: "Sports & Culture" },
              { value: "others", label: "Others" },
            ]}
            selectedFilters={categoryFilters}
            onFilterChange={(filters) => updateFilters({ categoryFilters: filters })}
          />

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
              <StatusFilterBadge
                key={status}
                type="project"
                status={status}
                onRemove={() => updateFilters({ statusFilters: statusFilters.filter((s) => s !== status) })}
              />
            ))}
            {categoryFilters.map((category) => (
              <CategoryFilterBadge
                key={category}
                type="project"
                category={category}
                onRemove={() => updateFilters({ categoryFilters: categoryFilters.filter((c) => c !== category) })}
              />
            ))}
            {(dateFrom || dateTo) && (
              <DateFilterBadge
                dateRange={dateFrom && dateTo ? `${dateFrom} to ${dateTo}` : dateFrom ? `From ${dateFrom}` : `Until ${dateTo}`}
                onRemove={() => updateFilters({ dateFrom: "", dateTo: "" })}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
