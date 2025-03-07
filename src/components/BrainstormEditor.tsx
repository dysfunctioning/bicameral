
import { useState } from "react";
import { toast } from "sonner";
import TextEditor from "@/components/TextEditor";
import Whiteboard from "@/components/Whiteboard";
import ChangeTrackingPane from "@/components/ChangeTrackingPane";
import ModeToggle from "@/components/brainstorm/ModeToggle";
import { useModeHandler } from "@/hooks/useModeHandler";
import { useChangeTracker } from "@/hooks/useChangeTracker";

export default function BrainstormEditor() {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState<string>("medium");
  const [fontFamily, setFontFamily] = useState<string>("sans");
  const [showChangeTracking, setShowChangeTracking] = useState(false);
  const [paragraphAlignments, setParagraphAlignments] = useState<Record<number, string>>({});
  
  // Mode handling logic
  const { 
    mode, 
    nodes, 
    edges, 
    setNodes, 
    setEdges,
    paragraphAlignments: savedAlignments,
    handleModeChange 
  } = useModeHandler();
  
  // Change tracking logic
  const {
    changes,
    handleAcceptChange,
    handleRejectChange,
    handleAddComment
  } = useChangeTracker(text, showChangeTracking && mode === "normal");

  // Handle text changes
  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  // Handle paragraph alignments update
  const handleAlignmentsUpdate = (newAlignments: Record<number, string>) => {
    setParagraphAlignments(newAlignments);
  };

  // Handle mode toggle
  const onModeChange = (newMode: "normal" | "whiteboard") => {
    handleModeChange(newMode, text, fontSize, fontFamily, setText, paragraphAlignments);
    
    // When switching back to normal mode, restore saved paragraph alignments
    if (newMode === "normal" && Object.keys(savedAlignments).length > 0) {
      setParagraphAlignments(savedAlignments);
    }
  };

  // Handle change tracking toggle
  const onChangeTrackingToggle = (show: boolean) => {
    setShowChangeTracking(show);
  };

  // Handle a rejected change (needs to update text)
  const onRejectChange = (id: string) => {
    const previousText = handleRejectChange(id);
    if (previousText) {
      setText(previousText);
    }
    toast.success("Change rejected and undone");
  };

  // Handle change acceptance
  const onAcceptChange = (id: string) => {
    handleAcceptChange(id);
    toast.success("Change accepted");
  };

  // Handle adding a comment
  const onAddComment = (id: string, comment: string) => {
    handleAddComment(id, comment);
    toast.info("Comment added");
  };

  // Handle font changes
  const handleFontChange = (size: string, family: string) => {
    setFontSize(size);
    setFontFamily(family);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
        <h1 className="text-xl font-bold">Brainstorm Editor</h1>
        <ModeToggle
          mode={mode}
          onModeChange={onModeChange}
          showChangeTracking={showChangeTracking}
          onChangeTrackingToggle={onChangeTrackingToggle}
        />
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
                  initialParagraphAlignments={paragraphAlignments}
                  onAlignmentsUpdate={handleAlignmentsUpdate}
                />
              </div>
              {showChangeTracking && (
                <div className="w-1/3 min-w-[300px]">
                  <ChangeTrackingPane 
                    changes={changes}
                    onAcceptChange={onAcceptChange}
                    onRejectChange={onRejectChange}
                    onAddComment={onAddComment}
                  />
                </div>
              )}
            </>
          ) : (
            <Whiteboard 
              nodes={nodes} 
              setNodes={setNodes} 
              edges={edges} 
              setEdges={setEdges} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
