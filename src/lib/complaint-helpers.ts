import type { ComplaintStatusType, ComplaintCategoryType, ComplaintPriorityType } from "@/types/complaint";

export function getStatusColor(status: ComplaintStatusType) {
  const colors: Record<ComplaintStatusType, string> = {
    submitted: "hsl(220 9% 46%)",    // gray500: #6B7280
    under_review: "hsl(221 91% 60%)", // info: #3B82F6
    scheduled: "hsl(38 92% 50%)",     // warning: #F59E0B
    in_progress: "hsl(220 100% 33%)", // primary: #0038A8
    resolved: "hsl(142 76% 36%)",     // success: #16A34A
    dismissed: "hsl(0 84% 51%)",      // error: #DC2626
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

export function getPriorityColor(priority: ComplaintPriorityType) {
  const colors: Record<ComplaintPriorityType, string> = {
    low: "hsl(217 91% 60%)",
    medium: "hsl(48 96% 53%)",
    high: "hsl(25 95% 53%)",
    urgent: "hsl(0 84% 60%)",
  }

  return colors[priority];
}