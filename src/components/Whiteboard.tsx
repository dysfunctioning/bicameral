
import { useCallback } from 'react';
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
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Node } from './Node';

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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => {
    const newEdges = addEdge(params, edges);
    setEdges(newEdges);
    setParentEdges(newEdges);
  }, [edges, setEdges, setParentEdges]);

  const handleNodesChange = (changes: NodeChange[]) => {
    onNodesChange(changes);
    setParentNodes(nodes);
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    onEdgesChange(changes);
    setParentEdges(edges);
  };

  const onDoubleClick = (event: React.MouseEvent) => {
    // Create a new node at the click position
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode = {
      id: `node_${nodes.length + 1}`,
      type: 'custom',
      position,
      data: { label: 'New thought' },
    };

    setNodes([...nodes, newNode]);
    setParentNodes([...nodes, newNode]);
  };

  return (
    <div className="h-full bg-gray-50" onDoubleClick={onDoubleClick}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
