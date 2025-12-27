import type { ProjectStatus, ProjectCategory } from "@/types/project";

export function getStatusBadge(status: ProjectStatus) {
  const variants: Record<ProjectStatus, { className: string; label: string }> = {
    planned: { className: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200", label: "Planned" },
    approved: { className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Approved" },
    ongoing: { className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", label: "Ongoing" },
    on_hold: { className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", label: "On Hold" },
    completed: { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Completed" },
    cancelled: { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Cancelled" },
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
    infrastructure: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
    health: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    education: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    environment: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    livelihood: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    disaster_preparedness: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    social_services: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    sports_culture: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    others: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
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
