import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ComplaintCategoryType } from "@/types/complaint";
import type { ProjectCategoryType } from "@/types/project";
import * as ComplaintHelpers from "@/lib/complaint-helpers";
import * as ProjectHelpers from "@/lib/project-helpers";

type CategoryFilterBadgeProps = {
  type: "complaint" | "project";
  category: ComplaintCategoryType | ProjectCategoryType;
  onRemove: () => void;
};

const getCategoryColor = (
  category: ComplaintCategoryType | ProjectCategoryType,
  type: "complaint" | "project"
): string => {
  if (type === "complaint") {
    return ComplaintHelpers.getCategoryColor(category as ComplaintCategoryType);
  }
  return ProjectHelpers.getCategoryColor(category as ProjectCategoryType);
};

const getCategoryLabel = (
  category: ComplaintCategoryType | ProjectCategoryType,
  type: "complaint" | "project"
): string => {
  if (type === "complaint") {
    const labels: Record<ComplaintCategoryType, string> = {
      noise: "Noise",
      sanitation: "Sanitation",
      public_safety: "Public Safety",
      traffic: "Traffic",
      infrastructure: "Infrastructure",
      water_electricity: "Water/Electricity",
      domestic: "Domestic",
      environment: "Environment",
      others: "Others",
    };
    return labels[category as ComplaintCategoryType];
  }
  
  const labels: Record<ProjectCategoryType, string> = {
    infrastructure: "Infrastructure",
    health: "Health",
    education: "Education",
    environment: "Environment",
    livelihood: "Livelihood",
    disaster_preparedness: "Disaster Preparedness",
    social_services: "Social Services",
    sports_culture: "Sports & Culture",
    others: "Others",
  };
  return labels[category as ProjectCategoryType];
};

export default function CategoryFilterBadge({ type, category, onRemove }: CategoryFilterBadgeProps) {
  const color = getCategoryColor(category, type);
  
  return (
    <Badge
      className="flex items-center gap-1 pr-1"
      style={{
        backgroundColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.25)'),
        color: color,
        borderColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.4)'),
      }}
    >
      {getCategoryLabel(category, type)}
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-background/20 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${category} category filter`}
        type="button"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}
