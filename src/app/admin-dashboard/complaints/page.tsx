"use client";

import { useComplaintDb } from "@/contexts/complaint-db-context";
import { ComplaintStats } from "./components/complaint-stats";
import { ComplaintManagementCard } from "./components/complaint-management-card";
import { MessageSquareWarning } from "lucide-react";

// In production, this would be a Server Component with:
// const complaints = await fetchComplaints();
export default function ComplaintsPage() {
  const { complaints } = useComplaintDb();

  return (
    <div className="container p-6 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MessageSquareWarning className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Complaint Management</h1>
            <p className="text-muted-foreground">
              Manage and track community complaints
            </p>
          </div>
        </div>
      </div>

      <ComplaintStats complaints={complaints} />
      <ComplaintManagementCard complaints={complaints} />
    </div>
  );
}
