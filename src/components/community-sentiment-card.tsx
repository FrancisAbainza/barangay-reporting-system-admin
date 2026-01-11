"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import InfoCard from "@/components/ui/info-card";
import { Spinner } from "@/components/ui/spinner";
import { MessageSquare, Sparkles } from "lucide-react";
import type { ComplaintType } from "@/types/complaint";
import type { ProjectType } from "@/types/project";
import SentimentBadge from "./badges/sentiment-badge";
import { toast } from "sonner";

interface CommunitySentimentCardProps {
  item: ComplaintType | ProjectType;
  onGenerate: (itemId: string) => Promise<void>;
}

export default function CommunitySentimentCard({
  item,
  onGenerate,
}: CommunitySentimentCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(item.id);
    } catch {
      toast.error("Failed to generate community sentiment. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const hasComments = !!item.comments && item.comments.length > 0;

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
            <SentimentBadge sentiment={item.communitySentiment.sentiment} />
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
