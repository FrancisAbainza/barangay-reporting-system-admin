"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function ComplaintStatusChart() {
  const { complaints } = useComplaintDb();

  const statusCounts = complaints.reduce((acc, complaint) => {
    acc[complaint.status] = (acc[complaint.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { status: "Submitted", count: statusCounts.submitted || 0, fill: "var(--color-submitted)" },
    { status: "Under Review", count: statusCounts.under_review || 0, fill: "var(--color-underReview)" },
    { status: "Scheduled", count: statusCounts.scheduled || 0, fill: "var(--color-scheduled)" },
    { status: "In Progress", count: statusCounts.in_progress || 0, fill: "var(--color-inProgress)" },
    { status: "Resolved", count: statusCounts.resolved || 0, fill: "var(--color-resolved)" },
    { status: "Dismissed", count: statusCounts.dismissed || 0, fill: "var(--color-dismissed)" },
  ];

  const chartConfig = {
    count: {
      label: "Complaints",
    },
    submitted: {
      label: "Submitted",
      color: "hsl(217 91% 60%)",
    },
    underReview: {
      label: "Under Review",
      color: "hsl(199 89% 48%)",
    },
    scheduled: {
      label: "Scheduled",
      color: "hsl(48 96% 53%)",
    },
    inProgress: {
      label: "In Progress",
      color: "hsl(25 95% 53%)",
    },
    resolved: {
      label: "Resolved",
      color: "hsl(142 76% 36%)",
    },
    dismissed: {
      label: "Dismissed",
      color: "hsl(215 14% 34%)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaint Status Distribution</CardTitle>
        <CardDescription>Breakdown of complaints by current status</CardDescription>
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
