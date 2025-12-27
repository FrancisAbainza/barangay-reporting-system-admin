"use client";

import { useComplaintDb } from "@/contexts/complaint-db-context";
import { ComplaintDetailsContent } from "./components/complaint-details-content";
import { use } from "react";

// In production, this would be a Server Component with:
// const complaint = await fetchComplaint(params.id);
export default function ComplaintDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { complaints } = useComplaintDb();
  const complaint = complaints.find(c => c.id === id);

  return <ComplaintDetailsContent complaint={complaint || null} />;
}
