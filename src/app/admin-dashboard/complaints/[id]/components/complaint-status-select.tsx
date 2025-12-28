"use client";

import { useState, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Complaint, ComplaintStatus } from "@/types/complaint";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { ScheduledForm, type ScheduledFormValues } from "../../components/scheduled-form";
import { ResolutionForm, type ResolutionFormValues } from "../../components/resolution-form";
import { toast } from "sonner";

interface ComplaintStatusSelectProps {
  complaint: Complaint;
}

export function ComplaintStatusSelect({ complaint }: ComplaintStatusSelectProps) {
  const { updateComplaintStatus } = useComplaintDb();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const scheduleCloseRef = useRef<HTMLButtonElement>(null);
  const resolveCloseRef = useRef<HTMLButtonElement>(null);

  const handleStatusChange = (status: ComplaintStatus) => {
    if (status === "scheduled") {
      setIsScheduleDialogOpen(true);
    } else if (status === "resolved") {
      setIsResolveDialogOpen(true);
    } else {
      updateComplaintStatus(complaint.id, status);
    }
  };

  const handleScheduleSubmit = async (data: ScheduledFormValues) => {
    try {
      const scheduledAtDate = new Date(data.scheduledDate);
      updateComplaintStatus(complaint.id, "scheduled", scheduledAtDate);
      toast.success("Success!", {
        description: "Complaint scheduled",
      });
      scheduleCloseRef.current?.click();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  const handleResolveSubmit = async (data: ResolutionFormValues) => {
    try {
      const budget = data.budget ? parseFloat(data.budget) : undefined;
      
      const resolutionDetails = {
        description: data.description,
        budget,
      };

      updateComplaintStatus(complaint.id, "resolved", undefined, resolutionDetails);
      toast.success("Success!", {
        description: "Complaint marked as resolved",
      });
      resolveCloseRef.current?.click();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <Select value={complaint.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
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

      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Complaint</DialogTitle>
            <DialogDescription>
              Set the date when this complaint is scheduled to be addressed
            </DialogDescription>
          </DialogHeader>
          <ScheduledForm handleSubmit={handleScheduleSubmit} />
          <DialogClose ref={scheduleCloseRef} className="hidden" />
        </DialogContent>
      </Dialog>

      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mark as Resolved</DialogTitle>
            <DialogDescription>
              Provide details about how this complaint was resolved
            </DialogDescription>
          </DialogHeader>
          <ResolutionForm handleSubmit={handleResolveSubmit} />
          <DialogClose ref={resolveCloseRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  );
}
