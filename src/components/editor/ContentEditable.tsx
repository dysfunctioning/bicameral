
import { useEffect, RefObject } from "react";
import { fontSizeClasses, fontFamilyClasses } from "./editorUtils";

interface ContentEditableProps {
  text: string;
  paragraphAlignments: Record<number, string>;
  paragraphFontSizes?: Record<number, string>;
  fontSize: string;
  fontFamily: string;
  onChange: (text: string) => void;
  onParagraphChange: (index: number) => void;
  editableRef: RefObject<HTMLDivElement>;
}

export default function ContentEditable({
  text,
  paragraphAlignments,
  paragraphFontSizes = {},
  fontSize,
  fontFamily,
  onChange,
  onParagraphChange,
  editableRef
}: ContentEditableProps) {
  
  // Update editable content when text or alignments change
  useEffect(() => {
    updateEditableContent();
  }, [text, paragraphAlignments, paragraphFontSizes]);
  
  // Split text into paragraphs for rendering
  const paragraphs = text.split('\n');
  
  // Function to update the contentEditable without causing DOM issues
  const updateEditableContent = () => {
    if (!editableRef.current) return;
    
    // Save selection state if possible
    const selection = window.getSelection();
    let savedSelection = null;
    
    if (selection && selection.rangeCount > 0 && editableRef.current.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      savedSelection = {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
    }
    
    // Get the active element to check if we're focused
    const isEditorFocused = document.activeElement === editableRef.current || 
                           editableRef.current.contains(document.activeElement);
    
    // Only completely rebuild if not focused (to avoid cursor jumps while typing)
    if (!isEditorFocused) {
      // Clear and rebuild content
      editableRef.current.innerHTML = '';
      
      paragraphs.forEach((paragraph, index) => {
        const div = document.createElement('div');
        // Apply alignment
        div.style.textAlign = paragraphAlignments[index] || 'left';
        // Apply font size
        const paragraphFontSize = paragraphFontSizes[index] || fontSize;
        div.className = fontSizeClasses[paragraphFontSize as keyof typeof fontSizeClasses] || '';
        
        div.style.minHeight = '1em';
        div.style.padding = '0.25em 0';
        
        if (paragraph.trim() === '') {
          div.appendChild(document.createElement('br'));
        } else {
          div.textContent = paragraph;
        }
        
        editableRef.current?.appendChild(div);
      });
    } else {
      // If focused, just update alignments and font sizes without rebuilding
      const children = editableRef.current.childNodes;
      for (let i = 0; i < children.length; i++) {
        if (children[i] instanceof HTMLElement) {
          // Update alignment
          (children[i] as HTMLElement).style.textAlign = paragraphAlignments[i] || 'left';
          
          // Update font size
          const paragraphFontSize = paragraphFontSizes[i] || fontSize;
          const fontSizeClass = fontSizeClasses[paragraphFontSize as keyof typeof fontSizeClasses] || '';
          
          // Clear existing font size classes
          Object.values(fontSizeClasses).forEach(cls => {
            (children[i] as HTMLElement).classList.remove(cls);
          });
          
          // Add new font size class
          if (fontSizeClass) {
            (children[i] as HTMLElement).classList.add(fontSizeClass);
          }
        }
      }
    }
    
    // Try to restore cursor position if we were focused
    if (isEditorFocused && savedSelection && selection) {
      try {
        const newRange = document.createRange();
        
        // Find closest matching nodes after DOM update
        const findClosestNode = (original: Node) => {
          if (editableRef.current?.contains(original)) {
            return original; // Node still exists in DOM
          }
          
          // Try to find paragraph with same content
          const paragraphNodes = editableRef.current?.childNodes || [];
          for (let i = 0; i < paragraphNodes.length; i++) {
            if ((paragraphNodes[i] as HTMLElement).textContent === 
                (original.parentElement as HTMLElement)?.textContent) {
              return paragraphNodes[i].firstChild || paragraphNodes[i];
            }
          }
          
          // Fallback to paragraph at same index
          const currentParaIndex = onParagraphChange ? findCurrentParagraphIndex() : 0;
          return editableRef.current?.childNodes[currentParaIndex] || null;
        };
        
        const newStartContainer = findClosestNode(savedSelection.startContainer);
        const newEndContainer = findClosestNode(savedSelection.endContainer);
        
        if (newStartContainer && newEndContainer) {
          newRange.setStart(newStartContainer, Math.min(savedSelection.startOffset, 
                                                      newStartContainer.textContent?.length || 0));
          newRange.setEnd(newEndContainer, Math.min(savedSelection.endOffset, 
                                                  newEndContainer.textContent?.length || 0));
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      } catch (e) {
        console.log("Could not restore selection", e);
      }
    }
  };
  
  // Function to determine current paragraph based on selection
  const updateCurrentParagraph = () => {
    if (!editableRef.current) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    
    // Find the paragraph element that contains the cursor
    let paragraphElement = startNode;
    while (paragraphElement && paragraphElement.parentNode !== editableRef.current) {
      paragraphElement = paragraphElement.parentNode as Node;
      if (!paragraphElement) break;
    }
    
    if (paragraphElement) {
      // Count this element's position among siblings
      let index = 0;
      let sibling = paragraphElement.previousSibling;
      while (sibling) {
        index++;
        sibling = sibling.previousSibling;
      }
      
      onParagraphChange(index);
    }
  };
  
  // Utility to find current paragraph index
  const findCurrentParagraphIndex = (): number => {
    if (!editableRef.current) return 0;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;
    
    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    
    // Find the paragraph element that contains the cursor
    let paragraphElement = startNode;
    while (paragraphElement && paragraphElement.parentNode !== editableRef.current) {
      paragraphElement = paragraphElement.parentNode as Node;
      if (!paragraphElement) break;
    }
    
    if (paragraphElement) {
      // Count this element's position among siblings
      let index = 0;
      let sibling = paragraphElement.previousSibling;
      while (sibling) {
        index++;
        sibling = sibling.previousSibling;
      }
      
      return index;
    }
    
    return 0;
  };
  
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
