
import { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import TextEditor from "@/components/TextEditor";
import Whiteboard from "@/components/Whiteboard";
import ChangeTrackingPane from "@/components/ChangeTrackingPane";
import { convertToWhiteboard, convertToText } from "@/lib/conversionUtils";
import { v4 as uuidv4 } from "uuid";

// Change type is imported from ChangeTrackingPane
import { Change } from "@/components/ChangeTrackingPane";

export default function BrainstormEditor() {
  const [mode, setMode] = useState<"normal" | "whiteboard">("normal");
  const [text, setText] = useState("");
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [showChangeTracking, setShowChangeTracking] = useState(false);
  const [changes, setChanges] = useState<Change[]>([]);
  const [lastText, setLastText] = useState("");

  // For demo purposes, we'll use a fake user
  const currentUser = "Current User";

  const handleModeChange = (newMode: "normal" | "whiteboard") => {
    if (newMode === mode) return;
    
    if (newMode === "whiteboard") {
      // Convert text to whiteboard nodes and edges
      const { nodes: newNodes, edges: newEdges } = convertToWhiteboard(text);
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      // Convert whiteboard to text
      const newText = convertToText(nodes, edges);
      setText(newText);
    }
    
    setMode(newMode);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    
    // Track change if in normal mode and change tracking is enabled
    if (mode === "normal" && showChangeTracking && lastText !== newText) {
      // Only create a change if text has been idle for 1 second
      // This prevents creating a change for every keystroke
      const timeoutId = setTimeout(() => {
        const diff = findTextDifference(lastText, newText);
        if (diff) {
          const newChange: Change = {
            id: uuidv4(),
            text: diff,
            author: currentUser,
            timestamp: new Date(),
            comment: "",
            status: "pending"
          };
          setChanges(prev => [newChange, ...prev]);
          setLastText(newText);
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  // Initialize lastText when text changes
  useEffect(() => {
    if (lastText === "" && text !== "") {
      setLastText(text);
    }
  }, [text, lastText]);

  const findTextDifference = (oldText: string, newText: string): string => {
    // Simple implementation: if old text is empty, consider all new text as a change
    if (!oldText) return newText;
    
    // Compare paragraph by paragraph
    const oldParagraphs = oldText.split('\n');
    const newParagraphs = newText.split('\n');
    
    // Find added or modified paragraphs
    const changedParagraphs: string[] = [];
    
    const maxLength = Math.max(oldParagraphs.length, newParagraphs.length);
    
    for (let i = 0; i < maxLength; i++) {
      const oldParagraph = oldParagraphs[i] || '';
      const newParagraph = newParagraphs[i] || '';
      
      if (oldParagraph !== newParagraph) {
        changedParagraphs.push(newParagraph);
      }
    }
    
    return changedParagraphs.join('\n');
  };

  const handleAcceptChange = (id: string) => {
    setChanges(prev => 
      prev.map(change => 
        change.id === id ? { ...change, status: "accepted" } : change
      )
    );
    toast.success("Change accepted");
  };

  const handleRejectChange = (id: string) => {
    setChanges(prev => 
      prev.map(change => 
        change.id === id ? { ...change, status: "rejected" } : change
      )
    );
    toast.error("Change rejected");
  };

  const handleAddComment = (id: string, comment: string) => {
    setChanges(prev => 
      prev.map(change => 
        change.id === id ? { ...change, comment } : change
      )
    );
    toast.info("Comment added");
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
        <h1 className="text-xl font-bold">Brainstorm Editor</h1>
        <div className="flex items-center gap-2">
          <Toggle
            pressed={mode === "normal"}
            onPressedChange={() => handleModeChange("normal")}
            aria-label="Toggle normal mode"
            className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          >
            Normal
          </Toggle>
          <Toggle
            pressed={mode === "whiteboard"}
            onPressedChange={() => handleModeChange("whiteboard")}
            aria-label="Toggle whiteboard mode"
            className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          >
            Whiteboard
          </Toggle>
          {mode === "normal" && (
            <Toggle
              pressed={showChangeTracking}
              onPressedChange={setShowChangeTracking}
              aria-label="Toggle change tracking"
              className="data-[state=on]:bg-green-500 data-[state=on]:text-white ml-2"
            >
              Track Changes
            </Toggle>
          )}
        </div>
      </div>
      
      <div className="flex-1 min-h-0 rounded-lg border overflow-hidden">
        <div className="h-full flex">
          {mode === "normal" ? (
            <>
              <div className={`flex-1 ${showChangeTracking ? 'border-r' : ''}`}>
                <TextEditor text={text} setText={handleTextChange} />
              </div>
              {showChangeTracking && (
                <div className="w-1/3 min-w-[300px]">
                  <ChangeTrackingPane 
                    changes={changes}
                    onAcceptChange={handleAcceptChange}
                    onRejectChange={handleRejectChange}
                    onAddComment={handleAddComment}
                  />
                </div>
              )}
            </>
          ) : (
            <Whiteboard nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
          )}
        </div>
      </div>
    </div>
  );
}
