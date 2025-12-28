"use client";

import { useRef, useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { ResolutionForm, type ResolutionFormValues } from "../../transparency/components/resolution-form";
import type { Complaint } from "@/types/complaint";
import { toast } from "sonner";

interface ResolveComplaintMenuItemProps {
  complaint: Complaint;
  onOpenChange?: (open: boolean) => void;
}

export function ResolveComplaintMenuItem({ complaint, onOpenChange }: ResolveComplaintMenuItemProps) {
  const { updateComplaintStatus } = useComplaintDb();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  async function handleSubmit(data: ResolutionFormValues) {
    try {
      const budget = data.budget ? parseFloat(data.budget) : undefined;
      
      const resolutionDetails = {
        description: data.description,
        budget,
      };

      updateComplaintStatus(complaint.id, "resolved", undefined, resolutionDetails);
    } catch (error: unknown) {
      toast.error((error as Error).message);
      return;
    }

    toast.success("Success!", {
      description: "Complaint marked as resolved",
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
        Mark as Resolved
      </DropdownMenuItem>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mark as Resolved</DialogTitle>
            <DialogDescription>
              Provide details about how this complaint was resolved
            </DialogDescription>
          </DialogHeader>
          <ResolutionForm handleSubmit={handleSubmit} />
          <DialogClose ref={closeRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  );
}
