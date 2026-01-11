
import { ComplaintPriorityType } from "@/types/complaint";
import { Badge } from "@/components/ui/badge";
import { getPriorityColor } from "@/lib/complaint-helpers";

type StatusBadgeProps = {
  priority: ComplaintPriorityType;
};

export default function PriorityBadge({ priority }: StatusBadgeProps) {
  const color = getPriorityColor(priority);
  
  return (
    <Badge
      style={{
        backgroundColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.25)'),
        color: color,
        borderColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.4)'),
      }}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}