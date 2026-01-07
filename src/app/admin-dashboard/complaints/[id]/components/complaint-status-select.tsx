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
import { ComplaintType, ComplaintStatusType } from "@/types/complaint";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { ScheduledForm } from "../../components/scheduled-form";
import { ResolutionForm } from "../../components/resolution-form";
import { type ScheduledFormValues, type ResolutionFormValues } from "@/schemas/complaint.schema";
import { toast } from "sonner";

interface ComplaintStatusSelectProps {
  complaint: ComplaintType;
}

export function ComplaintStatusSelect({ complaint }: ComplaintStatusSelectProps) {
  const { updateComplaintStatus } = useComplaintDb();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const scheduleCloseRef = useRef<HTMLButtonElement>(null);
  const resolveCloseRef = useRef<HTMLButtonElement>(null);

  const handleStatusChange = (status: ComplaintStatusType) => {
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

  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleResolveSubmit = async (data: ResolutionFormValues) => {
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
