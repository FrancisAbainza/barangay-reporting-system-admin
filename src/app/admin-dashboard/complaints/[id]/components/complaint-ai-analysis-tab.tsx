import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
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
  MessageSquare,
  TrendingUp,
  FileText
} from "lucide-react";
import type { ComplaintAiAnalysis } from "@/contexts/complaint-db-context";

interface ComplaintAIAnalysisTabProps {
  isGenerating: boolean;
  analysis: ComplaintAiAnalysis | null;
  onGenerate: () => void;
}

export function ComplaintAIAnalysisTab({
  isGenerating,
  analysis,
  onGenerate,
}: ComplaintAIAnalysisTabProps) {
  const getSentimentBadge = (sentiment: string) => {
    const colors: Record<string, string> = {
      supportive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      positive: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      negative: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      neutral: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[sentiment] || colors.neutral;
  };

  return (
    <TabsContent value="ai-analysis" className="space-y-4 p-6">
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Generating AI analysis...</p>
        </div>
      ) : analysis ? (
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
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Summary
            </h4>
            <p className="text-sm text-muted-foreground">{analysis.summary}</p>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department Routing */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Department Routing
              </h4>
              <p className="text-sm">{analysis.departmentRouting}</p>
            </div>

            {/* Budget Estimate */}
            {analysis.budgetEstimate && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" />
                  Budget Estimate
                </h4>
                <p className="text-sm">{analysis.budgetEstimate}</p>
              </div>
            )}

            {/* Manpower */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Estimated Manpower
              </h4>
              <p className="text-sm">{analysis.estimatedManpower}</p>
            </div>

            {/* Timeframe */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Estimated Timeframe
              </h4>
              <p className="text-sm">{analysis.estimatedTimeframe}</p>
            </div>
          </div>

          {/* Suggested Solution */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Suggested Solution
            </h4>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {analysis.suggestedSolution}
            </div>
          </div>

          {/* Required Resources */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              Required Resources
            </h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {analysis.requiredResources.map((resource, idx) => (
                <li key={idx}>{resource}</li>
              ))}
            </ul>
          </div>

          {/* Risk & Prevention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Public Safety Risk */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Public Safety Risk
              </h4>
              <p className="text-sm text-muted-foreground">{analysis.publicSafetyRisk}</p>
            </div>

            {/* Prevention Advice */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Prevention Advice
              </h4>
              <p className="text-sm text-muted-foreground">{analysis.preventionAdvice}</p>
            </div>
          </div>

          {/* Community Sentiment */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Community Sentiment
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sentiment:</span>
                <Badge className={getSentimentBadge(analysis.commentsSentiment)}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {analysis.commentsSentiment.charAt(0).toUpperCase() + analysis.commentsSentiment.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{analysis.commentsSummary}</p>
            </div>
          </div>

          {/* Regenerate Button */}
          <div className="pt-4 border-t">
            <Button onClick={onGenerate} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Regenerate Analysis
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No AI Analysis Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Click the &quot;Generate AI Analysis&quot; button above to get AI-powered insights,
              recommendations, and analysis for this complaint.
            </p>
          </div>
          <Button onClick={onGenerate} size="lg" className="gap-2 mt-4">
            <Sparkles className="h-5 w-5" />
            Generate AI Analysis
          </Button>
        </div>
      )}
    </TabsContent>
  );
}
