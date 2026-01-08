import type { ProjectStatusType, ProjectCategoryType } from "@/types/project";

export function getStatusBadge(status: ProjectStatusType) {
  const variants: Record<ProjectStatusType, { className: string; label: string }> = {
    planned: { className: "bg-muted text-muted-foreground", label: "Planned" },
    approved: { className: "bg-primary/10 text-primary", label: "Approved" },
    ongoing: { className: "bg-chart-4/20 text-chart-4", label: "Ongoing" },
    on_hold: { className: "bg-chart-5/20 text-chart-5", label: "On Hold" },
    completed: { className: "bg-chart-3/20 text-chart-3", label: "Completed" },
    cancelled: { className: "bg-destructive/10 text-destructive", label: "Cancelled" },
  };
  return variants[status];
}

export function getCategoryLabel(category: ProjectCategoryType) {
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
  return labels[category];
}

export function getCategoryBadge(category: ProjectCategoryType) {
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
  return colors[category];
}

export function formatBudget(amount?: number): string {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

export function getStatusColor(status: ProjectStatusType) {
  const colors: Record<ProjectStatusType, string> = {
    planned: "hsl(217 91% 60%)",
    approved: "hsl(199 89% 48%)",
    ongoing: "hsl(25 95% 53%)",
    on_hold: "hsl(48 96% 53%)",
    completed: "hsl(142 76% 36%)",
    cancelled: "hsl(215 14% 34%)",
  }

  return colors[status];
}

export function getCategoryColor(category: ProjectCategoryType) {
  const colors: Record<ProjectCategoryType, string> = {
    infrastructure: "hsl(221.2 83.2% 53.3%)",
    health: "hsl(0 84% 60%)",
    education: "hsl(262 83% 58%)",
    environment: "hsl(142 71% 45%)",
    livelihood: "hsl(43 96% 56%)",
    disaster_preparedness: "hsl(24 95% 53%)",
    social_services: "hsl(280 85% 60%)",
    sports_culture: "hsl(173 58% 39%)",
    others: "hsl(240 5% 65%)",
  }

  return colors[category];
}