"use client";

import { useRef, useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { ScheduledForm, type ScheduledFormValues } from "../../transparency/components/scheduled-form";
import type { Complaint } from "@/types/complaint";
import { toast } from "sonner";

interface ScheduleComplaintMenuItemProps {
  complaint: Complaint;
  onOpenChange?: (open: boolean) => void;
}

export function ScheduleComplaintMenuItem({ complaint, onOpenChange }: ScheduleComplaintMenuItemProps) {
  const { updateComplaintStatus } = useComplaintDb();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

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

  const handleSelect = (e: Event) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      <DropdownMenuItem onSelect={handleSelect}>
        Schedule
      </DropdownMenuItem>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Complaint</DialogTitle>
            <DialogDescription>
              Set the date when this complaint is scheduled to be addressed
            </DialogDescription>
          </DialogHeader>
          <ScheduledForm handleSubmit={handleSubmit} />
          <DialogClose ref={closeRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  );
}
