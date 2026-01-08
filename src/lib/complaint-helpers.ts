import type { ComplaintStatusType, ComplaintCategoryType } from "@/types/complaint";

export function getStatusBadge(status: ComplaintStatusType) {
  const variants: Record<ComplaintStatusType, { className: string; label: string }> = {
    submitted: { className: "bg-primary/10 text-primary", label: "Submitted" },
    under_review: { className: "bg-secondary/10 text-secondary", label: "Under Review" },
    scheduled: { className: "bg-accent text-accent-foreground", label: "Scheduled" },
    in_progress: { className: "bg-chart-4/20 text-chart-4", label: "In Progress" },
    resolved: { className: "bg-chart-3/20 text-chart-3", label: "Resolved" },
    dismissed: { className: "bg-destructive/10 text-destructive", label: "Dismissed" },
  };
  return variants[status];
}

export function getPriorityBadge(priority: string) {
  const colors: Record<string, string> = {
    low: "bg-primary/10 text-primary",
    medium: "bg-chart-4/20 text-chart-4",
    high: "bg-chart-5/20 text-chart-5",
    urgent: "bg-destructive/10 text-destructive",
  };
  return colors[priority] || colors.medium;
}

export function getCategoryLabel(category: ComplaintCategoryType) {
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
  return labels[category];
}

export function getCategoryBadge(category: ComplaintCategoryType) {
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
  return colors[category];
}

export function getStatusColor(status: ComplaintStatusType) {
  const colors: Record<ComplaintStatusType, string> = {
    submitted: "hsl(217 91% 60%)",
    under_review: "hsl(199 89% 48%)",
    scheduled: "hsl(48 96% 53%)",
    in_progress: "hsl(25 95% 53%)",
    resolved: "hsl(142 76% 36%)",
    dismissed: "hsl(215 14% 34%)",
  }

  return colors[status];
}

export function getCategoryColor(category: ComplaintCategoryType) {
  const colors: Record<ComplaintCategoryType, string> = {
    noise: "hsl(221.2 83.2% 53.3%)",
    sanitation: "hsl(212 95% 68%)",
    public_safety: "hsl(24 95% 53%)",
    traffic: "hsl(142 71% 45%)",
    infrastructure: "hsl(280 85% 60%)",
    water_electricity: "hsl(173 58% 39%)",
    domestic: "hsl(43 96% 56%)",
    environment: "hsl(142 76% 36%)",
    others: "hsl(240 5% 65%)",
  }

  return colors[category];
}