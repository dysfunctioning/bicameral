
import { useState } from "react";
import { toast } from "sonner";
import { convertToWhiteboard, convertToText } from "@/lib/conversionUtils";

export function useModeHandler() {
  const [mode, setMode] = useState<"normal" | "whiteboard">("normal");
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [paragraphAlignments, setParagraphAlignments] = useState<Record<number, string>>({});

  const handleModeChange = (
    newMode: "normal" | "whiteboard", 
    text: string, 
    fontSize: string, 
    fontFamily: string,
    setText: (text: string) => void,
    currentParagraphAlignments?: Record<number, string>
  ) => {
    if (newMode === mode) return;
    
    // If switching to whiteboard, save current paragraph alignments
    if (newMode === "whiteboard" && currentParagraphAlignments) {
      setParagraphAlignments(currentParagraphAlignments);
    }
    
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

  return {
    mode,
    nodes,
    edges,
    setNodes,
    setEdges,
    paragraphAlignments,
    handleModeChange
  };
}
