"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Brain,
  MessageSquareWarning,
  Eye,
  Map,
  MessageCircle,
  TrendingUp,
  FileText,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Overview",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  /* {
    title: "AI Insights / Analysis",
    href: "/admin-dashboard/ai-insights",
    icon: Brain,
  }, */
  {
    title: "Complaint Management",
    href: "/admin-dashboard/complaints",
    icon: MessageSquareWarning,
  },
  {
    title: "Transparency Management",
    href: "/admin-dashboard/transparency",
    icon: Eye,
  },
  {
    title: "Map Intelligence",
    href: "/admin-dashboard/map-intelligence",
    icon: Map,
  },
  /* {
    title: "Engagement & Sentiment",
    href: "/admin-dashboard/engagement",
    icon: MessageCircle,
  },
  {
    title: "Barangay Performance",
    href: "/admin-dashboard/performance",
    icon: TrendingUp,
  },
  {
    title: "Reports & Exports",
    href: "/admin-dashboard/reports",
    icon: FileText,
  }, */
  {
    title: "User Management",
    href: "/admin-dashboard/users",
    icon: Users,
  },
 /*  {
    title: "Settings & Rules",
    href: "/admin-dashboard/settings",
    icon: Settings,
  }, */
];

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className={className}>
      {/* Header */}
      <SidebarHeader className="flex flex-row items-center justify-between border-b border-sidebar-border py-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <ShieldCheck className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">BRTS Admin</span>
          </div>
        )}
        <SidebarTrigger />
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarMenu className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin-dashboard" &&
                pathname.startsWith(item.href + "/"));

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={collapsed ? item.title : undefined}
                  className="gap-3"
                >
                  <Link href={item.href}>
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* User Section */}
      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="mb-3 rounded-lg bg-sidebar-primary/10 p-3">
            <p className="text-sm font-medium text-sidebar-foreground">
              {user.name}
            </p>
            <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut />
          {!collapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
