"use client";

import { useEffect } from "react";
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
import type { Complaint } from "@/types/complaint";

interface ScheduledDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ScheduledFormValues) => void;
  complaint: Complaint | null;
}

const scheduledSchema = z.object({
  scheduledDate: z.string().min(1, "Scheduled date is required"),
});

export type ScheduledFormValues = z.infer<typeof scheduledSchema>;

export function ScheduledDialog({
  open,
  onOpenChange,
  onSubmit,
  complaint,
}: ScheduledDialogProps) {
  const form = useForm<ScheduledFormValues>({
    resolver: zodResolver(scheduledSchema),
    defaultValues: {
      scheduledDate: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        scheduledDate: "",
      });
    }
  }, [open, form]);

  const handleSubmit = (data: ScheduledFormValues) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Complaint</DialogTitle>
          <DialogDescription>
            Set the date when this complaint is scheduled to be addressed
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Scheduled Date <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Mark as Scheduled</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
