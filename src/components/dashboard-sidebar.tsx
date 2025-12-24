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
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Overview",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Insights / Analysis",
    href: "/admin-dashboard/ai-insights",
    icon: Brain,
  },
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
  {
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
  },
  {
    title: "User Management",
    href: "/admin-dashboard/users",
    icon: Users,
  },
  {
    title: "Settings & Rules",
    href: "/admin-dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <ShieldCheck className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">BRTS Admin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-4">
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
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
