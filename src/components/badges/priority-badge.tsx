
import { ComplaintPriorityType } from "@/types/complaint";
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  priority: ComplaintPriorityType;
};

export function getPriorityBadge(priority: string) {
  const colors: Record<string, string> = {
    low: "bg-primary/10 text-primary",
    medium: "bg-chart-4/20 text-chart-4",
    high: "bg-chart-5/20 text-chart-5",
    urgent: "bg-destructive/10 text-destructive",
  };
  return colors[priority] || colors.medium;
}

export default function PriorityBadge({ priority }: StatusBadgeProps) {
  return (
    <Badge className={getPriorityBadge(priority)}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}