"use client";

import { useState } from "react";
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
import { MultiImageUploader } from "@/components/multi-image-uploader";
import { FileUploadType } from "@/types/files";
import { resolutionSchema, type ResolutionFormValues } from "@/schemas/complaint.schema";

type ResolutionFormProps = {
  handleSubmit: (data: ResolutionFormValues) => void;
  defaultValues?: ResolutionFormValues;
};

export function ResolutionForm({ handleSubmit, defaultValues }: ResolutionFormProps) {
  const combinedDefaultValues: ResolutionFormValues = {
    description: "",
    budget: "",
    images: [],
    ...defaultValues,
  };

  const form = useForm<ResolutionFormValues>({
    resolver: zodResolver(resolutionSchema),
    defaultValues: combinedDefaultValues,
  });

  const [images, setImages] = useState<FileUploadType[]>(defaultValues?.images || []);

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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolution Image (Optional)</FormLabel>
                <FormControl>
                  <MultiImageUploader
                    images={images}
                    onImagesChange={(newImages) => {
                      if (newImages.length <= 1) {
                        setImages(newImages);
                        field.onChange(newImages);
                      }
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
