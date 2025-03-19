
/**
 * Utility functions for handling text selection in contentEditable elements
 */

// Interface for saved selection state
export interface SavedSelection {
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
}

// Save the current selection state
export const saveSelection = (): SavedSelection | null => {
  const selection = window.getSelection();
  
  if (!selection || selection.rangeCount === 0) return null;
  
  const range = selection.getRangeAt(0);
  return {
    startContainer: range.startContainer,
    startOffset: range.startOffset,
    endContainer: range.endContainer,
    endOffset: range.endOffset
  };
};

// Restore a previously saved selection
export const restoreSelection = (
  savedSelection: SavedSelection | null, 
  editableRef: React.RefObject<HTMLDivElement>
): boolean => {
  if (!savedSelection || !editableRef.current) return false;
  
  try {
    const selection = window.getSelection();
    if (!selection) return false;
    
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
      
      // Fallback to first paragraph
      return editableRef.current?.firstChild || null;
    };
    
    const newStartContainer = findClosestNode(savedSelection.startContainer);
    const newEndContainer = findClosestNode(savedSelection.endContainer);
    
    if (newStartContainer && newEndContainer) {
      newRange.setStart(
        newStartContainer, 
        Math.min(savedSelection.startOffset, newStartContainer.textContent?.length || 0)
      );
      newRange.setEnd(
        newEndContainer, 
        Math.min(savedSelection.endOffset, newEndContainer.textContent?.length || 0)
      );
      selection.removeAllRanges();
      selection.addRange(newRange);
      return true;
    }
  } catch (e) {
    console.log("Could not restore selection", e);
  }
  
  return false;
};

// Find current paragraph index based on cursor position
export const findCurrentParagraphIndex = (
  editableRef: React.RefObject<HTMLDivElement>
): number => {
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
