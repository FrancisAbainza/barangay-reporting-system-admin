"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { ScheduledDialog, type ScheduledFormValues } from "./scheduled-dialog";
import type { Complaint } from "@/types/complaint";

interface ScheduleComplaintMenuItemProps {
  complaint: Complaint;
  onOpenChange?: (open: boolean) => void;
}

export function ScheduleComplaintMenuItem({ complaint, onOpenChange }: ScheduleComplaintMenuItemProps) {
  const { updateComplaintStatus } = useComplaintDb();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleSubmit = (data: ScheduledFormValues) => {
    const scheduledAtDate = new Date(data.scheduledDate);
    updateComplaintStatus(complaint.id, "scheduled", scheduledAtDate);
    setIsOpen(false);
  };

  const handleSelect = (e: Event) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      <DropdownMenuItem onSelect={handleSelect}>
        Schedule
      </DropdownMenuItem>

      <ScheduledDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        complaint={complaint}
      />
    </>
  );
}
