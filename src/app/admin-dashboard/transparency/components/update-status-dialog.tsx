"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiImageUploader } from "@/components/multi-image-uploader";
import type { Project, ProjectStatus } from "@/types/project";
import type { FileUpload } from "@/types/files";

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateStatusFormValues) => void;
  project: Project | null;
}

const updateStatusSchema = z.object({
  status: z.enum([
    "planned",
    "approved",
    "ongoing",
    "on_hold",
    "completed",
    "cancelled",
  ]),
  progressPercentage: z.number().min(0).max(100),
  progressUpdateDescription: z.string().optional(),
  progressUpdateImage: z
    .object({
      uri: z.string(),
    })
    .optional(),
});

export type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "planned", label: "Planned" },
  { value: "approved", label: "Approved" },
  { value: "ongoing", label: "Ongoing" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function UpdateStatusDialog({
  open,
  onOpenChange,
  onSubmit,
  project,
}: UpdateStatusDialogProps) {
  const [progressImages, setProgressImages] = useState<FileUpload[]>([]);
  
  const form = useForm<UpdateStatusFormValues>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: "planned",
      progressPercentage: 0,
      progressUpdateDescription: "",
      progressUpdateImage: undefined,
    },
  });

  // Update form when project changes or dialog opens
  useEffect(() => {
    if (open && project) {
      form.reset({
        status: project.status,
        progressPercentage: project.progressPercentage,
        progressUpdateDescription: "",
        progressUpdateImage: undefined,
      });
      setProgressImages([]);
    }
  }, [project, open, form]);

  // Watch status changes to handle actualEndDate
  const currentStatus = form.watch("status");
  
  useEffect(() => {
    if (project && open) {
      const previousStatus = project.status;
      
      // When changing to completed, set actualCompletionDate to today
      if (currentStatus === "completed" && previousStatus !== "completed") {
        // This will be handled by the parent component
      }
      
      // When changing away from completed, clear actualCompletionDate
      if (currentStatus !== "completed" && previousStatus === "completed") {
        // This will be handled by the parent component
      }
    }
  }, [currentStatus, project, open]);

  const handleSubmit = (values: UpdateStatusFormValues) => {
    const submitData = {
      ...values,
      progressUpdateImage: 
        progressImages.length > 0
          ? { uri: progressImages[0] instanceof File ? URL.createObjectURL(progressImages[0]) : progressImages[0] }
          : undefined,
    };
    onSubmit(submitData);
    onOpenChange(false);
  };

  const handleImageUpload = (images: FileUpload[]) => {
    setProgressImages(images.slice(0, 1)); // Limit to 1 image
    if (images.length > 0) {
      const imageUri = images[0] instanceof File ? URL.createObjectURL(images[0]) : images[0];
      form.setValue("progressUpdateImage", { uri: imageUri });
    } else {
      form.setValue("progressUpdateImage", undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Project Progress</DialogTitle>
          <DialogDescription>
            Update the status and progress of the project
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Status <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Progress Percentage */}
            <FormField
              control={form.control}
              name="progressPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Progress Percentage <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Progress Update Description */}
            <FormField
              control={form.control}
              name="progressUpdateDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress Update Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the progress made..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Progress Update Image */}
            <div className="space-y-2">
              <FormLabel>Progress Update Image (Optional)</FormLabel>
              <MultiImageUploader
                images={progressImages}
                onImagesChange={handleImageUpload}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Progress</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
