import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Pause, XCircle } from "lucide-react";
import type { ProjectStatusType, ProjectCategoryType } from "@/types/project";
import { getStatusBadge, getCategoryLabel, getCategoryBadge } from "@/lib/project-helpers";

interface ProjectStatusCardProps {
  status: ProjectStatusType;
  category: ProjectCategoryType;
  progressPercentage: number;
}

export default function ProjectStatusCard({
  status,
  category,
  progressPercentage,
}: ProjectStatusCardProps) {
  const getStatusIcon = (status: ProjectStatusType) => {
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
