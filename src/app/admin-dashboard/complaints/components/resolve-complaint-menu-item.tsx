"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { ResolutionDialog, type ResolutionFormValues } from "./resolution-dialog";
import type { Complaint } from "@/types/complaint";

interface ResolveComplaintMenuItemProps {
  complaint: Complaint;
  onOpenChange?: (open: boolean) => void;
}

export function ResolveComplaintMenuItem({ complaint, onOpenChange }: ResolveComplaintMenuItemProps) {
  const { updateComplaintStatus } = useComplaintDb();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleSubmit = (data: ResolutionFormValues) => {
    const budget = data.budget ? parseFloat(data.budget) : undefined;
    
    const resolutionDetails = {
      description: data.description,
      budget,
    };

    updateComplaintStatus(complaint.id, "resolved", undefined, resolutionDetails);
    setIsOpen(false);
  };

  const handleSelect = (e: Event) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      <DropdownMenuItem onSelect={handleSelect}>
        Mark as Resolved
      </DropdownMenuItem>

      <ResolutionDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        complaint={complaint}
      />
    </>
  );
}
