import { ComplaintStatusType } from "@/types/complaint";
import { Badge } from "./ui/badge";
import { ProjectStatusType } from "@/types/project";

type StatusBadgeProps = {
  type: "complaint" | "project";
  status: ComplaintStatusType | ProjectStatusType;
};

const getStatusColor = (status: string, type: "complaint" | "project") => {
  if (type === "complaint") {
    switch (status) {
      case "resolved":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "in_progress":
      case "scheduled":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
      case "dismissed":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      default:
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    }
  } else {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "ongoing":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
      case "cancelled":
      case "on_hold":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      default:
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
    }
  }
};

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function StatusBadge({ type, status }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={getStatusColor(status, type)}
    >
      {formatStatus(status)}
    </Badge>
  );
}