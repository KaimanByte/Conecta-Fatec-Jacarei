import type { ChatNode } from '../../types';

interface ChatOptionsProps {
  nodes: ChatNode[];
  loading: boolean;
  onSelect: (node: ChatNode) => void;
}

export default function ChatOptions({ nodes, loading, onSelect }: ChatOptionsProps) {
  if (!nodes.length) return null;

  return (
    <div className="nodes-grid">
      {nodes.map((node) => (
        <button
          key={node.id}
          onClick={() => onSelect(node)}
          disabled={loading}
          className="node-button"
          type="button"
        >
          {node.title}
        </button>
      ))}
    </div>
  );
}
