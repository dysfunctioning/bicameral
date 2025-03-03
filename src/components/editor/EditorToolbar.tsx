
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

interface EditorToolbarProps {
  fontSize: string;
  fontFamily: string;
  currentAlignment: string;
  onFontSizeChange: (size: string) => void;
  onFontFamilyChange: (font: string) => void;
  onAlignChange: (alignment: string) => void;
}

export default function EditorToolbar({
  fontSize,
  fontFamily,
  currentAlignment,
  onFontSizeChange,
  onFontFamilyChange,
  onAlignChange
}: EditorToolbarProps) {
  return (
    <div className="border-b p-2 flex flex-wrap items-center gap-2">
      <div className="flex border rounded-md overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon"
          className={`h-8 w-8 ${currentAlignment === 'left' ? 'bg-muted' : ''}`}
          onClick={() => onAlignChange('left')}
          title="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={`h-8 w-8 ${currentAlignment === 'center' ? 'bg-muted' : ''}`}
          onClick={() => onAlignChange('center')}
          title="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={`h-8 w-8 ${currentAlignment === 'right' ? 'bg-muted' : ''}`}
          onClick={() => onAlignChange('right')}
          title="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={`h-8 w-8 ${currentAlignment === 'justify' ? 'bg-muted' : ''}`}
          onClick={() => onAlignChange('justify')}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 ml-2">
        <Type className="h-4 w-4 text-muted-foreground" />
        <Select value={fontSize} onValueChange={onFontSizeChange}>
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
        <Select value={fontFamily} onValueChange={onFontFamilyChange}>
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
  );
}
