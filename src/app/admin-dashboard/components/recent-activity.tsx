import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "@/lib/date-formatter";
import DataIcon from "@/components/data-icon";
import StatusBadge from "@/components/status-badge";
import { ProjectType } from "@/types/project";
import { ComplaintType } from "@/types/complaint";

export default function RecentActivity({projects, complaints}: {projects: ProjectType[], complaints: ComplaintType[]}) {
  // Combine and sort recent items
  const recentComplaints = complaints
    .slice()
    .sort((a, b) => {
      const dateA = a.createdAt;
      const dateB = b.createdAt;
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 8)
    .map((c) => ({
      type: "complaint" as const,
      id: c.id,
      title: c.title,
      status: c.status,
      category: c.category,
      date: c.createdAt,
    }));

  const recentProjects = projects
    .slice()
    .sort((a, b) => {
      const dateA = a.createdAt;
      const dateB = b.createdAt;
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 8)
    .map((p) => ({
      type: "project" as const,
      id: p.id,
      title: p.title,
      status: p.status,
      category: p.category,
      date: p.createdAt,
    }));

  const recentItems = [...recentComplaints, ...recentProjects]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

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
                <DataIcon type={item.type} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <StatusBadge type={item.type} status={item.status} />
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
