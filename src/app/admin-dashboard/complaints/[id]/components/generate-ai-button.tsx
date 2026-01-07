"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ComplaintType } from "@/types/complaint";
import { useComplaintDb } from "@/contexts/complaint-db-context";

interface GenerateAIButtonProps {
  complaint: ComplaintType;
}

export function GenerateAIButton({ complaint }: GenerateAIButtonProps) {
  const { generateAIAnalysis } = useComplaintDb();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    
    try {
      await generateAIAnalysis(complaint.id);
    } catch (error) {
      console.error("Error generating AI analysis:", error);
      alert("Failed to generate AI analysis. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateAI}
      disabled={isGenerating}
      className="gap-2"
    >
      <Sparkles />
      {isGenerating ? "Generating Analysis..." : "Generate AI Analysis"}
    </Button>
  );
}
