import { useMemo } from "react";
import type { ProjectType } from "@/types/project";
import StatCard from "@/components/stat-card";
import { BarChart3, CheckCircle2, Clock, FolderKanban } from "lucide-react";

interface ProjectStatsProps {
  projects: ProjectType[];
}

export default function ProjectStats({ projects }: ProjectStatsProps) {
  const statValues = useMemo(() => {
    return {
      total: projects.length,
      planned: projects.filter((p) => p.status === "planned").length,
      approved: projects.filter((p) => p.status === "approved").length,
      ongoing: projects.filter((p) => p.status === "ongoing").length,
      onHold: projects.filter((p) => p.status === "on_hold").length,
      completed: projects.filter((p) => p.status === "completed").length,
      cancelled: projects.filter((p) => p.status === "cancelled").length,
    };
  }, [projects]);

  const stats = [
    {
      title: "Total Projects",
      value: statValues.total,
      icon: FolderKanban,
      description: "All projects in system",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Planned",
      value: statValues.planned,
      icon: BarChart3,
      description: "Awaiting approval",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      title: "Confirmed",
      value: statValues.approved + statValues.ongoing + statValues.onHold,
      icon: Clock,
      description: "Approved projects",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Completed",
      value: statValues.completed,
      icon: CheckCircle2,
      description: "Successfully finished",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
}
