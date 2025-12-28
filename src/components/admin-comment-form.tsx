"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface AdminCommentFormProps {
  onSubmit: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AdminCommentForm({
  onSubmit,
  disabled = false,
  placeholder = "Type your comment as admin...",
}: AdminCommentFormProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      onSubmit(trimmedValue);
      setValue("");
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
      <h4 className="font-semibold text-sm flex items-center gap-2">
        <Send className="h-4 w-4" />
        Add Admin Comment
      </h4>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        disabled={disabled}
      />
      <Button
        onClick={handleSubmit}
        disabled={!value.trim() || disabled}
        size="sm"
        className="gap-2"
      >
        <Send className="h-4 w-4" />
        Post Comment
      </Button>
    </div>
  );
}
