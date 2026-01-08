"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { ProjectType } from "@/types/project";
import { Pie, PieChart } from "recharts";

export function ProjectCategoryChart({ projects }: { projects: ProjectType[] }) {
  const categoryCounts = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels: Record<string, string> = {
    infrastructure: "Infrastructure",
    health: "Health",
    education: "Education",
    environment: "Environment",
    livelihood: "Livelihood",
    disaster_preparedness: "Disaster Preparedness",
    social_services: "Social Services",
    sports_culture: "Sports & Culture",
    others: "Others",
  };

  const chartData = Object.entries(categoryCounts).map(([category, count]) => ({
    category: categoryLabels[category] || category,
    projects: count,
    fill: `var(--color-${category})`,
  }));

  const chartConfig = {
    projects: {
      label: "Projects",
    },
    infrastructure: {
      label: "Infrastructure",
      color: "hsl(221.2 83.2% 53.3%)",
    },
    health: {
      label: "Health",
      color: "hsl(0 84% 60%)",
    },
    education: {
      label: "Education",
      color: "hsl(262 83% 58%)",
    },
    environment: {
      label: "Environment",
      color: "hsl(142 71% 45%)",
    },
    livelihood: {
      label: "Livelihood",
      color: "hsl(43 96% 56%)",
    },
    disaster_preparedness: {
      label: "Disaster Preparedness",
      color: "hsl(24 95% 53%)",
    },
    social_services: {
      label: "Social Services",
      color: "hsl(280 85% 60%)",
    },
    sports_culture: {
      label: "Sports & Culture",
      color: "hsl(173 58% 39%)",
    },
    others: {
      label: "Others",
      color: "hsl(240 5% 65%)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects by Category</CardTitle>
        <CardDescription>Distribution of project types</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="projects"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                    fontSize={12}
                  >
                    {`${payload.category}: ${payload.projects}`}
                  </text>
                )
              }}
              nameKey="category"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
