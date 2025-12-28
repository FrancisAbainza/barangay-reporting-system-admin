"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateAdminForm } from "./components/create-admin-form";
import { AdminTable } from "./components/admin-table";
import { UsersTable } from "./components/users-table";
import { UserStats } from "./components/user-stats";
import type { User } from "@/types/user";

// Mock data - replace with actual API calls
const mockAdmins: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-15"),
    lastLoginAt: new Date("2024-12-28"),
  },
  {
    id: "2",
    name: "John Admin",
    email: "john@example.com",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-03-20"),
    lastLoginAt: new Date("2024-12-27"),
  },
];

const mockUsers: User[] = [
  {
    id: "3",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "user",
    status: "active",
    createdAt: new Date("2024-06-10"),
    lastLoginAt: new Date("2024-12-29"),
    complaintsCount: 5,
    projectsCount: 2,
  },
  {
    id: "4",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "user",
    status: "active",
    createdAt: new Date("2024-07-15"),
    lastLoginAt: new Date("2024-12-28"),
    complaintsCount: 3,
    projectsCount: 1,
  },
  {
    id: "5",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "user",
    status: "banned",
    createdAt: new Date("2024-08-20"),
    lastLoginAt: new Date("2024-12-15"),
    complaintsCount: 10,
    projectsCount: 0,
  },
];

export default function UsersPage() {
  const [admins, setAdmins] = useState<User[]>(mockAdmins);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleDeleteAdmin = async (adminId: string) => {
    // TODO: Implement actual API call
    console.log("Deleting admin:", adminId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAdmins(admins.filter((admin) => admin.id !== adminId));
  };

  const handleBanUser = async (userId: string, reason?: string) => {
    // TODO: Implement actual API call
    console.log("Banning user:", userId, "Reason:", reason);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "banned" as const } : user
      )
    );
  };

  const handleUnbanUser = async (userId: string) => {
    // TODO: Implement actual API call
    console.log("Unbanning user:", userId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "active" as const } : user
      )
    );
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    totalAdmins: admins.length,
    bannedUsers: users.filter((u) => u.status === "banned").length,
  };

  return (
    <div className="container space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and permissions
        </p>
      </div>

      <UserStats {...stats} />

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Regular Users</TabsTrigger>
          <TabsTrigger value="admins">Administrators</TabsTrigger>
          <TabsTrigger value="create">Create Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UsersTable
            users={users}
            onBanUser={handleBanUser}
            onUnbanUser={handleUnbanUser}
          />
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <AdminTable admins={admins} onDeleteAdmin={handleDeleteAdmin} />
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <div className="mx-auto max-w-2xl">
            <CreateAdminForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
