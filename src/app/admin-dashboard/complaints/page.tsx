"use client";

import { useState, useMemo } from "react";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComplaintStatus, ComplaintCategory } from "@/types/complaint";
import { ComplaintStats } from "./components/complaint-stats";
import { ComplaintFilters } from "./components/complaint-filters";
import { ComplaintTable } from "./components/complaint-table";
import { ResolutionDialog } from "./components/resolution-dialog";
import { ScheduledDialog } from "./components/scheduled-dialog";
import { getStatusBadge, getPriorityBadge, getCategoryLabel, getCategoryBadge } from "@/lib/complaint-helpers";
import { formatDate } from "@/lib/date-formatter";

export default function ComplaintsPage() {
  const { complaints, updateComplaintStatus, deleteComplaint, updateComplaint } = useComplaintDb();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<ComplaintStatus[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<ComplaintCategory[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false);
  const [resolutionDescription, setResolutionDescription] = useState("");
  const [resolutionBudget, setResolutionBudget] = useState("");
  const [complaintIdForResolution, setComplaintIdForResolution] = useState<string | null>(null);
  const [isScheduledDialogOpen, setIsScheduledDialogOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [complaintIdForScheduled, setComplaintIdForScheduled] = useState<string | null>(null);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      submitted: complaints.filter((c) => c.status === "submitted").length,
      underReview: complaints.filter((c) => c.status === "under_review").length,
      scheduled: complaints.filter((c) => c.status === "scheduled").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
      urgent: complaints.filter((c) => c.priority === "urgent").length,
    };
  }, [complaints]);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch =
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.complainantName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(complaint.status);
      
      const matchesCategory =
        categoryFilters.length === 0 || categoryFilters.includes(complaint.category);
      
      const matchesPriority =
        priorityFilters.length === 0 || priorityFilters.includes(complaint.priority);

      const matchesDateFrom =
        !dateFrom || new Date(complaint.createdAt) >= new Date(dateFrom);
      
      const matchesDateTo =
        !dateTo || new Date(complaint.createdAt) <= new Date(dateTo + "T23:59:59");

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesDateFrom && matchesDateTo;
    });
  }, [complaints, searchQuery, statusFilters, categoryFilters, priorityFilters, dateFrom, dateTo]);

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
      // If changing from resolved to another status, clear resolution details
      if (complaint?.status === "resolved" && newStatus !== "resolved") {
        updateComplaint(complaintId, {
          resolutionDetails: undefined,
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
    <div className="container p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Complaint Management</h1>
        <p className="text-muted-foreground">
          Manage and track community complaints
        </p>
      </div>

      {/* Statistics Cards */}
      <ComplaintStats stats={stats} />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Complaints Overview</CardTitle>
          <CardDescription>View and manage all submitted complaints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ComplaintFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilters={statusFilters}
            setStatusFilters={setStatusFilters}
            categoryFilters={categoryFilters}
            setCategoryFilters={setCategoryFilters}
            priorityFilters={priorityFilters}
            setPriorityFilters={setPriorityFilters}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            getStatusBadge={getStatusBadge}
            getCategoryLabel={getCategoryLabel}
          />

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredComplaints.length} of {complaints.length} complaints
          </p>

          {/* Complaints Table */}
          <ComplaintTable
            complaints={filteredComplaints}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            getCategoryLabel={getCategoryLabel}
            getCategoryBadge={getCategoryBadge}
            formatDate={formatDate}
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
    </div>
  );
}
