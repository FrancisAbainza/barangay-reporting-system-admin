import { ComplaintCategoryType } from "@/types/complaint";
import { ProjectCategoryType } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import * as ComplaintHelpers from "@/lib/complaint-helpers";
import * as ProjectHelpers from "@/lib/project-helpers";

type StatusBadgeProps = {
  type: "complaint" | "project";
  category: ComplaintCategoryType | ProjectCategoryType;
};

export function getCategoryColor(
  category: ComplaintCategoryType | ProjectCategoryType,
  type: "complaint" | "project"
): string {
  if (type === "complaint") {
    return ComplaintHelpers.getCategoryColor(category as ComplaintCategoryType);
  }
  return ProjectHelpers.getCategoryColor(category as ProjectCategoryType);
}

export function getCategoryLabel(
  category: ComplaintCategoryType | ProjectCategoryType,
  type: "complaint" | "project"
): string {
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
}

export default function CategoryBadge({ type, category }: StatusBadgeProps) {
  const color = getCategoryColor(category, type);
  
  return (
    <Badge
      style={{
        backgroundColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.25)'),
        color: color,
        borderColor: color.replace('hsl(', 'hsl(').replace(')', ' / 0.4)'),
      }}
    >
      {getCategoryLabel(category, type)}
    </Badge>
  );
}