"use client";

import { useRef } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import ScheduleForm from "./schedule-form";
import { type ScheduledFormValues } from "@/schemas/complaint.schema";
import type { ComplaintType } from "@/types/complaint";
import { toast } from "sonner";

interface ScheduleComplaintMenuItemProps {
  complaint: ComplaintType;
}

export default function ScheduleComplaintMenuItem({ complaint }: ScheduleComplaintMenuItemProps) {
  const { updateComplaintStatus } = useComplaintDb();
  const closeRef = useRef<HTMLButtonElement>(null);

  async function handleSubmit(data: ScheduledFormValues) {
    try {
      const scheduledAtDate = new Date(data.scheduledDate);
      updateComplaintStatus(complaint.id, "scheduled", scheduledAtDate);
    } catch (error: unknown) {
      toast.error((error as Error).message);
      return;
    }

    toast.success("Success!", {
      description: "Complaint scheduled",
    });
    closeRef.current?.click();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Schedule
        </DropdownMenuItem>
      </DialogTrigger>

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