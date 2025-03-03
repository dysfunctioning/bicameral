
// Utility functions to convert between text and whiteboard formats

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

export function convertToWhiteboard(text: string): { nodes: Node[], edges: Edge[] } {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Create nodes in a circular or grid layout
  const centerX = 400;
  const centerY = 300;
  const radius = 200;
  
  lines.forEach((line, index) => {
    // Position nodes in a circular layout
    const angle = (index / lines.length) * Math.PI * 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    nodes.push({
      id: `node_${index + 1}`,
      type: 'custom',
      position: { x, y },
      data: { label: line.trim() }
    });
    
    // Connect to previous node if not the first one
    if (index > 0) {
      edges.push({
        id: `edge_${index}`,
        source: `node_${index}`,
        target: `node_${index + 1}`
      });
    }
  });
  
  return { nodes, edges };
}

export function convertToText(nodes: Node[], edges: Edge[]): string {
  // Simple approach: just extract text from each node
  return nodes.map(node => node.data.label).join('\n');
  
  // For a more sophisticated approach, we could use the edges to determine
  // the hierarchical structure and convert to a proper document structure
}
