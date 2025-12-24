import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Eye, MoreVertical, ThumbsUp, MessageSquare, Trash2 } from "lucide-react";
import type { Complaint, ComplaintStatus, ComplaintCategory } from "@/contexts/complaint-db-context";

interface ComplaintTableProps {
  complaints: Complaint[];
  getStatusBadge: (status: ComplaintStatus) => { className: string; label: string };
  getPriorityBadge: (priority: string) => string;
  getCategoryLabel: (category: ComplaintCategory) => string;
  getCategoryBadge: (category: ComplaintCategory) => string;
  formatDate: (date: Date) => string;
  viewComplaintDetails: (complaint: Complaint) => void;
  handleStatusChange: (complaintId: string, newStatus: ComplaintStatus) => void;
  handleDeleteComplaint: (complaintId: string) => void;
}

export function ComplaintTable({
  complaints,
  getStatusBadge,
  getPriorityBadge,
  getCategoryLabel,
  getCategoryBadge,
  formatDate,
  viewComplaintDetails,
  handleStatusChange,
  handleDeleteComplaint,
}: ComplaintTableProps) {
  return (
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
          {complaints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No complaints found
              </TableCell>
            </TableRow>
          ) : (
            complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell className="font-medium">
                  <div className="truncate max-w-62.5">{complaint.title}</div>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryBadge(complaint.category)}>
                    {getCategoryLabel(complaint.category)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(complaint.status).className}>
                    {getStatusBadge(complaint.status).label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityBadge(complaint.priority)}>
                    {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                  </Badge>
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
                      <MessageSquare className="h-3 w-3" />
                      {complaint.comments?.length || 0}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => viewComplaintDetails(complaint)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(complaint.id, "under_review")}
                      >
                        Under Review
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(complaint.id, "scheduled")}
                      >
                        Scheduled
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(complaint.id, "in_progress")}
                      >
                        In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(complaint.id, "resolved")}
                      >
                        Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(complaint.id, "dismissed")}
                      >
                        Dismissed
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteComplaint(complaint.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
