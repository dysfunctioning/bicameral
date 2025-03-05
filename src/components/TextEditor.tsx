
import { useState, useRef } from "react";
import EditorToolbar from "./editor/EditorToolbar";
import TextPreview from "./editor/TextPreview";
import { fontSizeClasses, fontFamilyClasses } from "./editor/editorUtils";
import ContentEditable from "./editor/ContentEditable";

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
}

export default function TextEditor({ text, setText }: TextEditorProps) {
  const [fontSize, setFontSize] = useState<string>("medium");
  const [fontFamily, setFontFamily] = useState<string>("sans");
  const [paragraphAlignments, setParagraphAlignments] = useState<Record<number, string>>({});
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);
  const editableRef = useRef<HTMLDivElement>(null);
  
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
