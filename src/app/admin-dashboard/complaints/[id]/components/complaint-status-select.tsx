"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplaintType, ComplaintStatusType } from "@/types/complaint";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import ScheduleStatusDialog from "./schedule-status-dialog";
import ResolveStatusDialog from "./resolve-status-dialog";

interface ComplaintStatusSelectProps {
  complaint: ComplaintType;
}

export default function ComplaintStatusSelect({ complaint }: ComplaintStatusSelectProps) {
  const { updateComplaintStatus } = useComplaintDb();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);

  const handleStatusChange = (status: ComplaintStatusType) => {
    // Trigger dialogs for statuses that require additional information
    if (status === "scheduled") {
      setIsScheduleDialogOpen(true);
      return;
    }
    
    if (status === "resolved") {
      setIsResolveDialogOpen(true);
      return;
    }
    
    // Directly update status for other cases
    updateComplaintStatus(complaint.id, status);
  };

  return (
    <>
      <Select value={complaint.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="submitted">Submitted</SelectItem>
          <SelectItem value="under_review">Under Review</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="dismissed">Dismissed</SelectItem>
        </SelectContent>
      </Select>

      <ScheduleStatusDialog
        complaint={complaint}
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      />

      <ResolveStatusDialog
        complaint={complaint}
        open={isResolveDialogOpen}
        onOpenChange={setIsResolveDialogOpen}
      />
    </>
  );
}