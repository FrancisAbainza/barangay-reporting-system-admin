import type { ProjectStatus, ProjectCategory } from "@/types/project";

export function getStatusBadge(status: ProjectStatus) {
  const variants: Record<ProjectStatus, { className: string; label: string }> = {
    planned: { className: "bg-muted text-muted-foreground", label: "Planned" },
    approved: { className: "bg-primary/10 text-primary", label: "Approved" },
    ongoing: { className: "bg-chart-4/20 text-chart-4", label: "Ongoing" },
    on_hold: { className: "bg-chart-5/20 text-chart-5", label: "On Hold" },
    completed: { className: "bg-chart-3/20 text-chart-3", label: "Completed" },
    cancelled: { className: "bg-destructive/10 text-destructive", label: "Cancelled" },
  };
  return variants[status];
}

export function getCategoryLabel(category: ProjectCategory) {
  const labels: Record<ProjectCategory, string> = {
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

export function getCategoryBadge(category: ProjectCategory) {
  const colors: Record<ProjectCategory, string> = {
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
