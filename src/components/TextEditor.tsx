
import { useState, useRef, useEffect } from "react";
import EditorToolbar from "./editor/EditorToolbar";
import TextPreview from "./editor/TextPreview";
import { fontSizeClasses, fontFamilyClasses } from "./editor/editorUtils";

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
}

export default function TextEditor({ text, setText }: TextEditorProps) {
  const [fontSize, setFontSize] = useState<string>("medium");
  const [fontFamily, setFontFamily] = useState<string>("sans");
  const [paragraphAlignments, setParagraphAlignments] = useState<Record<number, string>>({});
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Function to determine current paragraph based on cursor position
  const updateCurrentParagraph = () => {
    if (!textareaRef.current) return;
    
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = text.substring(0, cursorPosition);
    const paragraphs = textBeforeCursor.split('\n');
    
    setCurrentParagraphIndex(paragraphs.length - 1);
  };

  // Effect to update paragraph detection when text changes
  useEffect(() => {
    updateCurrentParagraph();
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    updateCurrentParagraph();
  };

  const handleKeyUp = () => {
    updateCurrentParagraph();
  };

  const handleClick = () => {
    updateCurrentParagraph();
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

      <div className={`flex-1 p-4 ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]} ${fontFamilyClasses[fontFamily as keyof typeof fontFamilyClasses]}`}>
        <textarea
          ref={textareaRef}
          className="w-full h-full focus:outline-none resize-none"
          value={text}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onClick={handleClick}
          placeholder="Start typing your content here..."
          style={{ 
            fontFamily: fontFamily === 'sans' ? 'sans-serif' : fontFamily === 'serif' ? 'serif' : 'monospace'
          }}
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
