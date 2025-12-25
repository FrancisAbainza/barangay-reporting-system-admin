"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Complaint, ComplaintStatus, ComplaintCategory } from "@/contexts/complaint-db-context";
import { ComplaintStats } from "./components/complaint-stats";
import { ComplaintFilters } from "./components/complaint-filters";
import { ComplaintTable } from "./components/complaint-table";
import { ResolutionDialog } from "./components/resolution-dialog";

export default function ComplaintsPage() {
  const router = useRouter();
  const { complaints, updateComplaintStatus, deleteComplaint, updateComplaint, addComplaintComment } = useComplaintDb();
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

  // Statistics
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      submitted: complaints.filter((c) => c.status === "submitted").length,
      underReview: complaints.filter((c) => c.status === "under_review").length,
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

  // Helper functions
  const getStatusBadge = (status: ComplaintStatus) => {
    const variants: Record<ComplaintStatus, { className: string, label: string }> = {
      submitted: { className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Submitted" },
      under_review: { className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", label: "Under Review" },
      scheduled: { className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200", label: "Scheduled" },
      in_progress: { className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", label: "In Progress" },
      resolved: { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Resolved" },
      dismissed: { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Dismissed" },
    };
    return variants[status];
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryLabel = (category: ComplaintCategory) => {
    const labels: Record<ComplaintCategory, string> = {
      noise: "Noise",
      sanitation: "Sanitation",
      public_safety: "Public Safety",
      traffic: "Traffic",
      infrastructure: "Infrastructure",
      water_electricity: "Water/Electricity",
      domestic: "Domestic",
      environment: "Environment",
      others: "Others",
    };
    return labels[category];
  };

  const getCategoryBadge = (category: ComplaintCategory) => {
    const colors: Record<ComplaintCategory, string> = {
      noise: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      sanitation: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      public_safety: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      traffic: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      infrastructure: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
      water_electricity: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      domestic: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      environment: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      others: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[category];
  };

  const handleStatusChange = (complaintId: string, newStatus: ComplaintStatus) => {
    const complaint = complaints.find(c => c.id === complaintId);
    if (newStatus === "resolved" && complaint && !complaint.resolutionDetails) {
      // Open resolution dialog
      setComplaintIdForResolution(complaintId);
      setIsResolutionDialogOpen(true);
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

  const handleDeleteComplaint = (complaintId: string) => {
    if (confirm("Are you sure you want to delete this complaint?")) {
      deleteComplaint(complaintId);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
    </div>
  );
}
