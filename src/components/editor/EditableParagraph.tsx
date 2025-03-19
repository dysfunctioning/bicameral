
import React from 'react';
import { fontSizeClasses } from './editorUtils';

interface EditableParagraphProps {
  content: string;
  index: number;
  alignment: string;
  fontSize: string;
}

const EditableParagraph = ({ 
  content, 
  index, 
  alignment, 
  fontSize 
}: EditableParagraphProps) => {
  const div = document.createElement('div');
  
  // Apply alignment
  div.style.textAlign = alignment || 'left';
  
  // Apply font size from the paragraph-specific fontSize prop
  const fontSizeClass = fontSizeClasses[fontSize as keyof typeof fontSizeClasses] || '';
  if (fontSizeClass) {
    div.className = fontSizeClass;
  }
  
  div.style.minHeight = '1em';
  div.style.padding = '0.25em 0';
  
  if (content.trim() === '') {
    div.appendChild(document.createElement('br'));
  } else {
    div.textContent = content;
  }
  
  return div;
};

export default EditableParagraph;
