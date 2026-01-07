import { StatsCards } from "./components/stats-cards";
import { ComplaintStatusChart } from "./components/complaint-status-chart";
import { ComplaintCategoryChart } from "./components/complaint-category-chart";
import { ProjectStatusChart } from "./components/project-status-chart";
import { MonthlyTrendsChart } from "./components/monthly-trends-chart";
import { ProjectCategoryChart } from "./components/project-category-chart";
import { RecentActivity } from "./components/recent-activity";
import { LayoutDashboard } from "lucide-react";
import PageIconContainer from "@/components/page-icon-container";

export default function DashboardPage() {
  return (
    <div className="container p-6 space-y-6">
      <div className="flex items-center gap-3">
        <PageIconContainer>
          <LayoutDashboard className="h-6 w-6 text-primary" />
        </PageIconContainer>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Welcome to the BRTS Admin Dashboard
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Monthly Trends */}
      <MonthlyTrendsChart />

      {/* Complaint Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ComplaintStatusChart />
        <ComplaintCategoryChart />
      </div>

      {/* Project Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ProjectStatusChart />
        <ProjectCategoryChart />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
