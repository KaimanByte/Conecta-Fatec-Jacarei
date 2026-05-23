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
      {nodes.map((node, index) => (
        <button
          key={node.id}
          onClick={() => onSelect(node)}
          disabled={loading}
          className="node-button"
          type="button"
          style={{ '--delay': `${0.08 + index * 0.05}s` } as React.CSSProperties}
        >
          {node.title}
        </button>
      ))}
    </div>
  );
}
