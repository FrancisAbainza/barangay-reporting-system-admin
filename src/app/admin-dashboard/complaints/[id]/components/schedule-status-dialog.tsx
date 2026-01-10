"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import ScheduleForm from "@/components/schedule-form";
import { type ScheduledFormValues } from "@/schemas/complaint.schema";
import type { ComplaintType } from "@/types/complaint";
import { toast } from "sonner";

interface ScheduleStatusDialogProps {
  complaint: ComplaintType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScheduleStatusDialog({ 
  complaint, 
  open, 
  onOpenChange 
}: ScheduleStatusDialogProps) {
  const { updateComplaintStatus } = useComplaintDb();
  const closeRef = useRef<HTMLButtonElement>(null);

  async function handleSubmit(data: ScheduledFormValues) {
    try {
      const scheduledAtDate = new Date(data.scheduledDate);
      updateComplaintStatus(complaint.id, "scheduled", scheduledAtDate);
      toast.success("Success!", {
        description: "Complaint scheduled",
      });
      closeRef.current?.click();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Complaint</DialogTitle>
          <DialogDescription>
            Set the date when this complaint is scheduled to be addressed
          </DialogDescription>
        </DialogHeader>
        <ScheduleForm handleSubmit={handleSubmit} />
        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
