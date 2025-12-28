"use client";

import { useState } from "react";
import { useComplaintDb } from "@/contexts/complaint-db-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { InfoCard } from "@/components/ui/info-card";
import { Spinner } from "@/components/ui/spinner";
import { ThumbsUp, ThumbsDown, MessageSquare, Send, Reply as ReplyIcon, TrendingUp, Sparkles } from "lucide-react";
import type { Complaint } from "@/types/complaint";
import { formatDate } from "@/lib/date-formatter";

interface ComplaintEngagementTabProps {
  complaint: Complaint;
}

export function ComplaintEngagementTab({ complaint }: ComplaintEngagementTabProps) {
  const { addComplaintComment, addReply, generateCommunitySentiment } = useComplaintDb();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [adminComment, setAdminComment] = useState("");
  const [isGeneratingSentiment, setIsGeneratingSentiment] = useState(false);

  const handleAddAdminComment = () => {
    const content = adminComment.trim();
    if (content) {
      addComplaintComment(
        complaint.id,
        "admin1",
        "Admin Staff",
        content,
        true
      );
      setAdminComment("");
    }
  };

  const handleAddReply = (commentId: string, content: string) => {
    addReply(
      complaint.id,
      commentId,
      "admin1",
      "Admin Staff",
      content,
      true
    );
  };

  const handleGenerateCommunitySentiment = async () => {
    setIsGeneratingSentiment(true);
    
    try {
      await generateCommunitySentiment(complaint.id);
    } catch (error) {
      console.error("Error generating community sentiment:", error);
      alert("Failed to generate community sentiment. Please try again.");
    } finally {
      setIsGeneratingSentiment(false);
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const colors: Record<string, string> = {
      supportive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      positive: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      negative: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      neutral: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[sentiment] || colors.neutral;
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    if (replyingTo !== commentId) {
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
    }
  };

  const handleReplySubmit = (commentId: string) => {
    const content = replyContent[commentId]?.trim();
    if (content) {
      handleAddReply(commentId, content);
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
      setReplyingTo(null);
    }
  };

  const handleReplyChange = (commentId: string, value: string) => {
    setReplyContent((prev) => ({ ...prev, [commentId]: value }));
  };

  const renderGeneratingSentiment = () => (
    <InfoCard icon={MessageSquare} iconClassName="text-primary" title="Community Sentiment">
      <div className="flex items-center gap-2 py-2">
        <Spinner size="sm" />
        <p className="text-sm text-muted-foreground">Generating community sentiment analysis...</p>
      </div>
    </InfoCard>
  );

  const renderExistingSentiment = () => (
    <InfoCard icon={MessageSquare} iconClassName="text-primary" title="Community Sentiment">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sentiment:</span>
          <Badge className={getSentimentBadge(complaint.communitySentiment!.sentiment)}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {complaint.communitySentiment!.sentiment.charAt(0).toUpperCase() + complaint.communitySentiment!.sentiment.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{complaint.communitySentiment!.summary}</p>
        <Button 
          onClick={handleGenerateCommunitySentiment} 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <Sparkles className="h-3 w-3" />
          Regenerate Sentiment
        </Button>
      </div>
    </InfoCard>
  );

  const renderEmptySentiment = () => (
    <InfoCard icon={MessageSquare} iconClassName="text-primary" title="Community Sentiment">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Generate AI-powered sentiment analysis based on community comments.
        </p>
        <Button 
          onClick={handleGenerateCommunitySentiment} 
          size="sm"
          className="gap-2"
          disabled={!complaint.comments || complaint.comments.length === 0}
        >
          <Sparkles className="h-4 w-4" />
          Generate Community Sentiment
        </Button>
      </div>
    </InfoCard>
  );

  const renderEngagementStats = () => (
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{complaint.likes?.length || 0} likes</span>
      </div>
      <div className="flex items-center gap-2">
        <ThumbsDown className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{complaint.dislikes?.length || 0} dislikes</span>
      </div>
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{complaint.comments?.length || 0} comments</span>
      </div>
    </div>
  );

  const renderAdminCommentForm = () => (
    <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
      <h4 className="font-semibold text-sm flex items-center gap-2">
        <Send className="h-4 w-4" />
        Add Admin Comment
      </h4>
      <Textarea
        placeholder="Type your comment as admin..."
        value={adminComment}
        onChange={(e) => setAdminComment(e.target.value)}
        rows={3}
      />
      <Button onClick={handleAddAdminComment} disabled={!adminComment.trim()} size="sm" className="gap-2">
        <Send className="h-4 w-4" />
        Post Comment
      </Button>
    </div>
  );

  const renderReplyForm = (commentId: string) => (
    <div className="ml-8 border rounded-lg p-3 bg-muted/30 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <ReplyIcon className="h-3 w-3" />
        <span>Reply as Admin</span>
      </div>
      <Textarea
        placeholder="Type your reply..."
        value={replyContent[commentId] || ""}
        onChange={(e) => handleReplyChange(commentId, e.target.value)}
        rows={2}
        className="text-sm"
      />
      <div className="flex gap-2">
        <Button
          onClick={() => handleReplySubmit(commentId)}
          disabled={!replyContent[commentId]?.trim()}
          size="sm"
          className="gap-1"
        >
          <Send className="h-3 w-3" />
          Post Reply
        </Button>
        <Button
          onClick={() => setReplyingTo(null)}
          variant="outline"
          size="sm"
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderReplies = (replies: any[]) => (
    <div className="ml-8 space-y-2">
      {replies.map((reply) => (
        <div
          key={reply.id}
          className={`border rounded-lg p-3 space-y-2 ${
            reply.isAdmin ? "bg-primary/5 border-primary/20" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{reply.userName}</span>
              {reply.isAdmin && (
                <Badge variant="secondary" className="text-xs">
                  Admin
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(reply.createdAt)}
            </span>
          </div>
          <p className="text-sm">{reply.content}</p>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {reply.likes?.length || 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCommentsList = () => (
    <div>
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Comments
      </h4>
      <div className="space-y-3">
        {complaint.comments!.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div
              className={`border rounded-lg p-3 space-y-2 ${
                comment.isAdmin ? "bg-primary/5 border-primary/20" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.userName}</span>
                  {comment.isAdmin && (
                    <Badge variant="secondary" className="text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
              <div className="flex gap-3 text-xs text-muted-foreground items-center">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {comment.likes?.length || 0}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 gap-1 text-xs"
                  onClick={() => handleReplyClick(comment.id)}
                >
                  <ReplyIcon className="h-3 w-3" />
                  Reply
                </Button>
                {comment.replies && comment.replies.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                  </span>
                )}
              </div>
            </div>

            {replyingTo === comment.id && renderReplyForm(comment.id)}
            {comment.replies && comment.replies.length > 0 && renderReplies(comment.replies)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <TabsContent value="engagement" className="space-y-4 p-6">
      <div className="space-y-4">
        {isGeneratingSentiment && renderGeneratingSentiment()}
        {!isGeneratingSentiment && complaint.communitySentiment && renderExistingSentiment()}
        {!isGeneratingSentiment && !complaint.communitySentiment && renderEmptySentiment()}

        {renderEngagementStats()}
        {renderAdminCommentForm()}
        {complaint.comments && complaint.comments.length > 0 && renderCommentsList()}
      </div>
    </TabsContent>
  );
}
