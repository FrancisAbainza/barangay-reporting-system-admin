import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { ComplaintStatus, ComplaintCategory } from "@/types/complaint";
import { getStatusBadge, getPriorityBadge, getCategoryLabel, getCategoryBadge } from "@/lib/complaint-helpers";

interface ComplaintStatusCardProps {
  status: ComplaintStatus;
  priority: string;
  category: ComplaintCategory;
  onStatusChange: (value: ComplaintStatus) => void;
}

export function ComplaintStatusCard({
  status,
  priority,
  category,
  onStatusChange,
}: ComplaintStatusCardProps) {
  const getStatusIcon = (status: ComplaintStatus) => {
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
      <CardContent className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
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
        <Select value={status} onValueChange={(value) => onStatusChange(value as ComplaintStatus)}>
          <SelectTrigger className="flex-1 max-w-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
