import { ProtectedRoute } from "@/components/protected-route";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen>
        <div className="flex h-screen overflow-hidden w-full">
          {/* Desktop Sidebar - hidden on mobile */}
          <DashboardSidebar className="hidden md:flex" />

          <SidebarInset className="flex flex-1 flex-col overflow-hidden">
            {/* Mobile Header - visible only on mobile */}
            <MobileHeader className="md:hidden" />

            {/* Main Content */}
            <main className="flex flex-1 justify-center overflow-y-auto bg-background">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
