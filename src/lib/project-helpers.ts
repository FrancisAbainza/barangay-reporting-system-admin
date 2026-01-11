import type { ProjectStatusType, ProjectCategoryType } from "@/types/project";

export function getContrastTextColor(hslColor: string): string {
  // Extract lightness value from hsl string
  const match = hslColor.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!match) return "hsl(0 0% 10%)";
  
  const lightness = parseInt(match[3]);
  
  // Use white text for dark backgrounds (lightness < 55%), black for light
  return lightness < 55 ? "hsl(0 0% 98%)" : "hsl(0 0% 10%)";
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
    planned: "hsl(220 9% 46%)",      // gray500: #6B7280
    approved: "hsl(221 91% 60%)",    // info: #3B82F6
    ongoing: "hsl(220 100% 33%)",    // primary: #0038A8
    on_hold: "hsl(38 92% 50%)",      // warning: #F59E0B
    completed: "hsl(142 76% 36%)",   // success: #16A34A
    cancelled: "hsl(0 84% 51%)",     // error: #DC2626
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