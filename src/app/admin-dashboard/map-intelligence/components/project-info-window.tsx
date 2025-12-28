import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, TrendingUp, Wallet, ExternalLink } from "lucide-react";
import type { Project } from "@/types/project";
import { getStatusBadge, getCategoryLabel } from "@/lib/project-helpers";
import { formatDate } from "@/lib/date-formatter";

interface ProjectInfoWindowProps {
  project: Project;
}

export function ProjectInfoWindow({ project }: ProjectInfoWindowProps) {
  const statusBadge = getStatusBadge(project.status);
  
  return (
    <div className="w-70">
      {/* Image Section */}
      {project.images && project.images.length > 0 && (
        <div className="relative h-40 w-full mb-3 rounded-lg overflow-hidden">
          <img
            src={project.images[0].uri}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Header Section */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-2">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={statusBadge.className} variant="default">
              {statusBadge.label}
            </Badge>
            <Badge variant="outline" className="font-semibold">
              {project.progressPercentage}% Complete
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
                {project.location?.address || "No address"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="min-w-4 pt-0.5">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground/80">Category</p>
              <p className="text-xs text-muted-foreground">
                {getCategoryLabel(project.category)}
              </p>
            </div>
          </div>

          {project.budget && (
            <div className="flex items-start gap-2">
              <div className="min-w-4 pt-0.5">
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground/80">Budget</p>
                <p className="text-xs text-muted-foreground font-semibold">
                  ₱{project.budget.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2">
            <div className="min-w-4 pt-0.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground/80">Start Date</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(project.startDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/admin-dashboard/transparency/${project.id}`} className="block pt-2">
          <Button size="sm" variant="default" className="w-full">
            <ExternalLink className="h-3.5 w-3.5 mr-2" />
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
