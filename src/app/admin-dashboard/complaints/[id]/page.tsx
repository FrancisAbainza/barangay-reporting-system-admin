"use client";

import { use } from "react";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import ComplaintHeader from "./components/complaint-header";
import ComplaintStatusCard from "./components/complaint-status-card";
import ComplaintTabs from "./components/complaint-tabs";

// In production, this would be a Server Component with:
// const complaint = await fetchComplaint(params.id);
export default function ComplaintDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { complaints } = useComplaintDb();
  const complaint = complaints.find(c => c.id === id);

  if (!complaint) {
    return (
      <div className="container p-6">
        <p className="text-muted-foreground mt-6">The requested complaint could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container p-6 space-y-6">
      <ComplaintHeader
        complaint={complaint}
      />

      <ComplaintStatusCard
        status={complaint.status}
        priority={complaint.priority}
        category={complaint.category}
      />

      <ComplaintTabs complaint={complaint} />
    </div>
  );
}
