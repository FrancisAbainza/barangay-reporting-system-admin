import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DateFilterBadgeProps {
  dateRange: string;
  onRemove: () => void;
}

export default function DateFilterBadge({ dateRange, onRemove }: DateFilterBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 pr-1"
    >
      {dateRange}
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-background/20 rounded-full p-0.5 transition-colors"
        aria-label="Remove date range filter"
        type="button"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}
