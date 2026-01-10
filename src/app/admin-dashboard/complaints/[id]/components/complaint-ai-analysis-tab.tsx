"use client";

import { useState } from "react";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import InfoCard from "@/components/ui/info-card";
import {
  Sparkles,
  RefreshCw,
  Lightbulb,
  Wrench,
  Users,
  Clock,
  Building2,
  Receipt,
  AlertTriangle,
  Shield,
  FileText
} from "lucide-react";
import type { ComplaintType } from "@/types/complaint";
import { toast } from "sonner";

interface ComplaintAIAnalysisTabProps {
  complaint: ComplaintType;
}

export default function ComplaintAIAnalysisTab({ complaint }: ComplaintAIAnalysisTabProps) {
  const { generateAIAnalysis } = useComplaintDb();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    setIsGenerating(true);

    try {
      await generateAIAnalysis(complaint.id);
    } catch (error) {
      toast.error("Failed to generate AI analysis. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const analysis = complaint.aiAnalysis;

  if (isGenerating) {
    return (
      <TabsContent value="ai-analysis" className="space-y-4 p-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Generating AI analysis...</p>
        </div>
      </TabsContent>
    );
  }

  if (!isGenerating && analysis) {
    return (
      <TabsContent value="ai-analysis" className="space-y-4 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This analysis was automatically generated to assist in complaint resolution.
            </p>
          </div>

          {/* Summary */}
          <InfoCard icon={FileText} title="Summary">
            <p className="text-sm text-muted-foreground">{analysis.summary}</p>
          </InfoCard>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department Routing */}
            <InfoCard icon={Building2} iconClassName="text-primary" title="Department Routing">
              <p className="text-sm">{analysis.departmentRouting}</p>
            </InfoCard>

            {/* Budget Estimate */}
            {analysis.budgetEstimate && (
              <InfoCard icon={Receipt} iconClassName="text-primary" title="Budget Estimate">
                <p className="text-sm">{analysis.budgetEstimate}</p>
              </InfoCard>
            )}

            {/* Manpower */}
            <InfoCard icon={Users} iconClassName="text-primary" title="Estimated Manpower">
              <p className="text-sm">{analysis.estimatedManpower}</p>
            </InfoCard>

            {/* Timeframe */}
            <InfoCard icon={Clock} iconClassName="text-primary" title="Estimated Timeframe">
              <p className="text-sm">{analysis.estimatedTimeframe}</p>
            </InfoCard>
          </div>

          {/* Suggested Solution */}
          <InfoCard icon={Lightbulb} iconClassName="text-primary" title="Suggested Solution">
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {analysis.suggestedSolution}
            </div>
          </InfoCard>

          {/* Required Resources */}
          <InfoCard icon={Wrench} iconClassName="text-primary" title="Required Resources">
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {analysis.requiredResources.map((resource) => (
                <li key={resource}>{resource}</li>
              ))}
            </ul>
          </InfoCard>

          {/* Risk & Prevention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Public Safety Risk */}
            <InfoCard icon={AlertTriangle} iconClassName="text-orange-500" title="Public Safety Risk">
              <p className="text-sm text-muted-foreground">{analysis.publicSafetyRisk}</p>
            </InfoCard>

            {/* Prevention Advice */}
            <InfoCard icon={Shield} iconClassName="text-green-500" title="Prevention Advice">
              <p className="text-sm text-muted-foreground">{analysis.preventionAdvice}</p>
            </InfoCard>
          </div>

          {/* Regenerate Button */}
          <div className="pt-4 border-t">
            <Button onClick={handleGenerateAI} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Regenerate Analysis
            </Button>
          </div>
        </div>
      </TabsContent>
    );
  };

  if (!isGenerating && !analysis) {
    return (
      <TabsContent value="ai-analysis" className="space-y-4 p-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Generate AI Analysis</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Click the &quot;Generate AI Analysis&quot; button above to get AI-powered insights,
              recommendations, and analysis for this complaint.
            </p>
          </div>
          <Button onClick={handleGenerateAI} size="lg" className="gap-2 mt-4">
            <Sparkles className="h-5 w-5" />
            Generate AI Analysis
          </Button>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="ai-analysis" className="space-y-4 p-6"></TabsContent>
  );
}
