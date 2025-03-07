
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface WhiteboardToolbarProps {
  onAddNode: (type: string) => void;
}

export default function WhiteboardToolbar({ onAddNode }: WhiteboardToolbarProps) {
  return (
    <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-md shadow-md flex gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onAddNode('idea')}
        className="flex items-center gap-1"
      >
        <PlusCircle className="h-4 w-4" />
        <span>Idea</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onAddNode('question')}
        className="flex items-center gap-1"
      >
        <PlusCircle className="h-4 w-4" />
        <span>Question</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onAddNode('important')}
        className="flex items-center gap-1"
      >
        <PlusCircle className="h-4 w-4" />
        <span>Important</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onAddNode('detail')}
        className="flex items-center gap-1"
      >
        <PlusCircle className="h-4 w-4" />
        <span>Detail</span>
      </Button>
    </div>
  );
}
