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
import { Search, Filter, ChevronDown, CalendarIcon, Tag, Flag } from "lucide-react";
import type { ComplaintStatus, ComplaintCategory } from "@/contexts/complaint-db-context";

interface ComplaintFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilters: ComplaintStatus[];
  setStatusFilters: (filters: ComplaintStatus[]) => void;
  categoryFilters: ComplaintCategory[];
  setCategoryFilters: (filters: ComplaintCategory[]) => void;
  priorityFilters: string[];
  setPriorityFilters: (filters: string[]) => void;
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
  getStatusBadge: (status: ComplaintStatus) => { className: string; label: string };
  getCategoryLabel: (category: ComplaintCategory) => string;
}

export function ComplaintFilters({
  searchQuery,
  setSearchQuery,
  statusFilters,
  setStatusFilters,
  categoryFilters,
  setCategoryFilters,
  priorityFilters,
  setPriorityFilters,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  getStatusBadge,
  getCategoryLabel,
}: ComplaintFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilters.length > 0 || categoryFilters.length > 0 || priorityFilters.length > 0 || dateFrom || dateTo;

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilters([]);
    setCategoryFilters([]);
    setPriorityFilters([]);
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search complaints..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                    { value: "submitted" as ComplaintStatus, label: "Submitted" },
                    { value: "under_review" as ComplaintStatus, label: "Under Review" },
                    { value: "scheduled" as ComplaintStatus, label: "Scheduled" },
                    { value: "in_progress" as ComplaintStatus, label: "In Progress" },
                    { value: "resolved" as ComplaintStatus, label: "Resolved" },
                    { value: "dismissed" as ComplaintStatus, label: "Dismissed" },
                  ].map((status) => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status.value}`}
                        checked={statusFilters.includes(status.value)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setStatusFilters([...statusFilters, status.value]);
                          } else {
                            setStatusFilters(statusFilters.filter((s) => s !== status.value));
                          }
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
                    { value: "noise" as ComplaintCategory, label: "Noise" },
                    { value: "sanitation" as ComplaintCategory, label: "Sanitation" },
                    { value: "public_safety" as ComplaintCategory, label: "Public Safety" },
                    { value: "traffic" as ComplaintCategory, label: "Traffic" },
                    { value: "infrastructure" as ComplaintCategory, label: "Infrastructure" },
                    { value: "water_electricity" as ComplaintCategory, label: "Water/Electricity" },
                    { value: "domestic" as ComplaintCategory, label: "Domestic" },
                    { value: "environment" as ComplaintCategory, label: "Environment" },
                    { value: "others" as ComplaintCategory, label: "Others" },
                  ].map((category) => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.value}`}
                        checked={categoryFilters.includes(category.value)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setCategoryFilters([...categoryFilters, category.value]);
                          } else {
                            setCategoryFilters(categoryFilters.filter((c) => c !== category.value));
                          }
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

          {/* Priority Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
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
                  {[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                    { value: "urgent", label: "Urgent" },
                  ].map((priority) => (
                    <div key={priority.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${priority.value}`}
                        checked={priorityFilters.includes(priority.value)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setPriorityFilters([...priorityFilters, priority.value]);
                          } else {
                            setPriorityFilters(priorityFilters.filter((p) => p !== priority.value));
                          }
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
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-to" className="text-sm">To</Label>
                    <Input
                      id="date-to"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
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
        {(statusFilters.length > 0 || categoryFilters.length > 0 || priorityFilters.length > 0 || dateFrom || dateTo) && (
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <Badge key={status} variant="secondary" className="gap-1">
                Status: {getStatusBadge(status).label}
                <button
                  onClick={() => setStatusFilters(statusFilters.filter((s) => s !== status))}
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
                  onClick={() => setCategoryFilters(categoryFilters.filter((c) => c !== category))}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            {priorityFilters.map((priority) => (
              <Badge key={priority} variant="secondary" className="gap-1">
                Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}
                <button
                  onClick={() => setPriorityFilters(priorityFilters.filter((p) => p !== priority))}
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
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                  }}
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
