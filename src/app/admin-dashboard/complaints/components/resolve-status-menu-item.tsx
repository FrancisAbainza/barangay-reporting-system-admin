"use client";

import { useRef } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import ResolutionForm from "@/components/forms/resolution-form";
import { type ResolutionFormValues } from "@/schemas/complaint.schema";
import type { ComplaintType } from "@/types/complaint";
import { toast } from "sonner";

interface ResolveComplaintMenuItemProps {
  complaint: ComplaintType;
}

export default function ResolveStatusMenuItem({ complaint }: ResolveComplaintMenuItemProps) {
  const { updateComplaintStatus } = useComplaintDb();
  const closeRef = useRef<HTMLButtonElement>(null);

  async function handleSubmit(data: ResolutionFormValues) {
    const budget = data.budget ? parseFloat(data.budget) : undefined;

    const image = data.image
      ? {uri: URL.createObjectURL(data.image)}
      : undefined;

    const resolutionDetails = {
      description: data.description,
      budget,
      image,
    };

    updateComplaintStatus(complaint.id, "resolved", undefined, resolutionDetails);

    toast.success("Success!", {
      description: "Complaint marked as resolved",
    });

    closeRef.current?.click();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Mark as Resolved
        </DropdownMenuItem>
      </DialogTrigger>

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
  );
}
