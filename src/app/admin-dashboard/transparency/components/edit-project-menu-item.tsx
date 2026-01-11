"use client";

import { useRef } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogDescription, DialogClose } from "@/components/ui/dialog";
import ProjectForm from "@/components/forms/project-form";
import { type ProjectFormValues } from "@/schemas/project.schema";
import { Pencil } from "lucide-react";
import type { ProjectType, UpdateProjectInputType } from "@/types/project";
import { toast } from "sonner";

interface EditProjectMenuItemProps {
  project: ProjectType;
}

const formatDateForInput = (date: Date | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

export default function EditProjectMenuItem({ project }: EditProjectMenuItemProps) {
  const { updateProject } = useProjectDb();
  const closeRef = useRef<HTMLButtonElement>(null);

  const defaultValues: ProjectFormValues = {
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
  };

  const handleSubmit = (data: ProjectFormValues) => {
    try {
      const formData: UpdateProjectInputType = {
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        startDate: new Date(data.startDate),
        expectedCompletionDate: data.expectedCompletionDate
          ? new Date(data.expectedCompletionDate)
          : undefined,
        actualCompletionDate: data.actualCompletionDate
          ? new Date(data.actualCompletionDate)
          : undefined,
        budget: data.budget ? parseFloat(data.budget) : undefined,
        contractor: data.contractor || undefined,
        sourceOfFunds: data.sourceOfFunds || undefined,
        progressPercentage: parseInt(data.progressPercentage),
        location: data.location || undefined,
        images: data.images?.map((img) => ({
          uri: typeof img === "string" ? img : URL.createObjectURL(img),
        })),
      };

      updateProject(project.id, formData);
      toast.success("Success!", {
        description: "Project updated successfully",
      });
      closeRef.current?.click();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Project
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the project details
          </DialogDescription>
        </DialogHeader>
        <ProjectForm 
          handleSubmit={handleSubmit} 
          submitButtonLabel="Save Changes" 
          defaultValues={defaultValues}
        />
        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
