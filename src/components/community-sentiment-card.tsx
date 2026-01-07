"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoCard } from "@/components/ui/info-card";
import { Spinner } from "@/components/ui/spinner";
import { MessageSquare, TrendingUp, Sparkles } from "lucide-react";
import type { ComplaintType } from "@/types/complaint";
import type { ProjectType } from "@/types/project";

interface CommunitySentimentCardProps {
  item: ComplaintType | ProjectType;
  onGenerate: (itemId: string) => Promise<void>;
}

export function CommunitySentimentCard({
  item,
  onGenerate,
}: CommunitySentimentCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(item.id);
    } catch (error) {
      console.error("Error generating community sentiment:", error);
      alert("Failed to generate community sentiment. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const hasComments = !!item.comments && item.comments.length > 0;
  const getSentimentBadge = (sentiment: string) => {
    const colors: Record<string, string> = {
      supportive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      positive: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      negative: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      neutral: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[sentiment] || colors.neutral;
  };

  if (isGenerating) {
    return (
      <InfoCard icon={MessageSquare} iconClassName="text-primary" title="Community Sentiment">
        <div className="flex items-center gap-2 py-2">
          <Spinner size="sm" />
          <p className="text-sm text-muted-foreground">Generating community sentiment analysis...</p>
        </div>
      </InfoCard>
    );
  }

  if (item.communitySentiment) {
    return (
      <InfoCard icon={MessageSquare} iconClassName="text-primary" title="Community Sentiment">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sentiment:</span>
            <Badge className={getSentimentBadge(item.communitySentiment.sentiment)}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {item.communitySentiment.sentiment.charAt(0).toUpperCase() + item.communitySentiment.sentiment.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{item.communitySentiment.summary}</p>
          <Button onClick={handleGenerate} variant="outline" size="sm" className="gap-2">
            <Sparkles className="h-3 w-3" />
            Regenerate Sentiment
          </Button>
        </div>
      </InfoCard>
    );
  }

  return (
    <InfoCard icon={MessageSquare} iconClassName="text-primary" title="Community Sentiment">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Generate AI-powered sentiment analysis based on community comments.
        </p>
        <Button onClick={handleGenerate} size="sm" className="gap-2" disabled={!hasComments}>
          <Sparkles className="h-4 w-4" />
          Generate Community Sentiment
        </Button>
      </div>
    </InfoCard>
  );
}
