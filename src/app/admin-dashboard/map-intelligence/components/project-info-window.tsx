import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/badges/status-badge";
import CategoryBadge from "@/components/badges/category-badge";
import { MapPin, Calendar, Wallet, ExternalLink } from "lucide-react";
import type { ProjectType } from "@/types/project";
import { formatDate } from "@/lib/date-formatter";

interface ProjectInfoWindowProps {
  project: ProjectType;
}

export default function ProjectInfoWindow({ project }: ProjectInfoWindowProps) {
  return (
    <div className="w-70 max-h-[500px]">
      {/* Image Section */}
      {project.images && project.images.length > 0 && (
        <div className="relative h-40 w-full mb-2 rounded-lg overflow-hidden">
          <img
            src={project.images[0].uri}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Header Section */}
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold text-sm leading-tight mb-1.5 line-clamp-2">
            {project.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge type="project" status={project.status} />
            <CategoryBadge type="project" category={project.category} />
            <Badge variant="outline" className="text-xs font-semibold">
              {project.progressPercentage}%
            </Badge>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-1.5 pt-2 border-t">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-tight line-clamp-1">
              {project.location?.address || "No address"}
            </p>
          </div>

          {project.budget && (
            <div className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground font-semibold">
                ₱{project.budget.toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              {formatDate(project.startDate)}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/admin-dashboard/transparency/${project.id}`} className="block pt-1.5">
          <Button size="sm" variant="default" className="w-full h-8 text-xs">
            <ExternalLink className="h-3 w-3 mr-1.5" />
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
