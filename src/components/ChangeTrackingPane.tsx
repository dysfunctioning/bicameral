
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Clock, User, MessageSquare, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface Change {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  comment: string;
  status: "pending" | "accepted" | "rejected";
}

interface ChangeTrackingPaneProps {
  changes: Change[];
  onAcceptChange: (id: string) => void;
  onRejectChange: (id: string) => void;
  onAddComment: (id: string, comment: string) => void;
}

export default function ChangeTrackingPane({
  changes,
  onAcceptChange,
  onRejectChange,
  onAddComment,
}: ChangeTrackingPaneProps) {
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCommentChange = (id: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitComment = (id: string) => {
    if (commentInputs[id]?.trim()) {
      onAddComment(id, commentInputs[id]);
      setCommentInputs((prev) => ({ ...prev, [id]: "" }));
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border-l">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Change Tracking</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {changes.length === 0 ? (
            <div className="text-muted-foreground text-center p-4">
              No changes tracked yet
            </div>
          ) : (
            changes.map((change) => (
              <div 
                key={change.id} 
                className={`border rounded-md p-3 ${
                  change.status === 'accepted' ? 'bg-green-50 border-green-200' : 
                  change.status === 'rejected' ? 'bg-red-50 border-red-200' : 
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{change.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatDistanceToNow(change.timestamp, { addSuffix: true })}</span>
                  </div>
                </div>
                
                <div className="bg-white p-2 rounded border mb-2">
                  <pre className="text-sm whitespace-pre-wrap">{change.text}</pre>
                </div>
                
                {change.status === "pending" && (
                  <div className="flex gap-2 mb-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-50"
                      onClick={() => onAcceptChange(change.id)}
                    >
                      <Check className="h-4 w-4" /> Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full flex items-center gap-1 border-red-500 text-red-600 hover:bg-red-50"
                      onClick={() => onRejectChange(change.id)}
                    >
                      <X className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                )}
                
                {change.comment && (
                  <div className="bg-muted p-2 rounded text-sm mb-2">
                    <div className="flex items-center gap-1 mb-1 text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span className="text-xs">Comment:</span>
                    </div>
                    {change.comment}
                  </div>
                )}
                
                {change.status === "pending" && (
                  <div className="flex gap-2 items-end">
                    <Textarea
                      placeholder="Add a comment..."
                      className="text-sm min-h-[60px]"
                      value={commentInputs[change.id] || ""}
                      onChange={(e) => handleCommentChange(change.id, e.target.value)}
                    />
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="flex items-center gap-1"
                      onClick={() => handleSubmitComment(change.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {(change.status === "accepted" || change.status === "rejected") && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Status: <span className={change.status === "accepted" ? "text-green-600" : "text-red-600"}>
                      {change.status === "accepted" ? "Accepted" : "Rejected"}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
