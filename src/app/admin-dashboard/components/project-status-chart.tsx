"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { useProjectDb } from "@/contexts/project-db-context";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function ProjectStatusChart() {
  const { projects } = useProjectDb();

  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { status: "Planned", count: statusCounts.planned || 0, fill: "var(--color-planned)" },
    { status: "Approved", count: statusCounts.approved || 0, fill: "var(--color-approved)" },
    { status: "Ongoing", count: statusCounts.ongoing || 0, fill: "var(--color-ongoing)" },
    { status: "On Hold", count: statusCounts.on_hold || 0, fill: "var(--color-onHold)" },
    { status: "Completed", count: statusCounts.completed || 0, fill: "var(--color-completed)" },
    { status: "Cancelled", count: statusCounts.cancelled || 0, fill: "var(--color-cancelled)" },
  ];

  const chartConfig = {
    count: {
      label: "Projects",
    },
    planned: {
      label: "Planned",
      color: "hsl(217 91% 60%)",
    },
    approved: {
      label: "Approved",
      color: "hsl(199 89% 48%)",
    },
    ongoing: {
      label: "Ongoing",
      color: "hsl(25 95% 53%)",
    },
    onHold: {
      label: "On Hold",
      color: "hsl(48 96% 53%)",
    },
    completed: {
      label: "Completed",
      color: "hsl(142 76% 36%)",
    },
    cancelled: {
      label: "Cancelled",
      color: "hsl(215 14% 34%)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status Overview</CardTitle>
        <CardDescription>Current status of all projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
