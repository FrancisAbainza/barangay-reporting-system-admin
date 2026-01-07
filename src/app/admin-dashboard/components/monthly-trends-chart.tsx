"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

export function MonthlyTrendsChart() {
  const { complaints } = useComplaintDb();

  // Get last 6 months
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: date.toLocaleDateString("en-US", { month: "long" }),
      monthNum: date.getMonth(),
      year: date.getFullYear(),
    });
  }

  const chartData = months.map(({ month, monthNum, year }) => {
    const monthComplaints = complaints.filter((c) => {
      const date = c.createdAt;
      return date.getMonth() === monthNum && date.getFullYear() === year;
    }).length;

    return {
      month,
      complaints: monthComplaints,
    };
  });

  const chartConfig = {
    complaints: {
      label: "Complaints",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Complaint Trends</CardTitle>
        <CardDescription>Number of complaints over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="complaints"
              type="natural"
              stroke="var(--color-complaints)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-complaints)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
