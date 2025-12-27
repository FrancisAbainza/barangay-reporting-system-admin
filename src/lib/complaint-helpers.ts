import type { ComplaintStatus, ComplaintCategory } from "@/types/complaint";

export function getStatusBadge(status: ComplaintStatus) {
  const variants: Record<ComplaintStatus, { className: string; label: string }> = {
    submitted: { className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Submitted" },
    under_review: { className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", label: "Under Review" },
    scheduled: { className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200", label: "Scheduled" },
    in_progress: { className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", label: "In Progress" },
    resolved: { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Resolved" },
    dismissed: { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Dismissed" },
  };
  return variants[status];
}

export function getPriorityBadge(priority: string) {
  const colors: Record<string, string> = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
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
    noise: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    sanitation: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    public_safety: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    traffic: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    infrastructure: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
    water_electricity: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    domestic: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    environment: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    others: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };
  return colors[category];
}
