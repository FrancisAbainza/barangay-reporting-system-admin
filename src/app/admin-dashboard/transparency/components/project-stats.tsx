"use client";

import { useMemo } from "react";
import type { ProjectType } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, CheckCircle2, Clock, FolderKanban } from "lucide-react";

interface ProjectStatsProps {
  projects: ProjectType[];
}

export function ProjectStats({ projects }: ProjectStatsProps) {
  const stats = useMemo(() => {
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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All projects in system</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Planned</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.planned}</div>
          <p className="text-xs text-muted-foreground">Awaiting approval</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.approved + stats.ongoing + stats.onHold}</div>
          <p className="text-xs text-muted-foreground">Approved projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completed}</div>
          <p className="text-xs text-muted-foreground">Successfully finished</p>
        </CardContent>
      </Card>
    </div>
  );
}
