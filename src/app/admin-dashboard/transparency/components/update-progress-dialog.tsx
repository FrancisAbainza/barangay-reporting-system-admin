"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, ImageIcon } from "lucide-react";
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
import MultiImageUploader, { type FileUploadType } from "@/components/multi-image-uploader";
import type { ProjectType, ProjectStatusType, ProgressUpdateType } from "@/types/project";
import { formatDate } from "@/lib/date-formatter";
import { updateStatusSchema, type UpdateStatusFormValues } from "@/schemas/project.schema";

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateStatusFormValues & { deletedProgressUpdateIndices?: number[] }) => void;
  project: ProjectType | null;
}

const statusOptions: { value: ProjectStatusType; label: string }[] = [
  { value: "planned", label: "Planned" },
  { value: "approved", label: "Approved" },
  { value: "ongoing", label: "Ongoing" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function UpdateStatusDialog({
  open,
  onOpenChange,
  onSubmit,
  project,
}: UpdateStatusDialogProps) {
  const [progressImages, setProgressImages] = useState<FileUploadType[]>([]);
  const [deletedProgressUpdateIndices, setDeletedProgressUpdateIndices] = useState<number[]>([]);
  
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
      setDeletedProgressUpdateIndices([]);
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
      deletedProgressUpdateIndices: deletedProgressUpdateIndices.length > 0 ? deletedProgressUpdateIndices : undefined,
    };
    onSubmit(submitData);
    onOpenChange(false);
  };

  const handleDeleteProgressUpdate = (index: number) => {
    setDeletedProgressUpdateIndices((prev) => [...prev, index]);
  };

  const isProgressUpdateDeleted = (index: number) => {
    return deletedProgressUpdateIndices.includes(index);
  };

  const handleImageUpload = (images: FileUploadType[]) => {
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
            {/* Existing Progress Updates */}
            {project?.progressUpdates && project.progressUpdates.length > 0 && (
              <div className="space-y-2">
                <FormLabel>Existing Progress Updates</FormLabel>
                <div className="space-y-3 max-h-60 overflow-y-auto border border-border rounded-lg p-3 bg-muted/30">
                  {project.progressUpdates.map((update, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 p-3 border border-border rounded-lg bg-background transition-opacity ${
                        isProgressUpdateDeleted(index) ? "opacity-40 line-through" : ""
                      }`}
                    >
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(update.createdAt)}
                        </p>
                        {update.description && (
                          <p className="text-sm">{update.description}</p>
                        )}
                        {update.image && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ImageIcon className="h-3 w-3" />
                            <span>Image attached</span>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteProgressUpdate(index)}
                        disabled={isProgressUpdateDeleted(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {deletedProgressUpdateIndices.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {deletedProgressUpdateIndices.length} update(s) marked for deletion
                  </p>
                )}
              </div>
            )}

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
