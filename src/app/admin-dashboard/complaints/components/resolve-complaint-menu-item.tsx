"use client";

import { useRef, useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { ResolutionForm } from "./resolution-form";
import { type ResolutionFormValues } from "@/schemas/complaint.schema";
import type { ComplaintType } from "@/types/complaint";
import { toast } from "sonner";

interface ResolveComplaintMenuItemProps {
  complaint: ComplaintType;
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
          return typeof img === 'string' ? { uri: img } : img;
        });
        images = await Promise.all(imagePromises);
      }
      
      const resolutionDetails = {
        description: data.description,
        budget,
        images,
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
