"use client";

import { useMemo } from "react";
import type { ComplaintType } from "@/types/complaint";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface ComplaintStatsProps {
  complaints: ComplaintType[];
}

export function ComplaintStats({ complaints }: ComplaintStatsProps) {
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      submitted: complaints.filter((c) => c.status === "submitted").length,
      underReview: complaints.filter((c) => c.status === "under_review").length,
      scheduled: complaints.filter((c) => c.status === "scheduled").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
      urgent: complaints.filter((c) => c.priority === "urgent").length,
    };
  }, [complaints]);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.submitted + stats.underReview}</div>
          <p className="text-xs text-muted-foreground">Awaiting action</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.scheduled + stats.inProgress}</div>
          <p className="text-xs text-muted-foreground">Being resolved</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.resolved}</div>
          <p className="text-xs text-muted-foreground">Completed</p>
        </CardContent>
      </Card>
    </div>
  );
}
