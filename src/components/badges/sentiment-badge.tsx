import { SentimentType } from "@/types/shared";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SentimentBadge({ sentiment }: { sentiment: SentimentType }) {
  const getSentimentBadge = (sentiment: SentimentType) => {
    const colors: Record<SentimentType, string> = {
      supportive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      positive: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      negative: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      neutral: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[sentiment as SentimentType] || colors.neutral;
  };

  return (
    <Badge className={getSentimentBadge(sentiment)}>
      <TrendingUp className="h-3 w-3 mr-1" />
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </Badge>
  );

}