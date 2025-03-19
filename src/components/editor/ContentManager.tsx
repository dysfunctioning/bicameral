
import React from 'react';
import { fontSizeClasses } from './editorUtils';
import { SavedSelection } from './selectionUtils';

interface UpdateContentOptions {
  editableRef: React.RefObject<HTMLDivElement>;
  paragraphs: string[];
  paragraphAlignments: Record<number, string>;
  paragraphFontSizes: Record<number, string>;
  fontSize: string;
  savedSelection: SavedSelection | null;
  isEditorFocused: boolean;
}

export const updateEditableContent = ({
  editableRef,
  paragraphs,
  paragraphAlignments,
  paragraphFontSizes,
  fontSize,
  savedSelection,
  isEditorFocused
}: UpdateContentOptions): void => {
  if (!editableRef.current) return;
  
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
};
