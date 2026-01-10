"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { scheduledSchema, type ScheduledFormValues } from "@/schemas/complaint.schema";

type ScheduledFormProps = {
  handleSubmit: (data: ScheduledFormValues) => void;
  defaultValues?: ScheduledFormValues;
};

export default function ScheduleForm({ handleSubmit, defaultValues }: ScheduledFormProps) {
  const combinedDefaultValues: ScheduledFormValues = {
    scheduledDate: "",
    ...defaultValues,
  };

  const form = useForm<ScheduledFormValues>({
    resolver: zodResolver(scheduledSchema),
    defaultValues: combinedDefaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset disabled={form.formState.isSubmitting} className="space-y-3">
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
          <Button type="submit">Mark as Scheduled</Button>
        </fieldset>
      </form>
    </Form>
  );
}
