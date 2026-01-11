import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, CalendarIcon, ChevronDown, Filter, Tag, Flag } from "lucide-react";
import type { ComplaintStatusType, ComplaintCategoryType, ComplaintPriorityType } from "@/types/complaint";
import FilterPopover from "@/components/filter-popover";
import StatusFilterBadge from "@/components/badges/status-filter-badge";
import CategoryFilterBadge from "@/components/badges/category-filter-badge";
import PriorityFilterBadge from "@/components/badges/priority-filter-badge";
import DateFilterBadge from "@/components/badges/date-filter-badge";

interface ComplaintFiltersProps {
  filters: {
    searchQuery: string;
    statusFilters: ComplaintStatusType[];
    categoryFilters: ComplaintCategoryType[];
    priorityFilters: ComplaintPriorityType[];
    dateFrom: string;
    dateTo: string;
  };
  onFilterChange: (filters: {
    searchQuery: string;
    statusFilters: ComplaintStatusType[];
    categoryFilters: ComplaintCategoryType[];
    priorityFilters: ComplaintPriorityType[];
    dateFrom: string;
    dateTo: string;
  }) => void;
}

export default function ComplaintFilters({ filters, onFilterChange }: ComplaintFiltersProps) {
  const { searchQuery, statusFilters, categoryFilters, priorityFilters, dateFrom, dateTo } = filters;

  const hasActiveFilters = searchQuery || statusFilters.length > 0 || categoryFilters.length > 0 || priorityFilters.length > 0 || dateFrom || dateTo;

  const updateFilters = (updates: Partial<{
    searchQuery: string;
    statusFilters: ComplaintStatusType[];
    categoryFilters: ComplaintCategoryType[];
    priorityFilters: ComplaintPriorityType[];
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
      priorityFilters: [],
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
          placeholder="Search complaints..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
        />
      </div>


      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:flex lg:flex-wrap">
          {/* Status Filter */}
          <FilterPopover<ComplaintStatusType>
            icon={Filter}
            label="Status"
            title="Filter by Status"
            options={[
              { value: "submitted", label: "Submitted" },
              { value: "under_review", label: "Under Review" },
              { value: "scheduled", label: "Scheduled" },
              { value: "in_progress", label: "In Progress" },
              { value: "resolved", label: "Resolved" },
              { value: "dismissed", label: "Dismissed" },
            ]}
            selectedFilters={statusFilters}
            onFilterChange={(filters) => updateFilters({ statusFilters: filters })}
          />

          {/* Category Filter */}
          <FilterPopover<ComplaintCategoryType>
            icon={Tag}
            label="Category"
            title="Filter by Category"
            options={[
              { value: "noise", label: "Noise" },
              { value: "sanitation", label: "Sanitation" },
              { value: "public_safety", label: "Public Safety" },
              { value: "traffic", label: "Traffic" },
              { value: "infrastructure", label: "Infrastructure" },
              { value: "water_electricity", label: "Water/Electricity" },
              { value: "domestic", label: "Domestic" },
              { value: "environment", label: "Environment" },
              { value: "others", label: "Others" },
            ]}
            selectedFilters={categoryFilters}
            onFilterChange={(filters) => updateFilters({ categoryFilters: filters })}
          />

          {/* Priority Filter */}
          <FilterPopover<ComplaintPriorityType>
            icon={Flag}
            label="Priority"
            title="Filter by Priority"
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
            selectedFilters={priorityFilters}
            onFilterChange={(filters) => updateFilters({ priorityFilters: filters })}
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
        {(statusFilters.length > 0 || categoryFilters.length > 0 || priorityFilters.length > 0 || dateFrom || dateTo) && (
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <StatusFilterBadge
                key={status}
                type="complaint"
                status={status}
                onRemove={() => updateFilters({ statusFilters: statusFilters.filter((s) => s !== status) })}
              />
            ))}
            {categoryFilters.map((category) => (
              <CategoryFilterBadge
                key={category}
                type="complaint"
                category={category}
                onRemove={() => updateFilters({ categoryFilters: categoryFilters.filter((c) => c !== category) })}
              />
            ))}
            {priorityFilters.map((priority) => (
              <PriorityFilterBadge
                key={priority}
                priority={priority}
                onRemove={() => updateFilters({ priorityFilters: priorityFilters.filter((p) => p !== priority) })}
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
