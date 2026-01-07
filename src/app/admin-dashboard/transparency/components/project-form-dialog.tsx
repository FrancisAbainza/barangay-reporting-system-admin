"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { MapLocationPicker } from "@/components/map-location-picker";
import type { ProjectType, ProjectCategoryType, ProjectStatusType, CreateProjectInputType, ProjectLocationType } from "@/types/project";
import type { FileUploadType } from "@/types/files";
import { projectFormSchema, type ProjectFormValues } from "@/schemas/project.schema";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProjectInputType) => void;
  project?: ProjectType | null;
}

const categoryOptions: { value: ProjectCategoryType; label: string }[] = [
  { value: "infrastructure", label: "Infrastructure" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "environment", label: "Environment" },
  { value: "livelihood", label: "Livelihood" },
  { value: "disaster_preparedness", label: "Disaster Preparedness" },
  { value: "social_services", label: "Social Services" },
  { value: "sports_culture", label: "Sports & Culture" },
  { value: "others", label: "Others" },
];

const statusOptions: { value: ProjectStatusType; label: string }[] = [
  { value: "planned", label: "Planned" },
  { value: "approved", label: "Approved" },
  { value: "ongoing", label: "Ongoing" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const formatDateForInput = (date: Date | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

export function ProjectFormDialog({
  open,
  onOpenChange,
  onSubmit,
  project,
}: ProjectFormDialogProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project ? {
      title: project.title,
      description: project.description,
      category: project.category,
      status: project.status,
      startDate: formatDateForInput(project.startDate),
      expectedCompletionDate: formatDateForInput(project.expectedCompletionDate),
      actualCompletionDate: formatDateForInput(project.actualCompletionDate),
      budget: project.budget?.toString() || "",
      contractor: project.contractor || "",
      sourceOfFunds: project.sourceOfFunds || "",
      progressPercentage: project.progressPercentage.toString(),
      location: project.location || null,
      images: project.images?.map((img) => img.uri) || [],
    } : {
      title: "",
      description: "",
      category: "infrastructure",
      status: "planned",
      startDate: new Date().toISOString().split("T")[0],
      expectedCompletionDate: "",
      actualCompletionDate: "",
      budget: "",
      contractor: "",
      sourceOfFunds: "",
      progressPercentage: "0",
      location: null,
      images: [],
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (project) {
        form.reset({
          title: project.title,
          description: project.description,
          category: project.category,
          status: project.status,
          startDate: formatDateForInput(project.startDate),
          expectedCompletionDate: formatDateForInput(project.expectedCompletionDate),
          actualCompletionDate: formatDateForInput(project.actualCompletionDate),
          budget: project.budget?.toString() || "",
          contractor: project.contractor || "",
          sourceOfFunds: project.sourceOfFunds || "",
          progressPercentage: project.progressPercentage.toString(),
          location: project.location || null,
          images: project.images?.map((img) => img.uri) || [],
        });
      } else {
        form.reset({
          title: "",
          description: "",
          category: "infrastructure",
          status: "planned",
          startDate: new Date().toISOString().split("T")[0],
          expectedCompletionDate: "",
          actualCompletionDate: "",
          budget: "",
          contractor: "",
          sourceOfFunds: "",
          progressPercentage: "0",
          location: null,
          images: [],
        });
      }
    }
  }, [project, open, form]);

  const handleSubmit = (values: ProjectFormValues) => {
    const formData: CreateProjectInputType = {
      title: values.title,
      description: values.description,
      category: values.category,
      status: values.status,
      startDate: new Date(values.startDate),
      expectedCompletionDate: values.expectedCompletionDate
        ? new Date(values.expectedCompletionDate)
        : undefined,
      actualCompletionDate: values.actualCompletionDate
        ? new Date(values.actualCompletionDate)
        : undefined,
      budget: values.budget ? parseFloat(values.budget) : undefined,
      contractor: values.contractor || undefined,
      sourceOfFunds: values.sourceOfFunds || undefined,
      progressPercentage: parseInt(values.progressPercentage),
      location: values.location || undefined,
      images: values.images?.map((img) => ({
        uri: typeof img === "string" ? img : URL.createObjectURL(img),
      })),
    };

    onSubmit(formData);
    onOpenChange(false);
  };

  const statusValue = form.watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {project
              ? "Update the project details"
              : "Add a new project to the transparency portal"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter project description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((option) => (
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
            </div>

            {/* Start Date and Expected Completion Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Start Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedCompletionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Completion Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Budget and Progress Percentage Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (₱)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="progressPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Progress Percentage <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contractor */}
            <FormField
              control={form.control}
              name="contractor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contractor</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contractor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Source of Funds */}
            <FormField
              control={form.control}
              name="sourceOfFunds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source of Funds</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter source of funds" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actual Completion Date (for completed projects) */}
            {statusValue === "completed" && (
              <FormField
                control={form.control}
                name="actualCompletionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual Completion Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Location</FormLabel>
                  <FormControl>
                    <MapLocationPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Images</FormLabel>
                  <FormControl>
                    <MultiImageUploader
                      images={field.value as FileUploadType[] || []}
                      onImagesChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {project ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
