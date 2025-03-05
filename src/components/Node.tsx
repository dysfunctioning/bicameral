
import { useState, ChangeEvent } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export function Node({ data, isConnectable }: NodeProps) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLabel(e.target.value);
    data.label = e.target.value;
  };

  const handleBlur = () => {
    setEditing(false);
  };

  // Get background color from data or use default
  const backgroundColor = data.color || '#F1F0FB';
  
  // Determine text color based on background brightness
  const getTextColor = (bgColor: string) => {
    // For simplicity, we'll just check if it's a dark purple or magenta
    if (bgColor === '#9b87f5' || bgColor === '#D946EF' || bgColor === '#F97316') {
      return 'text-white';
    }
    return 'text-gray-800';
  };
  
  const textColorClass = getTextColor(backgroundColor);
  
  // Font styling
  const fontSizeClass = data.fontSize || 'text-base';
  const fontFamilyClass = data.fontFamily || 'font-sans';

  return (
    <div 
      className={`px-4 py-2 shadow-md rounded-md border border-gray-200 ${fontSizeClass} ${fontFamilyClass} ${textColorClass}`}
      style={{ backgroundColor }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      
      {editing ? (
        <textarea
          className={`bg-transparent outline-none w-full resize-none text-center ${textColorClass}`}
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <div className="text-center font-medium">{label}</div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
    </div>
  );
}
