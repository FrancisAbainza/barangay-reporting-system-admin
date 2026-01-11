"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiImageUploader from "@/components/multi-image-uploader";
import { updateProgressSchema, type UpdateProgressFormValues } from "@/schemas/project.schema";
import { Trash2, ImageIcon } from "lucide-react";
import { formatDate } from "@/lib/date-formatter";
import type { ProjectType, ProjectStatusType } from "@/types/project";

type UpdateProgressFormProps = {
  handleSubmit: (data: UpdateProgressFormValues, deletedIndices: number[]) => void;
  defaultValues?: UpdateProgressFormValues;
  project: ProjectType;
};

const statusOptions: { value: ProjectStatusType; label: string }[] = [
  { value: "planned", label: "Planned" },
  { value: "approved", label: "Approved" },
  { value: "ongoing", label: "Ongoing" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function UpdateProgressForm({ handleSubmit, defaultValues, project }: UpdateProgressFormProps) {
  const combinedDefaultValues: UpdateProgressFormValues = {
    status: project.status,
    progressPercentage: project.progressPercentage,
    progressUpdateDescription: "",
    progressUpdateImage: undefined,
    ...defaultValues,
  };

  const form = useForm<UpdateProgressFormValues>({
    resolver: zodResolver(updateProgressSchema),
    defaultValues: combinedDefaultValues,
  });

  const [deletedProgressUpdateIndices, setDeletedProgressUpdateIndices] = useState<number[]>([]);

  const handleDeleteProgressUpdate = (index: number) => {
    setDeletedProgressUpdateIndices((prev) => [...prev, index]);
  };

  const isProgressUpdateDeleted = (index: number) => {
    return deletedProgressUpdateIndices.includes(index);
  };

  const onSubmit = (data: UpdateProgressFormValues) => {
    handleSubmit(data, deletedProgressUpdateIndices);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          {/* Existing Progress Updates */}
          {project.progressUpdates && project.progressUpdates.length > 0 && (
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
                  {deletedProgressUpdateIndices.length} progress update(s) marked for deletion
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
          <FormField
            control={form.control}
            name="progressUpdateImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Progress Update Image (Optional)</FormLabel>
                <FormControl>
                  <MultiImageUploader
                    images={field.value ? [field.value] : []}
                    onImagesChange={(newImages) => {
                      field.onChange(newImages.length > 0 ? newImages[0] : undefined);
                    }}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">Maximum 1 image allowed</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Update Progress</Button>
        </fieldset>
      </form>
    </Form>
  );
}
