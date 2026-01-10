import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { getStatusColor } from "@/lib/project-helpers";
import { ProjectType } from "@/types/project";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function ProjectStatusChart({projects}: {projects: ProjectType[]}) {
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
      color: getStatusColor("planned"),
    },
    approved: {
      label: "Approved",
      color: getStatusColor("approved"),
    },
    ongoing: {
      label: "Ongoing",
      color: getStatusColor("ongoing"),
    },
    onHold: {
      label: "On Hold",
      color: getStatusColor("on_hold"),
    },
    completed: {
      label: "Completed",
      color: getStatusColor("completed"),
    },
    cancelled: {
      label: "Cancelled",
      color: getStatusColor("cancelled"),
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status Overview</CardTitle>
        <CardDescription>Current status of all projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
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
