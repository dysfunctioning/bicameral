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
  const [fontSize, setFontSize] = useState<string>("medium");
  const [fontFamily, setFontFamily] = useState<string>("sans");
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [showChangeTracking, setShowChangeTracking] = useState(false);
  const [changes, setChanges] = useState<Change[]>([]);
  const [lastText, setLastText] = useState("");
  const [textHistory, setTextHistory] = useState<{id: string, text: string}[]>([]);

  // For demo purposes, we'll use a fake user
  const currentUser = "Current User";

  const handleModeChange = (newMode: "normal" | "whiteboard") => {
    if (newMode === mode) return;
    
    if (newMode === "whiteboard") {
      // Ensure text is not empty
      if (!text || text.trim() === '') {
        toast.error("No content to display in whiteboard. Please add some text first.");
        return; // Don't change mode
      }

      try {
        // Convert text to whiteboard nodes and edges with font styling
        const result = convertToWhiteboard(text, fontSize, fontFamily);
        
        // Debug the conversion
        console.log("Converting to whiteboard mode:");
        console.log("Text input:", text);
        console.log("Generated nodes:", result.nodes);
        console.log("Generated edges:", result.edges);
        
        // Only switch mode if we have nodes
        if (result.nodes.length > 0) {
          setNodes(result.nodes);
          setEdges(result.edges);
          setMode(newMode);
          toast.success("Whiteboard mode enabled - node colors reflect content type");
        } else {
          // If no nodes were created, show an error
          toast.error("Failed to create whiteboard content. Please try again.");
        }
      } catch (error) {
        console.error("Error converting to whiteboard:", error);
        toast.error("An error occurred while creating the whiteboard.");
      }
    } else {
      // Convert whiteboard to text
      try {
        const newText = convertToText(nodes, edges);
        
        // Debug the conversion
        console.log("Converting to normal mode:");
        console.log("Nodes input:", nodes);
        console.log("Generated text:", newText);
        
        // Only set if we actually have text (prevents losing data)
        if (newText.trim() !== '') {
          setText(newText);
          setMode(newMode);
          toast.success("Normal mode enabled");
        } else {
          toast.error("No content found in whiteboard to convert to text.");
        }
      } catch (error) {
        console.error("Error converting to text:", error);
        toast.error("An error occurred while creating the text content.");
      }
    }
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
          const changeId = uuidv4();
          const newChange: Change = {
            id: changeId,
            text: diff,
            author: currentUser,
            timestamp: new Date(),
            comment: "",
            status: "pending"
          };
          
          // Store the text state before this change
          setTextHistory(prev => [...prev, {id: changeId, text: lastText}]);
          
          setChanges(prev => [newChange, ...prev]);
          setLastText(newText);
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

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
    
    // Remove this change from history since it's accepted
    setTextHistory(prev => prev.filter(item => item.id !== id));
    
    toast.success("Change accepted");
  };

  const handleRejectChange = (id: string) => {
    // Find the previous text state for this change
    const previousState = textHistory.find(item => item.id === id);
    
    if (previousState) {
      // Restore the text to its previous state
      setText(previousState.text);
      setLastText(previousState.text);
      toast.success("Change rejected and undone");
    }
    
    setChanges(prev => 
      prev.map(change => 
        change.id === id ? { ...change, status: "rejected" } : change
      )
    );
    
    // Remove this change from history
    setTextHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleAddComment = (id: string, comment: string) => {
    setChanges(prev => 
      prev.map(change => 
        change.id === id ? { ...change, comment } : change
      )
    );
    toast.info("Comment added");
  };

  const handleFontChange = (size: string, family: string) => {
    setFontSize(size);
    setFontFamily(family);
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
                <TextEditor 
                  text={text} 
                  setText={handleTextChange} 
                  onFontChange={handleFontChange}
                  initialFontSize={fontSize}
                  initialFontFamily={fontFamily}
                />
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
