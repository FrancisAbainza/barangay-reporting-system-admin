import type { ComplaintStatus, ComplaintCategory } from "@/types/complaint";

export function getStatusBadge(status: ComplaintStatus) {
  const variants: Record<ComplaintStatus, { className: string; label: string }> = {
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

export function getCategoryLabel(category: ComplaintCategory) {
  const labels: Record<ComplaintCategory, string> = {
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

export function getCategoryBadge(category: ComplaintCategory) {
  const colors: Record<ComplaintCategory, string> = {
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
