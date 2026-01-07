import { BarChart3, Megaphone, Search, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 text-primary-foreground">
        <div className="flex items-center gap-3">
          <Logo className="bg-primary-foreground/10" />
          <span className="text-xl font-semibold">BRTS Admin Dashboard</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Barangay Reporting and Transparency System Admin Dashboard
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Manage and monitor barangay reports and transparency with
            ease. Your centralized platform for efficient community-based governance.
          </p>

          <div className="grid gap-4 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg p-2 bg-primary-foreground/10">
                <Megaphone />
              </div>
              <div>
                <h3 className="font-semibold">Report Management</h3>
                <p className="text-sm text-primary-foreground/70">
                  Track and manage community reports efficiently
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg p-2 bg-primary-foreground/10">
                <Search />
              </div>
              <div>
                <h3 className="font-semibold">Government Transparency</h3>
                <p className="text-sm text-primary-foreground/70">
                  Enhance public transparency by providing comprehensive access to barangay project data.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg p-2 bg-primary-foreground/10">
                <BarChart3 />
              </div>
              <div>
                <h3 className="font-semibold">AI-Powered Analytics & Insights</h3>
                <p className="text-sm text-primary-foreground/70">
                  View comprehensive reports and statistics with AI-driven insights.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-primary-foreground/60">
          © 2025 BRTS. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Logo className="justify-self-center" />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
