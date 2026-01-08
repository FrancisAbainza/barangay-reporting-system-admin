"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { getCategoryColor } from "@/lib/complaint-helpers";
import { ComplaintType } from "@/types/complaint";
import { Pie, PieChart } from "recharts";

export function ComplaintCategoryChart({complaints}: {complaints: ComplaintType[]}) {
  const categoryCounts = complaints.reduce((acc, complaint) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels: Record<string, string> = {
    noise: "Noise",
    sanitation: "Sanitation",
    public_safety: "Public Safety",
    traffic: "Traffic",
    infrastructure: "Infrastructure",
    water_electricity: "Water/Electricity",
    domestic: "Domestic",
    environment: "Environment",
    others: "Others",
  };

  const chartData = Object.entries(categoryCounts).map(([category, count]) => ({
    category: categoryLabels[category] || category,
    complaints: count,
    fill: `var(--color-${category})`,
  }));

  const chartConfig = {
    complaints: {
      label: "Complaints",
    },
    noise: {
      label: "Noise",
      color: getCategoryColor("noise"),
    },
    sanitation: {
      label: "Sanitation",
      color: getCategoryColor("sanitation"),
    },
    public_safety: {
      label: "Public Safety",
      color: getCategoryColor("public_safety"),
    },
    traffic: {
      label: "Traffic",
      color: getCategoryColor("traffic"),
    },
    infrastructure: {
      label: "Infrastructure",
      color: getCategoryColor("infrastructure"),
    },
    water_electricity: {
      label: "Water/Electricity",
      color: getCategoryColor("water_electricity"),
    },
    domestic: {
      label: "Domestic",
      color: getCategoryColor("domestic"),
    },
    environment: {
      label: "Environment",
      color: getCategoryColor("environment"),
    },
    others: {
      label: "Others",
      color: getCategoryColor("others"),
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaints by Category</CardTitle>
        <CardDescription>Distribution of complaint types</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="complaints"
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
                    {`${payload.category}: ${payload.complaints}`}
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
