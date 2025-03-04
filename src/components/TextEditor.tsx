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
  
  // Improved function to determine current paragraph based on selection
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
      
      if (index !== currentParagraphIndex) {
        setCurrentParagraphIndex(index);
      }
    }
  };
  
  // Update editable content when text or alignments change
  useEffect(() => {
    updateEditableContent();
  }, [text, paragraphAlignments]);
  
  const handleChange = (newText: string) => {
    setText(newText);
    // New paragraph detection will happen on the next render
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
        div.style.textAlign = paragraphAlignments[index] || 'left';
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
      // If focused, just update alignments without rebuilding
      const children = editableRef.current.childNodes;
      for (let i = 0; i < children.length; i++) {
        if (children[i] instanceof HTMLElement) {
          (children[i] as HTMLElement).style.textAlign = paragraphAlignments[i] || 'left';
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
          return editableRef.current?.childNodes[currentParagraphIndex] || null;
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
    handleChange(content);
    
    // Update current paragraph index since content may have changed
    updateCurrentParagraph();
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
        {/* Visible editable div with aligned paragraphs */}
        <div 
          ref={editableRef}
          className={`flex-1 p-4 ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]} ${fontFamilyClasses[fontFamily as keyof typeof fontFamilyClasses]}`}
          style={{ 
            fontFamily: fontFamily === 'sans' ? 'sans-serif' : fontFamily === 'serif' ? 'serif' : 'monospace',
            outline: 'none',
            overflowY: 'auto'
          }}
          contentEditable={true}
          onInput={handleEditableInput}
          onKeyUp={handleKeyUp}
          onClick={handleClick}
          onFocus={updateCurrentParagraph}
          suppressContentEditableWarning={true}
        />
        
        {/* You can keep the TextPreview if needed, or remove it */}
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