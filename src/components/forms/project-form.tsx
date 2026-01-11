"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiImageUploader, { type FileUploadType } from "@/components/multi-image-uploader";
import MapLocationPicker from "@/components/map-location-picker";
import { projectFormSchema, type ProjectFormValues } from "@/schemas/project.schema";
import type { ProjectCategoryType, ProjectStatusType } from "@/types/project";

type ProjectFormProps = {
  handleSubmit: (values: ProjectFormValues) => void;
  submitButtonLabel: string;
  defaultValues?: ProjectFormValues;
};

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

export default function ProjectForm({ 
  handleSubmit, 
  submitButtonLabel,
  defaultValues 
}: ProjectFormProps) {
  const combinedDefaultValues: ProjectFormValues = {
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
    ...defaultValues,
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: combinedDefaultValues,
  });

  const statusValue = form.watch("status");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
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
                    images={(field.value as FileUploadType[]) || []}
                    onImagesChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">{submitButtonLabel}</Button>
        </fieldset>
      </form>
    </Form>
  );
}
