"use client";

import { useRef } from "react";
import { useProjectDb } from "@/contexts/project-db-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import ProjectForm from "@/components/forms/project-form";
import { type ProjectFormValues } from "@/schemas/project.schema";
import { Plus } from "lucide-react";
import type { CreateProjectInputType } from "@/types/project";
import { toast } from "sonner";

export default function CreateProjectButton() {
  const { createProject } = useProjectDb();
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (data: ProjectFormValues) => {
    const formData: CreateProjectInputType = {
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

    createProject(formData);
    toast.success("Success!", {
      description: "Project created successfully",
    });
    closeRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to the transparency portal
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          handleSubmit={handleSubmit}
          submitButtonLabel="Create Project"
        />
        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
