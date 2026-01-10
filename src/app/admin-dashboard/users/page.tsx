"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateAdminForm from "./components/create-admin-form";
import AdminTable from "./components/admin-table";
import UsersTable from "./components/users-table";
import UserStats from "./components/user-stats";
import { useAdminDb } from "@/contexts/admin-db-context";
import { useUserDb } from "@/contexts/user-db-context";
import { Users } from "lucide-react";
import PageHeader from "@/components/page-header";

export default function UsersPage() {
  const { admins, deleteAdmin } = useAdminDb();
  const { users, banUser, unbanUser } = useUserDb();

  const handleDeleteAdmin = async (adminId: string) => {
    // TODO: Implement actual API call
    console.log("Deleting admin:", adminId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    deleteAdmin(adminId);
  };

  const handleBanUser = async (userId: string, reason?: string) => {
    // TODO: Implement actual API call
    console.log("Banning user:", userId, "Reason:", reason);
    await new Promise((resolve) => setTimeout(resolve, 500));
    banUser(userId);
  };

  const handleUnbanUser = async (userId: string) => {
    // TODO: Implement actual API call
    console.log("Unbanning user:", userId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    unbanUser(userId);
  };

  const stats = {
    totalUsers: users.length,
    totalAdmins: admins.length,
  };

  return (
    <div className="container p-6 space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage users, roles, and permissions"
        icon={<Users className="h-6 w-6 text-primary" />}
      />

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
