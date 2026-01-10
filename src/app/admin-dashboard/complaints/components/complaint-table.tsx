"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ThumbsUp, MessageSquare, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { ComplaintType } from "@/types/complaint";
import { formatDate } from "@/lib/date-formatter";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import ResolveComplaintMenuItem from "./resolve-complaint-menu-item";
import ScheduleComplaintMenuItem from "./schedule-complaint-menu-item";
import DeleteMenuItem from "@/components/delete-menu-item";
import CategoryBadge from "@/components/category-badge";
import StatusBadge from "@/components/status-badge";
import PriorityBadge from "@/components/priority-badge";

interface ComplaintTableProps {
  complaints: ComplaintType[];
}

export default function ComplaintTable({
  complaints,
}: ComplaintTableProps) {
  const router = useRouter();
  const { updateComplaintStatus, deleteComplaint } = useComplaintDb();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDeleteComplaint = (complaintId: string) => {
    deleteComplaint(complaintId);
    toast.success("Complaint deleted successfully");
  };

  // Sort by createdAt (newest first) and paginate
  const { paginatedComplaints, totalPages } = useMemo(() => {
    const sorted = [...complaints].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    const total = Math.ceil(sorted.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = sorted.slice(startIndex, startIndex + itemsPerPage);
    return { paginatedComplaints: paginated, totalPages: total };
  }, [complaints, currentPage]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-50">Title</TableHead>
              <TableHead className="min-w-32.5">Category</TableHead>
              <TableHead className="min-w-30">Status</TableHead>
              <TableHead className="min-w-25">Priority</TableHead>
              <TableHead className="min-w-35">Complainant</TableHead>
              <TableHead className="min-w-35">Date</TableHead>
              <TableHead className="min-w-30">Engagement</TableHead>
              <TableHead className="text-right min-w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No complaints found
                </TableCell>
              </TableRow>
            ) : (
              paginatedComplaints.map((complaint) => (
                <TableRow
                  key={complaint.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin-dashboard/complaints/${complaint.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="truncate max-w-62.5">{complaint.title}</div>
                  </TableCell>
                  <TableCell>
                    <CategoryBadge type="complaint" category={complaint.category} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge type="complaint" status={complaint.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={complaint.priority} />
                  </TableCell>
                  <TableCell>{complaint.complainantName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(complaint.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {complaint.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3" />
                        {complaint.dislikes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {complaint.comments?.length || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => updateComplaintStatus(complaint.id, "submitted")}
                        >
                          Submitted
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateComplaintStatus(complaint.id, "under_review")}
                        >
                          Under Review
                        </DropdownMenuItem>
                        <ScheduleComplaintMenuItem complaint={complaint} />
                        <DropdownMenuItem
                          onClick={() => updateComplaintStatus(complaint.id, "in_progress")}
                        >
                          In Progress
                        </DropdownMenuItem>
                        <ResolveComplaintMenuItem complaint={complaint} />
                        <DropdownMenuItem
                          onClick={() => updateComplaintStatus(complaint.id, "dismissed")}
                        >
                          Dismissed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteMenuItem
                          onDelete={() => handleDeleteComplaint(complaint.id)}
                          description="This action cannot be undone. This will permanently delete the complaint and remove it from the system."
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
