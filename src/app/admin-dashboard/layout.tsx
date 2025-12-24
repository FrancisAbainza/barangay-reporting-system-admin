import { ProtectedRoute } from "@/components/protected-route";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
