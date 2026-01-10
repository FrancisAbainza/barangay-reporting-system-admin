"use client";

import { useComplaintDb } from "@/contexts/complaint-db-context";
import ComplaintStats from "./components/complaint-stats";
import ComplaintManagementCard from "./components/complaint-management-card";
import { MessageSquareWarning } from "lucide-react";
import PageHeader from "@/components/page-header";

// In production, this would be a Server Component with:
// const complaints = await fetchComplaints();
export default function ComplaintsPage() {
  const { complaints } = useComplaintDb();

  return (
    <div className="container p-6 space-y-6">
      <PageHeader
        title="Complaint Management"
        subtitle="Manage and track community complaints"
        icon={<MessageSquareWarning className="h-6 w-6 text-primary" />}
      />

      <ComplaintStats complaints={complaints} />
      <ComplaintManagementCard complaints={complaints} />
    </div>
  );
}
