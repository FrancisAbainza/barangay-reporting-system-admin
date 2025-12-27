import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { InfoCard } from "@/components/ui/info-card";
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

  const renderGeneratingState = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground">Generating AI analysis...</p>
    </div>
  );

  const renderAnalysisContent = (analysis: ComplaintAiAnalysis) => (
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
          {analysis.requiredResources.map((resource, idx) => (
            <li key={idx}>{resource}</li>
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

      {/* Community Sentiment */}
      <InfoCard icon={MessageSquare} iconClassName="text-primary" title="Community Sentiment">
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
      </InfoCard>

      {/* Regenerate Button */}
      <div className="pt-4 border-t">
        <Button onClick={onGenerate} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Regenerate Analysis
        </Button>
      </div>
    </div>
  );

  const renderEmptyState = () => (
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
  );

  return (
    <TabsContent value="ai-analysis" className="space-y-4 p-6">
      {isGenerating && renderGeneratingState()}
      {!isGenerating && analysis && renderAnalysisContent(analysis)}
      {!isGenerating && !analysis && renderEmptyState()}
    </TabsContent>
  );
}
