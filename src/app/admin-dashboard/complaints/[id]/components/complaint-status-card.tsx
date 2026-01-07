import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { ComplaintStatusType, ComplaintCategoryType } from "@/types/complaint";
import { getStatusBadge, getPriorityBadge, getCategoryLabel, getCategoryBadge } from "@/lib/complaint-helpers";

interface ComplaintStatusCardProps {
  status: ComplaintStatusType;
  priority: string;
  category: ComplaintCategoryType;
}

export function ComplaintStatusCard({
  status,
  priority,
  category,
}: ComplaintStatusCardProps) {
  const getStatusIcon = (status: ComplaintStatusType) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "dismissed":
        return <XCircle className="h-4 w-4" />;
      case "in_progress":
      case "under_review":
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(status)}
          Status & Priority
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge className={getStatusBadge(status).className}>
            {getStatusBadge(status).label}
          </Badge>
          <Badge className={getPriorityBadge(priority)}>
            {priority.toUpperCase()}
          </Badge>
          <Badge className={getCategoryBadge(category)}>
            {getCategoryLabel(category)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
