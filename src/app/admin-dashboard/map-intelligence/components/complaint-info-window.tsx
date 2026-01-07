import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import type { ComplaintType } from "@/types/complaint";
import { getStatusBadge, getCategoryLabel } from "@/lib/complaint-helpers";
import { formatDate } from "@/lib/date-formatter";

interface ComplaintInfoWindowProps {
  complaint: ComplaintType;
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "destructive";
    case "medium":
      return "default";
    default:
      return "secondary";
  }
};

export function ComplaintInfoWindow({ complaint }: ComplaintInfoWindowProps) {
  const statusBadge = getStatusBadge(complaint.status);
  
  return (
    <div className="w-70">
      {/* Image Section */}
      {complaint.images && complaint.images.length > 0 && (
        <div className="relative h-40 w-full mb-3 rounded-lg overflow-hidden">
          <img
            src={complaint.images[0].uri}
            alt={complaint.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Header Section */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-2">
            {complaint.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={statusBadge.className} variant="default">
              {statusBadge.label}
            </Badge>
            <Badge variant={priorityVariant(complaint.priority)}>
              {complaint.priority.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-start gap-2">
            <div className="min-w-4 pt-0.5">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground/80">Location</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {complaint.location?.address || "No address"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="min-w-4 pt-0.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground/80">Reported</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(complaint.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="min-w-4 pt-0.5">
              <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground/80">Category</p>
              <p className="text-xs text-muted-foreground">
                {getCategoryLabel(complaint.category)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/admin-dashboard/complaints/${complaint.id}`} className="block pt-2">
          <Button size="sm" variant="default" className="w-full">
            <ExternalLink className="h-3.5 w-3.5 mr-2" />
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
