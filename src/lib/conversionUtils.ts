
// Utility functions to convert between text and whiteboard formats

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { 
    label: string;
    color?: string;
    fontSize?: string;
    fontFamily?: string;
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

// Colors based on content analysis
export const contentColors = {
  question: "#D946EF", // Magenta Pink for questions
  important: "#F97316", // Bright Orange for important points
  idea: "#9b87f5", // Primary Purple for ideas
  detail: "#D3E4FD", // Soft Blue for details/facts
  default: "#F1F0FB", // Soft Gray as default
};

// Function to analyze text content and infer style properties
export function analyzeContent(text: string) {
  // Safety check
  if (!text || typeof text !== 'string') {
    return { color: contentColors.default };
  }

  // Convert to lowercase for easier comparison
  const lowerText = text.toLowerCase();
  
  // Check for question marks (questions)
  if (text.includes('?')) {
    return { color: contentColors.question };
  }
  
  // Check for important statements (exclamations or keywords)
  if (
    text.includes('!') || 
    lowerText.includes('important') || 
    lowerText.includes('critical') || 
    lowerText.includes('essential') ||
    lowerText.includes('key')
  ) {
    return { color: contentColors.important };
  }
  
  // Check for idea indicators
  if (
    lowerText.includes('idea') || 
    lowerText.includes('concept') || 
    lowerText.includes('maybe') || 
    lowerText.includes('perhaps') ||
    lowerText.includes('could')
  ) {
    return { color: contentColors.idea };
  }
  
  // Check for detail/fact indicators
  if (
    lowerText.includes('specifically') || 
    lowerText.includes('in fact') || 
    lowerText.includes('for example') || 
    lowerText.includes('e.g.') ||
    lowerText.includes('i.e.')
  ) {
    return { color: contentColors.detail };
  }
  
  // Default style
  return { color: contentColors.default };
}

export function convertToWhiteboard(text: string, fontSize?: string, fontFamily?: string): { nodes: Node[], edges: Edge[] } {
  // First check if the text is empty or undefined
  if (!text || text.trim() === '') {
    console.warn('No text provided for whiteboard conversion');
    return { nodes: [], edges: [] };
  }

  // Split into paragraphs and filter out empty lines
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');
  
  // If there are no non-empty lines, return empty arrays
  if (lines.length === 0) {
    console.warn('No non-empty lines found in the text');
    return { nodes: [], edges: [] };
  }
  
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Adaptive layout based on number of lines
  const centerX = 400;
  const centerY = 300;
  
  if (lines.length === 1) {
    // Single node centered
    const contentStyle = analyzeContent(lines[0]);
    nodes.push({
      id: 'node_1',
      type: 'custom',
      position: { x: centerX - 100, y: centerY },
      data: { 
        label: lines[0],
        color: contentStyle.color,
        fontSize: fontSize || 'medium',
        fontFamily: fontFamily || 'sans-serif'
      }
    });
  } else if (lines.length === 2) {
    // Two nodes side by side
    const firstStyle = analyzeContent(lines[0]);
    const secondStyle = analyzeContent(lines[1]);
    
    nodes.push({
      id: 'node_1',
      type: 'custom',
      position: { x: centerX - 150, y: centerY },
      data: { 
        label: lines[0],
        color: firstStyle.color,
        fontSize: fontSize || 'medium',
        fontFamily: fontFamily || 'sans-serif'
      }
    });
    
    nodes.push({
      id: 'node_2',
      type: 'custom',
      position: { x: centerX + 150, y: centerY },
      data: { 
        label: lines[1],
        color: secondStyle.color,
        fontSize: fontSize || 'medium',
        fontFamily: fontFamily || 'sans-serif'
      }
    });
    
    // Connect the two nodes
    edges.push({
      id: 'edge_1',
      source: 'node_1',
      target: 'node_2'
    });
  } else {
    // Multiple nodes in a circular layout
    const radius = Math.min(250, Math.max(150, lines.length * 20));
    
    lines.forEach((line, index) => {
      const angle = (index / lines.length) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const contentStyle = analyzeContent(line);
      const nodeId = `node_${index + 1}`;
      
      nodes.push({
        id: nodeId,
        type: 'custom',
        position: { x, y },
        data: { 
          label: line,
          color: contentStyle.color,
          fontSize: fontSize || 'medium',
          fontFamily: fontFamily || 'sans-serif'
        }
      });
      
      // Connect to previous node
      if (index > 0) {
        edges.push({
          id: `edge_${index}`,
          source: `node_${index}`,
          target: nodeId
        });
      }
    });
    
    // Close the loop for 3+ nodes
    if (lines.length > 2) {
      edges.push({
        id: 'edge_loop',
        source: `node_${lines.length}`,
        target: 'node_1'
      });
    }
  }
  
  console.log('Generated nodes:', nodes.length, 'Generated edges:', edges.length);
  return { nodes, edges };
}

export function convertToText(nodes: Node[], edges: Edge[]): string {
  // If no nodes, return empty string
  if (!nodes || nodes.length === 0) {
    return '';
  }
  
  // Sort nodes by their position to maintain original order
  const sortedNodes = [...nodes].sort((a, b) => {
    // First sort by Y position, then by X if Y is very close
    const yDiff = a.position.y - b.position.y;
    return Math.abs(yDiff) < 10 ? a.position.x - b.position.x : yDiff;
  });
  
  // Simple approach: just extract text from each node
  return sortedNodes
    .map(node => (node.data && node.data.label) ? node.data.label : '')
    .filter(label => label.trim() !== '')
    .join('\n');
}
