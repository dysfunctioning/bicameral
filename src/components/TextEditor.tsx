
import { useState, useRef, useEffect } from "react";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Type
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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

  const fontSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
    xlarge: "text-xl"
  };

  const fontFamilyClasses = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono"
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

  // Render paragraphs with their specific alignments
  const renderParagraphs = () => {
    if (!text) return null;
    
    const paragraphs = text.split('\n');
    
    return paragraphs.map((paragraph, index) => {
      const alignment = paragraphAlignments[index] || 'left';
      
      return (
        <div 
          key={index} 
          className={`mb-2 text-${alignment}`}
          style={{ textAlign: alignment as any }}
        >
          {paragraph || <br />}
        </div>
      );
    });
  };

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
      <div className="border-b p-2 flex flex-wrap items-center gap-2">
        <div className="flex border rounded-md overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 ${getCurrentAlignment() === 'left' ? 'bg-muted' : ''}`}
            onClick={() => handleAlignChange('left')}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 ${getCurrentAlignment() === 'center' ? 'bg-muted' : ''}`}
            onClick={() => handleAlignChange('center')}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 ${getCurrentAlignment() === 'right' ? 'bg-muted' : ''}`}
            onClick={() => handleAlignChange('right')}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 ${getCurrentAlignment() === 'justify' ? 'bg-muted' : ''}`}
            onClick={() => handleAlignChange('justify')}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <Type className="h-4 w-4 text-muted-foreground" />
          <Select value={fontSize} onValueChange={handleFontSizeChange}>
            <SelectTrigger className="h-8 w-24">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xlarge">X-Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger className="h-8 w-28">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={`flex-1 p-4 ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]} ${fontFamilyClasses[fontFamily as keyof typeof fontFamilyClasses]}`}>
        <div className="hidden">
          {renderParagraphs()}
        </div>
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
        <div className="mt-4 p-2 border rounded-md">
          <h3 className="text-sm font-semibold mb-2">Preview:</h3>
          <div className={`${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]} ${fontFamilyClasses[fontFamily as keyof typeof fontFamilyClasses]}`}>
            {text.split('\n').map((paragraph, index) => {
              const alignment = paragraphAlignments[index] || 'left';
              return (
                <div 
                  key={index} 
                  className={`mb-2`}
                  style={{ textAlign: alignment as any }}
                >
                  {paragraph || <br />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
