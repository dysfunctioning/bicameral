
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Change } from "@/components/ChangeTrackingPane";

export function useChangeTracker(text: string, changeTrackingEnabled: boolean) {
  const [changes, setChanges] = useState<Change[]>([]);
  const [lastText, setLastText] = useState("");
  const [textHistory, setTextHistory] = useState<{id: string, text: string}[]>([]);

  // For demo purposes, we'll use a fake user
  const currentUser = "Current User";

  useEffect(() => {
    if (lastText === "" && text !== "") {
      setLastText(text);
    }
  }, [text, lastText]);

  // Track change if change tracking is enabled and text has changed
  useEffect(() => {
    if (changeTrackingEnabled && lastText !== text && lastText !== "") {
      // Only create a change if text has been idle for 1 second
      // This prevents creating a change for every keystroke
      const timeoutId = setTimeout(() => {
        const diff = findTextDifference(lastText, text);
        if (diff) {
          const changeId = uuidv4();
          const newChange: Change = {
            id: changeId,
            text: diff,
            author: currentUser,
            timestamp: new Date(),
            comment: "",
            status: "pending"
          };
          
          // Store the text state before this change
          setTextHistory(prev => [...prev, {id: changeId, text: lastText}]);
          
          setChanges(prev => [newChange, ...prev]);
          setLastText(text);
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [text, lastText, changeTrackingEnabled]);

  const findTextDifference = (oldText: string, newText: string): string => {
    // Simple implementation: if old text is empty, consider all new text as a change
    if (!oldText) return newText;
    
    // Compare paragraph by paragraph
    const oldParagraphs = oldText.split('\n');
    const newParagraphs = newText.split('\n');
    
    // Find added or modified paragraphs
    const changedParagraphs: string[] = [];
    
    const maxLength = Math.max(oldParagraphs.length, newParagraphs.length);
    
    for (let i = 0; i < maxLength; i++) {
      const oldParagraph = oldParagraphs[i] || '';
      const newParagraph = newParagraphs[i] || '';
      
      if (oldParagraph !== newParagraph) {
        changedParagraphs.push(newParagraph);
      }
    }
    
    return changedParagraphs.join('\n');
  };

  const handleAcceptChange = (id: string) => {
    setChanges(prev => 
      prev.map(change => 
        change.id === id ? { ...change, status: "accepted" } : change
      )
    );
    
    // Remove this change from history since it's accepted
    setTextHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleRejectChange = (id: string) => {
    // Find the previous text state for this change
    const previousState = textHistory.find(item => item.id === id);
    
    if (previousState) {
      // Return the text to be set to its previous state
      setLastText(previousState.text);
      setTextHistory(prev => prev.filter(item => item.id !== id));
      return previousState.text;
    }
    
    setChanges(prev => 
      prev.map(change => 
        change.id === id ? { ...change, status: "rejected" } : change
      )
    );
    
    return null;
  };

  const handleAddComment = (id: string, comment: string) => {
    setChanges(prev => 
      prev.map(change => 
        change.id === id ? { ...change, comment } : change
      )
    );
  };

  return {
    changes,
    handleAcceptChange,
    handleRejectChange,
    handleAddComment
  };
}
