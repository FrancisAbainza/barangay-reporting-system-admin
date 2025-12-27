"use client";

import { useState, useMemo } from "react";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComplaintStatus, ComplaintCategory, Complaint } from "@/types/complaint";
import { ComplaintFilters } from "./complaint-filters";
import { ComplaintTable } from "./complaint-table";
import { ResolutionDialog } from "./resolution-dialog";
import { ScheduledDialog } from "./scheduled-dialog";

interface ComplaintManagementCardProps {
  complaints: Complaint[];
}

// Client Component - Receives data as prop, uses context for CRUD operations
export function ComplaintManagementCard({ complaints }: ComplaintManagementCardProps) {
  // Only use context for mutation operations (simulating server actions)
  const { updateComplaintStatus, deleteComplaint, updateComplaint } = useComplaintDb();
  const [filters, setFilters] = useState({
    searchQuery: "",
    statusFilters: [] as ComplaintStatus[],
    categoryFilters: [] as ComplaintCategory[],
    priorityFilters: [] as string[],
    dateFrom: "",
    dateTo: "",
  });
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false);
  const [resolutionDescription, setResolutionDescription] = useState("");
  const [resolutionBudget, setResolutionBudget] = useState("");
  const [complaintIdForResolution, setComplaintIdForResolution] = useState<string | null>(null);
  const [isScheduledDialogOpen, setIsScheduledDialogOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [complaintIdForScheduled, setComplaintIdForScheduled] = useState<string | null>(null);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch =
        complaint.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        complaint.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        complaint.complainantName.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesStatus =
        filters.statusFilters.length === 0 || filters.statusFilters.includes(complaint.status);
      
      const matchesCategory =
        filters.categoryFilters.length === 0 || filters.categoryFilters.includes(complaint.category);
      
      const matchesPriority =
        filters.priorityFilters.length === 0 || filters.priorityFilters.includes(complaint.priority);

      const matchesDateFrom =
        !filters.dateFrom || new Date(complaint.createdAt) >= new Date(filters.dateFrom);
      
      const matchesDateTo =
        !filters.dateTo || new Date(complaint.createdAt) <= new Date(filters.dateTo + "T23:59:59");

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesDateFrom && matchesDateTo;
    });
  }, [complaints, filters]);

  const handleStatusChange = (complaintId: string, newStatus: ComplaintStatus) => {
    const complaint = complaints.find(c => c.id === complaintId);
    if (newStatus === "resolved" && complaint && !complaint.resolutionDetails) {
      // Open resolution dialog
      setComplaintIdForResolution(complaintId);
      setIsResolutionDialogOpen(true);
    } else if (newStatus === "scheduled" && complaint && !complaint.scheduledAt) {
      // Open scheduled dialog
      setComplaintIdForScheduled(complaintId);
      setIsScheduledDialogOpen(true);
    } else {
      // Remove resolutionDetails when changing away from resolved status
      if (complaint?.status === "resolved" && newStatus !== "resolved") {
        updateComplaint(complaintId, {
          resolutionDetails: undefined,
        });
      }
      
      // Remove scheduledAt when changing to under_review or submitted
      if (newStatus === "under_review" || newStatus === "submitted") {
        updateComplaint(complaintId, {
          scheduledAt: undefined,
        });
      }
      
      updateComplaintStatus(complaintId, newStatus);
    }
  };

  const handleResolveComplaint = () => {
    if (!complaintIdForResolution || !resolutionDescription.trim()) {
      alert("Please provide resolution details");
      return;
    }

    const budget = resolutionBudget ? parseFloat(resolutionBudget) : undefined;
    
    updateComplaint(complaintIdForResolution, {
      resolutionDetails: {
        description: resolutionDescription,
        budget,
      },
    });

    updateComplaintStatus(complaintIdForResolution, "resolved");
    
    // Reset form
    setResolutionDescription("");
    setResolutionBudget("");
    setComplaintIdForResolution(null);
    setIsResolutionDialogOpen(false);
  };

  const handleScheduleComplaint = () => {
    if (!complaintIdForScheduled || !scheduledDate) {
      alert("Please select a scheduled date");
      return;
    }

    updateComplaint(complaintIdForScheduled, {
      scheduledAt: new Date(scheduledDate),
    });

    updateComplaintStatus(complaintIdForScheduled, "scheduled");
    
    // Reset form
    setScheduledDate("");
    setComplaintIdForScheduled(null);
    setIsScheduledDialogOpen(false);
  };

  const handleDeleteComplaint = (complaintId: string) => {
    if (confirm("Are you sure you want to delete this complaint?")) {
      deleteComplaint(complaintId);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Complaints Overview</CardTitle>
          <CardDescription>View and manage all submitted complaints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ComplaintFilters onFilterChange={setFilters} />

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredComplaints.length} of {complaints.length} complaints
          </p>

          {/* Complaints Table */}
          <ComplaintTable
            complaints={filteredComplaints}
            handleStatusChange={handleStatusChange}
            handleDeleteComplaint={handleDeleteComplaint}
          />
        </CardContent>
      </Card>

      {/* Resolution Dialog */}
      <ResolutionDialog
        isOpen={isResolutionDialogOpen}
        onOpenChange={setIsResolutionDialogOpen}
        resolutionDescription={resolutionDescription}
        setResolutionDescription={setResolutionDescription}
        resolutionBudget={resolutionBudget}
        setResolutionBudget={setResolutionBudget}
        onSubmit={handleResolveComplaint}
      />

      {/* Scheduled Dialog */}
      <ScheduledDialog
        isOpen={isScheduledDialogOpen}
        onOpenChange={setIsScheduledDialogOpen}
        scheduledDate={scheduledDate}
        setScheduledDate={setScheduledDate}
        onSubmit={handleScheduleComplaint}
      />
    </>
  );
}
