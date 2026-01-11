import { ComplaintCategoryType } from "@/types/complaint";
import { ProjectCategoryType } from "@/types/project";
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  type: "complaint" | "project";
  category: ComplaintCategoryType | ProjectCategoryType;
};

export function getCategoryBadge(
  category: ComplaintCategoryType | ProjectCategoryType,
  type: "complaint" | "project"
): string {
  if (type === "complaint") {
    const colors: Record<ComplaintCategoryType, string> = {
      noise: "bg-secondary/10 text-secondary",
      sanitation: "bg-chart-3/20 text-chart-3",
      public_safety: "bg-destructive/10 text-destructive",
      traffic: "bg-chart-5/20 text-chart-5",
      infrastructure: "bg-muted text-muted-foreground",
      water_electricity: "bg-primary/10 text-primary",
      domestic: "bg-accent text-accent-foreground",
      environment: "bg-chart-3/20 text-chart-3",
      others: "bg-muted text-muted-foreground",
    };
    return colors[category as ComplaintCategoryType];
  }
  
  const colors: Record<ProjectCategoryType, string> = {
    infrastructure: "bg-muted text-muted-foreground",
    health: "bg-destructive/10 text-destructive",
    education: "bg-primary/10 text-primary",
    environment: "bg-chart-3/20 text-chart-3",
    livelihood: "bg-chart-3/20 text-chart-3",
    disaster_preparedness: "bg-chart-5/20 text-chart-5",
    social_services: "bg-accent text-accent-foreground",
    sports_culture: "bg-secondary/10 text-secondary",
    others: "bg-muted text-muted-foreground",
  };
  return colors[category as ProjectCategoryType];
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
  return (
    <Badge className={getCategoryBadge(category, type)}>
      {getCategoryLabel(category, type)}
    </Badge>
  );
}