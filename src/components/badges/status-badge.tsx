import { ComplaintStatusType } from "@/types/complaint";
import { Badge } from "@/components/ui/badge";
import { ProjectStatusType } from "@/types/project";
import * as ComplaintHelpers from "@/lib/complaint-helpers";
import * as ProjectHelpers from "@/lib/project-helpers";

type StatusBadgeProps = {
  type: "complaint" | "project";
  status: ComplaintStatusType | ProjectStatusType;
};

const getStatusColor = (status: string, type: "complaint" | "project") => {
  if (type === "complaint") {
    return ComplaintHelpers.getStatusColor(status as ComplaintStatusType);
  } else {
    return ProjectHelpers.getStatusColor(status as ProjectStatusType);
  }
};

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function StatusBadge({ type, status }: StatusBadgeProps) {
  const color = getStatusColor(status, type);
  
  return (
    <Badge
      variant="secondary"
      style={{
        backgroundColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.25)'),
        color: color,
        borderColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.4)'),
      }}
    >
      {formatStatus(status)}
    </Badge>
  );
}