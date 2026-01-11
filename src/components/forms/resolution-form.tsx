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
import { Textarea } from "@/components/ui/textarea";
import MultiImageUploader from "@/components/multi-image-uploader";
import { resolutionSchema, type ResolutionFormValues } from "@/schemas/complaint.schema";

type ResolutionFormProps = {
  handleSubmit: (data: ResolutionFormValues) => void;
  defaultValues?: ResolutionFormValues;
};

export default function ResolutionForm({ handleSubmit, defaultValues }: ResolutionFormProps) {
  const combinedDefaultValues: ResolutionFormValues = {
    description: "",
    budget: "",
    image: undefined,
    ...defaultValues,
  };

  const form = useForm<ResolutionFormValues>({
    resolver: zodResolver(resolutionSchema),
    defaultValues: combinedDefaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset disabled={form.formState.isSubmitting} className="space-y-3">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Resolution Description <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe how the complaint was resolved..."
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter budget amount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolution Image (Optional)</FormLabel>
                <FormControl>
                  <MultiImageUploader
                    images={field.value ? [field.value] : []}
                    onImagesChange={(newImages) => {
                      field.onChange(newImages[0]);
                    }}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">Maximum 1 image allowed</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Mark as Resolved</Button>
        </fieldset>
      </form>
    </Form>
  );
}
