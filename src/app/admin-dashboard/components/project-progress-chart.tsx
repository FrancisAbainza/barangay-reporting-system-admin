"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useProjectDb } from "@/contexts/project-db-context";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function ProjectProgressChart() {
  const { projects } = useProjectDb();

  // Get ongoing projects and their progress
  const ongoingProjects = projects
    .filter((p) => p.status === "ongoing" || p.status === "approved")
    .sort((a, b) => b.progressPercentage - a.progressPercentage)
    .slice(0, 8); // Show top 8 projects

  const chartData = ongoingProjects.map((project) => ({
    name: project.title.length > 20 ? project.title.substring(0, 20) + "..." : project.title,
    progress: project.progressPercentage,
  }));

  const chartConfig = {
    progress: {
      label: "Progress %",
      color: "hsl(var(--chart-3))",
    },
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>Progress of ongoing projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No ongoing projects to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
        <CardDescription>Progress of ongoing projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis
              dataKey="name"
              type="category"
              width={150}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="progress" radius={[0, 8, 8, 0]} fill="var(--color-progress)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
