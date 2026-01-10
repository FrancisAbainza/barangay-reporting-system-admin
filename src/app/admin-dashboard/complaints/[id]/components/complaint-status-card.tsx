import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { ComplaintStatusType, ComplaintCategoryType, ComplaintPriorityType } from "@/types/complaint";
import StatusBadge from "@/components/status-badge";
import PriorityBadge from "@/components/priority-badge";
import CategoryBadge from "@/components/category-badge";

interface ComplaintStatusCardProps {
  status: ComplaintStatusType;
  priority: ComplaintPriorityType;
  category: ComplaintCategoryType;
}

export default function ComplaintStatusCard({
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
          <StatusBadge type="complaint" status={status} />
          <PriorityBadge priority={priority} />
          <CategoryBadge type="complaint" category={category} />
        </div>
      </CardContent>
    </Card>
  );
}
