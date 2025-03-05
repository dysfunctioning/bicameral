
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
const contentColors = {
  question: "#D946EF", // Magenta Pink for questions
  important: "#F97316", // Bright Orange for important points
  idea: "#9b87f5", // Primary Purple for ideas
  detail: "#D3E4FD", // Soft Blue for details/facts
  default: "#F1F0FB", // Soft Gray as default
};

// Function to analyze text content and infer style properties
function analyzeContent(text: string) {
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
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Create nodes in a circular layout
  const centerX = 400;
  const centerY = 300;
  const radius = Math.min(200, Math.max(150, lines.length * 15));
  
  lines.forEach((line, index) => {
    // Position nodes in a circular layout
    const angle = (index / lines.length) * Math.PI * 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    // Analyze content for styling
    const contentStyle = analyzeContent(line.trim());
    
    nodes.push({
      id: `node_${index + 1}`,
      type: 'custom',
      position: { x, y },
      data: { 
        label: line.trim(),
        color: contentStyle.color,
        fontSize,
        fontFamily
      }
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
