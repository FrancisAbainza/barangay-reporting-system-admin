import StatCard from "@/components/stat-card";
import { AlertCircle, FolderKanban } from "lucide-react";

type StatsCardsProps = {
  totalComplaints: number;
  totalProjects: number;
};

export function StatsCards({ totalComplaints, totalProjects }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Complaints",
      value: totalComplaints,
      icon: AlertCircle,
      description: "All time complaints",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      description: "All projects in system",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  );
}
