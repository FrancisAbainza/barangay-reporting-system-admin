"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Menu,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  { title: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
  /* { title: "AI Insights / Analysis", href: "/admin-dashboard/ai-insights", icon: Brain }, */
  { title: "Complaint Management", href: "/admin-dashboard/complaints", icon: MessageSquareWarning },
  { title: "Transparency Management", href: "/admin-dashboard/transparency", icon: Eye },
  { title: "Map Intelligence", href: "/admin-dashboard/map-intelligence", icon: Map },
  /* { title: "Engagement & Sentiment", href: "/admin-dashboard/engagement", icon: MessageCircle },
  { title: "Barangay Performance", href: "/admin-dashboard/performance", icon: TrendingUp },
  { title: "Reports & Exports", href: "/admin-dashboard/reports", icon: FileText }, */
  { title: "User Management", href: "/admin-dashboard/users", icon: Users },
  /* { title: "Settings & Rules", href: "/admin-dashboard/settings", icon: Settings }, */
];

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
      <ShieldCheck className="h-4 w-4 text-sidebar-primary-foreground" />
    </div>
    <span className="text-sm font-semibold text-sidebar-foreground">BRTS Admin</span>
  </div>
);

export default function MobileHeader({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <header className={cn("flex items-center justify-between bg-sidebar p-4", className)}>
      <Logo />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-sidebar-foreground">
            <Menu />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="gap-0 w-full border-r-0 bg-sidebar text-sidebar-foreground">
          <SheetHeader className="border-b border-sidebar-border py-4">
            <SheetTitle className="text-sidebar-foreground">
              <Logo />
            </SheetTitle>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-sidebar-border py-4 px-2">
            {user && (
              <div className="mb-3 rounded-lg bg-sidebar-primary/10 p-3">
                <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut />
              <span>Logout</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
