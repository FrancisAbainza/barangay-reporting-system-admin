"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Shield, UserX } from "lucide-react";

interface UserStatsProps {
  totalUsers: number;
  activeUsers: number;
  totalAdmins: number;
  bannedUsers: number;
}

export function UserStats({
  totalUsers,
  activeUsers,
  totalAdmins,
  bannedUsers,
}: UserStatsProps) {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "All registered users",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      description: "Currently active",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Administrators",
      value: totalAdmins,
      icon: Shield,
      description: "Admin accounts",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Banned Users",
      value: bannedUsers,
      icon: UserX,
      description: "Restricted access",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
