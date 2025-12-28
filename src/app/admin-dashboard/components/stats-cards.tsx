"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { useProjectDb } from "@/contexts/project-db-context";
import { AlertCircle, FolderKanban } from "lucide-react";

export function StatsCards() {
  const { complaints } = useComplaintDb();
  const { projects } = useProjectDb();

  // Complaint stats (matching complaint-stats.tsx)
  const totalComplaints = complaints.length;

  // Project stats (matching project-stats.tsx)
  const totalProjects = projects.length;

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
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
