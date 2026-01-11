import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/badges/status-badge";
import PriorityBadge from "@/components/badges/priority-badge";
import CategoryBadge from "@/components/badges/category-badge";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import type { ComplaintType } from "@/types/complaint";
import { formatDate } from "@/lib/date-formatter";

interface ComplaintInfoWindowProps {
  complaint: ComplaintType;
}

export default function ComplaintInfoWindow({ complaint }: ComplaintInfoWindowProps) {
  return (
    <div className="w-70 max-h-[500px]">
      {/* Image Section */}
      {complaint.images && complaint.images.length > 0 && (
        <div className="relative h-40 w-full mb-2 rounded-lg overflow-hidden">
          <Image
            src={complaint.images[0].uri}
            alt={complaint.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Header Section */}
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold text-sm leading-tight mb-1.5 line-clamp-2">
            {complaint.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge type="complaint" status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
            <CategoryBadge type="complaint" category={complaint.category} />
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-1.5 pt-2 border-t">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-tight line-clamp-1">
              {complaint.location?.address || "No address"}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              {formatDate(complaint.createdAt)}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/admin-dashboard/complaints/${complaint.id}`} className="block pt-1.5">
          <Button size="sm" variant="default" className="w-full h-8 text-xs">
            <ExternalLink className="h-3 w-3 mr-1.5" />
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
