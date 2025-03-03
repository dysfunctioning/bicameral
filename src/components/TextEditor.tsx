
import { useState } from "react";
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
  const [textAlign, setTextAlign] = useState<string>("left");
  const [fontSize, setFontSize] = useState<string>("medium");
  const [fontFamily, setFontFamily] = useState<string>("sans");

  const handleAlignChange = (alignment: string) => {
    setTextAlign(alignment);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
  };

  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
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

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b p-2 flex flex-wrap items-center gap-2">
        <div className="flex border rounded-md overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 ${textAlign === 'left' ? 'bg-muted' : ''}`}
            onClick={() => handleAlignChange('left')}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 ${textAlign === 'center' ? 'bg-muted' : ''}`}
            onClick={() => handleAlignChange('center')}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 ${textAlign === 'right' ? 'bg-muted' : ''}`}
            onClick={() => handleAlignChange('right')}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 ${textAlign === 'justify' ? 'bg-muted' : ''}`}
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

      <div className={`flex-1 p-4 ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]} ${fontFamilyClasses[fontFamily as keyof typeof fontFamilyClasses]} text-${textAlign}`}>
        <textarea
          className={`w-full h-full focus:outline-none resize-none text-${textAlign}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing your content here..."
        />
      </div>
    </div>
  );
}
