
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
  XYPosition,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Node } from './Node';
import WhiteboardToolbar from './whiteboard/WhiteboardToolbar';
import { contentColors } from '@/lib/conversionUtils';

const nodeTypes = {
  custom: Node,
};

interface WhiteboardProps {
  nodes: any[];
  setNodes: (nodes: any[]) => void;
  edges: any[];
  setEdges: (edges: any[]) => void;
}

export default function Whiteboard({ nodes: initialNodes, setNodes: setParentNodes, edges: initialEdges, setEdges: setParentEdges }: WhiteboardProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Initialize with props when they change
  useEffect(() => {
    if (initialNodes && initialNodes.length > 0) {
      console.log("Updating whiteboard with new nodes:", initialNodes);
      setNodes(initialNodes);
    }
  }, [initialNodes, setNodes]);

  useEffect(() => {
    if (initialEdges && initialEdges.length > 0) {
      console.log("Updating whiteboard with new edges:", initialEdges);
      setEdges(initialEdges);
    }
  }, [initialEdges, setEdges]);

  const onConnect = useCallback((params: Connection) => {
    const newEdges = addEdge(params, edges);
    setEdges(newEdges);
    setParentEdges(newEdges);
  }, [edges, setEdges, setParentEdges]);

  const handleNodesChange = (changes: NodeChange[]) => {
    onNodesChange(changes);
    // Sync back to parent after changes are applied
    setTimeout(() => setParentNodes(nodes), 0);
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    onEdgesChange(changes);
    // Sync back to parent after changes are applied
    setTimeout(() => setParentEdges(edges), 0);
  };

  const onDoubleClick = (event: React.MouseEvent) => {
    // Create a new node at the click position
    if (!reactFlowWrapper.current || !reactFlowInstance) return;
    
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    addNewNode(position, 'default');
  };

  const addNewNode = (position: XYPosition, nodeType: string = 'default') => {
    const typeToLabelMap: Record<string, string> = {
      'idea': 'New idea',
      'question': 'New question?',
      'important': 'Important point!',
      'detail': 'New detail',
      'default': 'New thought'
    };

    const typeToColorMap: Record<string, string> = {
      'idea': contentColors.idea,
      'question': contentColors.question,
      'important': contentColors.important,
      'detail': contentColors.detail,
      'default': contentColors.default
    };

    const newNode = {
      id: `node_${Date.now()}`,
      type: 'custom',
      position,
      data: { 
        label: typeToLabelMap[nodeType] || 'New thought',
        color: typeToColorMap[nodeType] || contentColors.default
      },
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    setParentNodes(updatedNodes);
  };

  const handleAddNodeFromToolbar = (type: string) => {
    if (!reactFlowInstance) return;
    
    // Get the center of the viewport
    const { x, y } = reactFlowInstance.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    
    // Add some random offset to avoid stacking
    const position = {
      x: x + Math.random() * 100 - 50,
      y: y + Math.random() * 100 - 50,
    };
    
    addNewNode(position, type);
  };

  return (
    <div className="h-full w-full bg-gray-50 relative" ref={reactFlowWrapper}>
      <WhiteboardToolbar onAddNode={handleAddNodeFromToolbar} />
      <div className="h-full w-full" onDoubleClick={onDoubleClick}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
