"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { useProjectDb } from "@/contexts/project-db-context";
import { formatDistanceToNow } from "@/lib/date-formatter";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FolderKanban } from "lucide-react";

export function RecentActivity() {
  const { complaints } = useComplaintDb();
  const { projects } = useProjectDb();

  // Combine and sort recent items
  const recentComplaints = complaints
    .slice()
    .sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5)
    .map((c) => ({
      type: "complaint" as const,
      id: c.id,
      title: c.title,
      status: c.status,
      category: c.category,
      date: c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt),
    }));

  const recentProjects = projects
    .slice()
    .sort((a, b) => {
      const dateA = a.startDate instanceof Date ? a.startDate : new Date(a.startDate);
      const dateB = b.startDate instanceof Date ? b.startDate : new Date(b.startDate);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5)
    .map((p) => ({
      type: "project" as const,
      id: p.id,
      title: p.title,
      status: p.status,
      category: p.category,
      date: p.startDate instanceof Date ? p.startDate : new Date(p.startDate),
    }));

  const recentItems = [...recentComplaints, ...recentProjects]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  const getStatusColor = (status: string, type: string) => {
    if (type === "complaint") {
      switch (status) {
        case "resolved":
          return "bg-green-500/10 text-green-700 dark:text-green-400";
        case "in_progress":
        case "scheduled":
          return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
        case "dismissed":
          return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
        default:
          return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      }
    } else {
      switch (status) {
        case "completed":
          return "bg-green-500/10 text-green-700 dark:text-green-400";
        case "ongoing":
          return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
        case "cancelled":
        case "on_hold":
          return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
        default:
          return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      }
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest complaints and projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentItems.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              No recent activity
            </div>
          ) : (
            recentItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <div
                  className={`mt-1 rounded-full p-2 ${
                    item.type === "complaint" ? "bg-blue-50" : "bg-purple-50"
                  }`}
                >
                  {item.type === "complaint" ? (
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                  ) : (
                    <FolderKanban className="h-4 w-4 text-purple-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={getStatusColor(item.status, item.type)}
                    >
                      {formatStatus(item.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(item.date)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
