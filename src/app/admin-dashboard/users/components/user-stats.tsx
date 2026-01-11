"use client";

import { useMemo } from "react";
import StatCard from "@/components/stat-card";
import { Users, Shield } from "lucide-react";

interface UserStatsProps {
  totalUsers: number;
  totalAdmins: number;
}

export default function UserStats({
  totalUsers,
  totalAdmins,
}: UserStatsProps) {
  const statValues = useMemo(() => {
    return {
      total: totalUsers,
      admins: totalAdmins,
    };
  }, [totalUsers, totalAdmins]);

  const stats = [
    {
      title: "Total Users",
      value: statValues.total,
      icon: Users,
      description: "All registered users",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Administrators",
      value: statValues.admins,
      icon: Shield,
      description: "Admin accounts",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
}
