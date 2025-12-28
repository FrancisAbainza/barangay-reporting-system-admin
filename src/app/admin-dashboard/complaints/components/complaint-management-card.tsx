"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComplaintStatus, ComplaintCategory, Complaint } from "@/types/complaint";
import { ComplaintFilters } from "./complaint-filters";
import { ComplaintTable } from "./complaint-table";

interface ComplaintManagementCardProps {
  complaints: Complaint[];
}

// Client Component - Receives data as prop, uses context for CRUD operations
export function ComplaintManagementCard({ complaints }: ComplaintManagementCardProps) {
  const [filters, setFilters] = useState({
    searchQuery: "",
    statusFilters: [] as ComplaintStatus[],
    categoryFilters: [] as ComplaintCategory[],
    priorityFilters: [] as string[],
    dateFrom: "",
    dateTo: "",
  });

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

  return (
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
        />
      </CardContent>
    </Card>
  );
}