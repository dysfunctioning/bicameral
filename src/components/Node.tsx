
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

  return (
    <div 
      className="px-4 py-2 shadow-md rounded-md bg-white border border-gray-200"
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
          className="bg-transparent outline-none w-full resize-none text-center"
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
