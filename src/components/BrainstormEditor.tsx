
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import TextEditor from "@/components/TextEditor";
import Whiteboard from "@/components/Whiteboard";
import { convertToWhiteboard, convertToText } from "@/lib/conversionUtils";

export default function BrainstormEditor() {
  const [mode, setMode] = useState<"normal" | "whiteboard">("normal");
  const [text, setText] = useState("");
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

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
        </div>
      </div>
      
      <div className="flex-1 min-h-0 rounded-lg border overflow-hidden">
        {mode === "normal" ? (
          <TextEditor text={text} setText={setText} />
        ) : (
          <Whiteboard nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
        )}
      </div>
    </div>
  );
}
