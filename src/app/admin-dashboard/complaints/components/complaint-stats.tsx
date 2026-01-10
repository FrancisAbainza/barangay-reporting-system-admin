import { useMemo } from "react";
import type { ComplaintType } from "@/types/complaint";
import StatCard from "@/components/stat-card";
import { AlertCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface ComplaintStatsProps {
  complaints: ComplaintType[];
}

export default function ComplaintStats({ complaints }: ComplaintStatsProps) {
  const statValues = useMemo(() => {
    return {
      total: complaints.length,
      submitted: complaints.filter((c) => c.status === "submitted").length,
      underReview: complaints.filter((c) => c.status === "under_review").length,
      scheduled: complaints.filter((c) => c.status === "scheduled").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
    };
  }, [complaints]);

  const stats = [
    {
      title: "Total Complaints",
      value: statValues.total,
      icon: AlertCircle,
      description: "All time",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Pending Review",
      value: statValues.submitted + statValues.underReview,
      icon: Clock,
      description: "Awaiting action",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      title: "In Progress",
      value: statValues.scheduled + statValues.inProgress,
      icon: AlertTriangle,
      description: "Being resolved",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Resolved",
      value: statValues.resolved,
      icon: CheckCircle2,
      description: "Completed",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
}
