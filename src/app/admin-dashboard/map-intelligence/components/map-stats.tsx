"use client";

import { useMemo } from "react";
import StatCard from "@/components/stat-card";
import { AlertCircle, CheckCircle2, Clock, AlertTriangle, FolderKanban, BarChart3 } from "lucide-react";
import type { ComplaintType } from "@/types/complaint";
import type { ProjectType } from "@/types/project";

interface MapStatsProps {
  complaints?: ComplaintType[];
  projects?: ProjectType[];
  type: "complaints" | "transparency";
}

export default function MapStats({ complaints, projects, type }: MapStatsProps) {
  const complaintStats = useMemo(() => {
    if (!complaints) return null;

    return [
      {
        title: "Total Complaints",
        value: complaints.length,
        icon: AlertCircle,
        description: "All time",
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950",
      },
      {
        title: "Pending Review",
        value: complaints.filter((c) => c.status === "submitted" || c.status === "under_review").length,
        icon: Clock,
        description: "Awaiting action",
        color: "text-yellow-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-950",
      },
      {
        title: "In Progress",
        value: complaints.filter((c) => c.status === "scheduled" || c.status === "in_progress").length,
        icon: AlertTriangle,
        description: "Being resolved",
        color: "text-orange-500",
        bgColor: "bg-orange-50 dark:bg-orange-950",
      },
      {
        title: "Resolved",
        value: complaints.filter((c) => c.status === "resolved").length,
        icon: CheckCircle2,
        description: "Completed",
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-950",
      },
    ];
  }, [complaints]);

  const projectStats = useMemo(() => {
    if (!projects) return null;

    const stats = {
      planned: projects.filter((p) => p.status === "planned").length,
      approved: projects.filter((p) => p.status === "approved").length,
      ongoing: projects.filter((p) => p.status === "ongoing").length,
      onHold: projects.filter((p) => p.status === "on_hold").length,
      completed: projects.filter((p) => p.status === "completed").length,
    };

    return [
      {
        title: "Total Projects",
        value: projects.length,
        icon: FolderKanban,
        description: "All projects in system",
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950",
      },
      {
        title: "Planned",
        value: stats.planned,
        icon: BarChart3,
        description: "Awaiting approval",
        color: "text-yellow-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-950",
      },
      {
        title: "Confirmed",
        value: stats.approved + stats.ongoing + stats.onHold,
        icon: Clock,
        description: "Approved projects",
        color: "text-orange-500",
        bgColor: "bg-orange-50 dark:bg-orange-950",
      },
      {
        title: "Completed",
        value: stats.completed,
        icon: CheckCircle2,
        description: "Successfully finished",
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-950",
      },
    ];
  }, [projects]);

  const stats = type === "complaints" ? complaintStats : projectStats;

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  );
}

