"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { Pie, PieChart } from "recharts";

export function ComplaintCategoryChart() {
  const { complaints } = useComplaintDb();

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
      color: "hsl(221.2 83.2% 53.3%)",
    },
    sanitation: {
      label: "Sanitation",
      color: "hsl(212 95% 68%)",
    },
    public_safety: {
      label: "Public Safety",
      color: "hsl(24 95% 53%)",
    },
    traffic: {
      label: "Traffic",
      color: "hsl(142 71% 45%)",
    },
    infrastructure: {
      label: "Infrastructure",
      color: "hsl(280 85% 60%)",
    },
    water_electricity: {
      label: "Water/Electricity",
      color: "hsl(173 58% 39%)",
    },
    domestic: {
      label: "Domestic",
      color: "hsl(43 96% 56%)",
    },
    environment: {
      label: "Environment",
      color: "hsl(142 76% 36%)",
    },
    others: {
      label: "Others",
      color: "hsl(240 5% 65%)",
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
