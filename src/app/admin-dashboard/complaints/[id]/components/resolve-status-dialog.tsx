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
import ResolutionForm from "@/components/resolution-form";
import { type ResolutionFormValues } from "@/schemas/complaint.schema";
import type { ComplaintType } from "@/types/complaint";
import { toast } from "sonner";

interface ResolveStatusDialogProps {
  complaint: ComplaintType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ResolveStatusDialog({
  complaint,
  open,
  onOpenChange
}: ResolveStatusDialogProps) {
  const { updateComplaintStatus } = useComplaintDb();
  const closeRef = useRef<HTMLButtonElement>(null);

  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function handleSubmit(data: ResolutionFormValues) {
    try {
      const budget = data.budget ? parseFloat(data.budget) : undefined;

      // Convert File objects to data URLs
      let images;
      if (data.images && data.images.length > 0) {
        const imagePromises = data.images.map(async (img) => {
          if (img instanceof File) {
            const dataUrl = await convertFileToDataURL(img);
            return { uri: dataUrl };
          }
          return { uri: img };
        });
        images = await Promise.all(imagePromises);
      }

      const resolutionDetails = {
        description: data.description,
        budget,
        images,
      };

      updateComplaintStatus(complaint.id, "resolved", undefined, resolutionDetails);
      toast.success("Success!", {
        description: "Complaint marked as resolved",
      });
      closeRef.current?.click();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
