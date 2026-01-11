import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ComplaintStatusType } from "@/types/complaint";
import type { ProjectStatusType } from "@/types/project";
import * as ComplaintHelpers from "@/lib/complaint-helpers";
import * as ProjectHelpers from "@/lib/project-helpers";

type StatusFilterBadgeProps = {
  type: "complaint" | "project";
  status: ComplaintStatusType | ProjectStatusType;
  onRemove: () => void;
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

export default function StatusFilterBadge({ type, status, onRemove }: StatusFilterBadgeProps) {
  const color = getStatusColor(status, type);
  
  return (
    <Badge
      className="flex items-center gap-1 pr-1"
      style={{
        backgroundColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.25)'),
        color: color,
        borderColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.4)'),
      }}
    >
      {formatStatus(status)}
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-background/20 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${status} status filter`}
        type="button"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}
