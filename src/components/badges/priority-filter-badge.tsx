import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ComplaintPriorityType } from "@/types/complaint";
import { getPriorityColor } from "@/lib/complaint-helpers";

type PriorityFilterBadgeProps = {
  priority: ComplaintPriorityType;
  onRemove: () => void;
};

export default function PriorityFilterBadge({ priority, onRemove }: PriorityFilterBadgeProps) {
  const color = getPriorityColor(priority);
  
  return (
    <Badge
      className="flex items-center gap-1 pr-1"
      style={{
        backgroundColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.25)'),
        color: color,
        borderColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.4)'),
      }}
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
