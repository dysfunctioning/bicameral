
import { useState, useRef, useEffect } from "react";
import EditorToolbar from "./editor/EditorToolbar";
import TextPreview from "./editor/TextPreview";
import { fontSizeClasses, fontFamilyClasses } from "./editor/editorUtils";
import ContentEditable from "./editor/ContentEditable";

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  onFontChange?: (fontSize: string, fontFamily: string) => void;
  initialFontSize?: string;
  initialFontFamily?: string;
  initialParagraphAlignments?: Record<number, string>;
  onAlignmentsUpdate?: (alignments: Record<number, string>) => void;
}

export default function TextEditor({ 
  text, 
  setText, 
  onFontChange,
  initialFontSize = "medium",
  initialFontFamily = "sans",
  initialParagraphAlignments = {},
  onAlignmentsUpdate
}: TextEditorProps) {
  const [fontSize, setFontSize] = useState<string>(initialFontSize);
  const [fontFamily, setFontFamily] = useState<string>(initialFontFamily);
  const [paragraphAlignments, setParagraphAlignments] = useState<Record<number, string>>(initialParagraphAlignments);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);
  const editableRef = useRef<HTMLDivElement>(null);
  
  // Update parent component when font settings change
  useEffect(() => {
    if (onFontChange) {
      onFontChange(fontSize, fontFamily);
    }
  }, [fontSize, fontFamily, onFontChange]);
  
  // Initialize with initial paragraph alignments
  useEffect(() => {
    setParagraphAlignments(initialParagraphAlignments);
  }, [initialParagraphAlignments]);
  
  // Notify parent when paragraph alignments change
  useEffect(() => {
    if (onAlignmentsUpdate) {
      onAlignmentsUpdate(paragraphAlignments);
    }
  }, [paragraphAlignments, onAlignmentsUpdate]);
  
  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
  };
  
  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
  };
  
  const handleAlignChange = (alignment: string) => {
    setParagraphAlignments(prev => ({
      ...prev,
      [currentParagraphIndex]: alignment
    }));
  };
  
  const handleChange = (newText: string) => {
    setText(newText);
  };
  
  // Get current alignment for the toolbar
  const getCurrentAlignment = () => {
    return paragraphAlignments[currentParagraphIndex] || 'left';
  };
  
  return (
    <div className="h-full flex flex-col bg-white">
      <EditorToolbar 
        fontSize={fontSize}
        fontFamily={fontFamily}
        currentAlignment={getCurrentAlignment()}
        onFontSizeChange={handleFontSizeChange}
        onFontFamilyChange={handleFontFamilyChange}
        onAlignChange={handleAlignChange}
      />
      
      <div className="flex flex-1">
        <ContentEditable
          text={text}
          paragraphAlignments={paragraphAlignments}
          fontSize={fontSize}
          fontFamily={fontFamily}
          onChange={handleChange}
          onParagraphChange={setCurrentParagraphIndex}
          editableRef={editableRef}
        />
        
        <TextPreview 
          text={text}
          paragraphAlignments={paragraphAlignments}
          fontSizeClass={fontSizeClasses[fontSize as keyof typeof fontSizeClasses]}
          fontFamilyClass={fontFamilyClasses[fontFamily as keyof typeof fontFamilyClasses]}
        />
      </div>
    </div>
  );
}
