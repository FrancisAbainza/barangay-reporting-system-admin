import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterPopoverProps<T extends string> {
  icon: LucideIcon;
  label: string;
  title: string;
  options: FilterOption<T>[];
  selectedFilters: T[];
  onFilterChange: (filters: T[]) => void;
}

export default function FilterPopover<T extends string>({
  icon: Icon,
  label,
  title,
  options,
  selectedFilters,
  onFilterChange,
}: FilterPopoverProps<T>) {
  const handleCheckedChange = (checked: boolean, value: T) => {
    const newFilters = checked
      ? [...selectedFilters, value]
      : selectedFilters.filter((filter) => filter !== value);
    onFilterChange(newFilters);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <Icon className="h-4 w-4 mr-2" />
          {label}
          {selectedFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedFilters.length}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">{title}</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${label.toLowerCase()}-${option.value}`}
                  checked={selectedFilters.includes(option.value)}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckedChange(checked, option.value)
                  }
                />
                <Label
                  htmlFor={`${label.toLowerCase()}-${option.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
