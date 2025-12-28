"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageSquare, Send, Reply as ReplyIcon } from "lucide-react";
import { formatDate } from "@/lib/date-formatter";
import type { Comment, Reply } from "@/types/shared";

interface CommentsListProps {
  comments: Comment[];
  onSubmitReply: (commentId: string, content: string) => void;
}

export function CommentsList({ comments, onSubmitReply }: CommentsListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = (commentId: string) => {
    const content = replyText.trim();
    if (content) {
      onSubmitReply(commentId, content);
      setReplyingTo(null);
      setReplyText("");
    }
  };

  const toggleReply = (commentId: string) => {
    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyText("");
    } else {
      setReplyingTo(commentId);
      setReplyText("");
    }
  };

  const renderReplyForm = (commentId: string) => (
    <div className="ml-8 border rounded-lg p-3 bg-muted/30 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <ReplyIcon className="h-3 w-3" />
        <span>Reply as Admin</span>
      </div>
      <Textarea
        placeholder="Type your reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        rows={2}
        className="text-sm"
      />
      <div className="flex gap-2">
        <Button
          onClick={() => handleSubmitReply(commentId)}
          disabled={!replyText.trim()}
          size="sm"
          className="gap-1"
        >
          <Send className="h-3 w-3" />
          Post Reply
        </Button>
        <Button onClick={() => toggleReply(commentId)} variant="outline" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderReplies = (replies: Reply[]) => (
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

  return (
    <div>
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Comments
      </h4>
      <div className="space-y-3">
        {comments.map((comment) => (
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
                  onClick={() => toggleReply(comment.id)}
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
}
