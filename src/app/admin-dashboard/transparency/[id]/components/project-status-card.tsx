import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Clock, Pause, XCircle } from "lucide-react";
import type { ProjectStatus, ProjectCategory } from "@/types/project";

interface ProjectStatusCardProps {
  status: ProjectStatus;
  category: ProjectCategory;
  progressPercentage: number;
  getStatusBadge: (status: ProjectStatus) => { className: string; label: string };
  getCategoryLabel: (category: ProjectCategory) => string;
  getCategoryBadge: (category: ProjectCategory) => string;
  onStatusChange: (value: ProjectStatus) => void;
}

export function ProjectStatusCard({
  status,
  category,
  progressPercentage,
  getStatusBadge,
  getCategoryLabel,
  getCategoryBadge,
  onStatusChange,
}: ProjectStatusCardProps) {
  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "on_hold":
        return <Pause className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(status)}
          Status & Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge className={getStatusBadge(status).className}>
            {getStatusBadge(status).label}
          </Badge>
          <Badge className={getCategoryBadge(category)}>
            {getCategoryLabel(category)}
          </Badge>
          <Select value={status} onValueChange={(value) => onStatusChange(value as ProjectStatus)}>
            <SelectTrigger className="flex-1 max-w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
