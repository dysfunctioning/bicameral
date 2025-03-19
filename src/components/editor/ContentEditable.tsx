
import { useEffect, RefObject } from "react";
import { fontFamilyClasses } from "./editorUtils";
import { updateEditableContent } from "./ContentManager";
import { saveSelection, findCurrentParagraphIndex } from "./selectionUtils";

interface ContentEditableProps {
  text: string;
  paragraphAlignments: Record<number, string>;
  paragraphFontSizes: Record<number, string>;
  fontSize: string;
  fontFamily: string;
  onChange: (text: string) => void;
  onParagraphChange: (index: number) => void;
  editableRef: RefObject<HTMLDivElement>;
}

export default function ContentEditable({
  text,
  paragraphAlignments,
  paragraphFontSizes,
  fontSize,
  fontFamily,
  onChange,
  onParagraphChange,
  editableRef
}: ContentEditableProps) {
  
  // Update editable content when text, alignments, or font sizes change
  useEffect(() => {
    // Save selection state if possible
    const selection = window.getSelection();
    let savedSelection = null;
    
    if (selection && selection.rangeCount > 0 && editableRef.current?.contains(selection.anchorNode)) {
      savedSelection = saveSelection();
    }
    
    // Get the active element to check if we're focused
    const isEditorFocused = document.activeElement === editableRef.current || 
                           editableRef.current?.contains(document.activeElement);
    
    // Split text into paragraphs for rendering
    const paragraphs = text.split('\n');
    
    // Update the content
    updateEditableContent({
      editableRef,
      paragraphs,
      paragraphAlignments,
      paragraphFontSizes,
      fontSize,
      savedSelection,
      isEditorFocused
    });
  }, [text, paragraphAlignments, paragraphFontSizes, fontSize, editableRef]);
  
  // Update the current paragraph when cursor position changes
  const updateCurrentParagraph = () => {
    const index = findCurrentParagraphIndex(editableRef);
    onParagraphChange(index);
  };
  
  // Handle changes to the editable content
  const handleEditableInput = () => {
    if (!editableRef.current) return;
    
    // Capture content as paragraphs
    const content = Array.from(editableRef.current.childNodes)
      .map(node => {
        // Get text content, falling back to empty string if there's just a <br>
        return (node as HTMLElement).textContent || '';
      })
      .join('\n');
    
    // Update text state
    onChange(content);
    
    // Update current paragraph index since content may have changed
    updateCurrentParagraph();
  };
  
  return (
    <div 
      ref={editableRef}
      className={`flex-1 p-4 ${fontFamilyClasses[fontFamily as keyof typeof fontFamilyClasses]}`}
      style={{ 
        fontFamily: fontFamily === 'sans' ? 'sans-serif' : fontFamily === 'serif' ? 'serif' : 'monospace',
        outline: 'none',
        overflowY: 'auto'
      }}
      contentEditable={true}
      onInput={handleEditableInput}
      onKeyUp={updateCurrentParagraph}
      onClick={updateCurrentParagraph}
      onFocus={updateCurrentParagraph}
      suppressContentEditableWarning={true}
    />
  );
}
