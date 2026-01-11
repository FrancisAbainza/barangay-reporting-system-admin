import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ComplaintPriorityType } from "@/types/complaint";

type PriorityFilterBadgeProps = {
  priority: ComplaintPriorityType;
  onRemove: () => void;
};

const getPriorityColor = (priority: ComplaintPriorityType) => {
  const colors: Record<ComplaintPriorityType, string> = {
    low: "bg-primary/10 text-primary",
    medium: "bg-chart-4/20 text-chart-4",
    high: "bg-chart-5/20 text-chart-5",
    urgent: "bg-destructive/10 text-destructive",
  };
  return colors[priority];
};

export default function PriorityFilterBadge({ priority, onRemove }: PriorityFilterBadgeProps) {
  return (
    <Badge
      className={`${getPriorityColor(priority)} flex items-center gap-1 pr-1`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-background/20 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${priority} priority filter`}
        type="button"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}
