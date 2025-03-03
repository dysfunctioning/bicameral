
import { useState } from "react";

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
}

export default function TextEditor({ text, setText }: TextEditorProps) {
  return (
    <div className="h-full p-4 bg-white">
      <textarea
        className="w-full h-full p-4 focus:outline-none resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing your content here..."
      />
    </div>
  );
}
