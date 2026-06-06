import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { Skeleton } from '../components/Skeleton';
import { useAdminNodes } from '../hooks/useAdminNodes';
import type { ChatNode } from '../types';
import './AdminNodes.css';

type ParentOption = ChatNode & {
  displayTitle: string;
  level: number;
};
const AdminNodes = ({ setToken }: { setToken?: (value: string | null) => void }) => {
  const {
    nodes,
    loading,
    editingNode,
    setEditingNode,
    isModalOpen,
    openCreateModal,
    openEditModal,
    closeModal,
    deleteNode,
    saveNode,
  } = useAdminNodes();

  const [expandedNodeIds, setExpandedNodeIds] = useState<number[]>([]);
  const [treeSearch, setTreeSearch] = useState('');
 const [selectedNodeIds, setSelectedNodeIds] = useState<Set<number>>(new Set());
 const [parentOpen, setParentOpen] = useState(false);
const [parentQuery, setParentQuery] = useState('');
  const updateEditingNode = (changes: Partial<ChatNode>) => {
    setEditingNode({ ...editingNode, ...changes });
  };

  const childrenByParentId = useMemo(() => {
    const map = new Map<number | null, ChatNode[]>();

    nodes.forEach((node) => {
      const parentId = node.parentId ?? null;
      const children = map.get(parentId) ?? [];

      children.push(node);
      map.set(parentId, children);
    });

    return map;
  }, [nodes]);

  const rootNodes = useMemo(() => {
    return childrenByParentId.get(null) ?? [];
  }, [childrenByParentId]);

  const normalizedSearch = treeSearch.trim().toLowerCase();

  const nodeMatchesSearch = (node: ChatNode) => {
    if (!normalizedSearch) {
      return true;
    }
    return (
      node.title.toLowerCase().includes(normalizedSearch) ||
      (node.content || '').toLowerCase().includes(normalizedSearch) ||
      String(node.id).includes(normalizedSearch)
    );
  };

  const visibleNodeIds = useMemo(() => {
    const visibleIds = new Set<number>();

    if (!normalizedSearch) {
      nodes.forEach((node) => visibleIds.add(node.id));
      return visibleIds;
    }

    const addNodeAndParents = (node: ChatNode) => {
      visibleIds.add(node.id);

      if (node.parentId != null) {
        const parent = nodes.find((item) => item.id === node.parentId);

        if (parent) {
          addNodeAndParents(parent);
        }
      }
    };

    nodes.forEach((node) => {
      const matches =
        node.title.toLowerCase().includes(normalizedSearch) ||
        (node.content || '').toLowerCase().includes(normalizedSearch) ||
        String(node.id).includes(normalizedSearch);

      if (matches) {
        addNodeAndParents(node);
      }
    });

    return visibleIds;
  }, [nodes, normalizedSearch]);

  const searchExpandedNodeIds = useMemo(() => {
    if (!normalizedSearch) {
      return expandedNodeIds;
    }

    const idsToExpand = new Set<number>();

    nodes.forEach((node) => {
      if (visibleNodeIds.has(node.id) && node.parentId != null) {
        idsToExpand.add(node.parentId);
      }
    });

    return Array.from(idsToExpand);
  }, [nodes, visibleNodeIds, normalizedSearch, expandedNodeIds]);

  const blockedParentIds = useMemo(() => {
    const blockedIds = new Set<number>();

    if (!editingNode?.id) {
      return blockedIds;
    }

    const collectDescendants = (nodeId: number) => {
      const children = childrenByParentId.get(nodeId) ?? [];

      children.forEach((child) => {
        blockedIds.add(child.id);
        collectDescendants(child.id);
      });
    };

    blockedIds.add(editingNode.id);
    collectDescendants(editingNode.id);

    return blockedIds;
  }, [childrenByParentId, editingNode?.id]);

  const parentOptions = useMemo(() => {
    const buildOptions = (parentId: number | null = null, level = 0): ParentOption[] => {
      const children = childrenByParentId.get(parentId) ?? [];

      return children
        .filter((node) => !blockedParentIds.has(node.id))
        .flatMap((node) => [
          {
  ...node,
  level,
  displayTitle: node.title,
},
          ...buildOptions(node.id, level + 1),
        ]);
    };

    return buildOptions();
  }, [childrenByParentId, blockedParentIds]);

  const toggleNode = (nodeId: number) => {
    setExpandedNodeIds((current) =>
      current.includes(nodeId)
        ? current.filter((id) => id !== nodeId)
        : [...current, nodeId]
    );
  };
  
const isDescendantOfSelected = (node: ChatNode): boolean => {
  if (selectedNodeIds.size === 0) return false;
  if (node.parentId !== null && selectedNodeIds.has(node.parentId)) return true;
  const parent = nodes.find(n => n.id === node.parentId);
  return parent ? isDescendantOfSelected(parent) : false;
};

const renderNode = (node: ChatNode, level = 0) => {
  const children = (childrenByParentId.get(node.id) ?? []).filter((child) =>
    visibleNodeIds.has(child.id)
  );
  const hasChildren = children.length > 0;
  const isExpanded = normalizedSearch
    ? searchExpandedNodeIds.includes(node.id)
    : expandedNodeIds.includes(node.id);

  const isSelected = selectedNodeIds.has(node.id) || isDescendantOfSelected(node);

  const handleSelect = () => {
    setSelectedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });
  };

  return (
    <div key={node.id} className="admin-nodes-tree-item">
      <div
        className="admin-nodes-tree-row"
        style={{
  paddingLeft: `${16 + level * 28}px`,
  position: 'relative',
  ...(selectedNodeIds.has(node.id) && hasChildren ? {
  background: `linear-gradient(to right, transparent ${level === 0 ? 4 : (16 + level * 28) - 4}px, rgba(178, 0, 0, 0.06) ${level === 0 ? 4 : (16 + level * 28) - 4}px)`,
} : {}),
}}>
       {isSelected && (
<div style={{
  position: 'absolute',
  left: level === 0 ? '0px' : `${(16 + level * 28) - 8}px`,
  top: 0,
  bottom: 0,
  width: '4px',
  backgroundColor: '#b20000',
  borderRadius: '0 2px 2px 0',
}} />
)}

        <button
  type="button"
  className="admin-nodes-tree-expand-button"
  onClick={() => {
  handleSelect();
}}

onDoubleClick={() => {
  if (hasChildren) {
    toggleNode(node.id);
  }
}}
  disabled={!hasChildren}
  title={hasChildren ? 'Expandir canal' : 'Sem subcanais'}
  style={hasChildren ? { color: isExpanded ? 'inherit' : '#b20000' } : {}}
>
          {hasChildren ? (
            isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
          ) : (
            <span className="admin-nodes-tree-empty-icon" />
          )}
        </button>

        <button
          type="button"
          className="admin-nodes-tree-content-button"
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) toggleNode(node.id);
            handleSelect();
          }}
          title={hasChildren ? 'Clique para expandir' : 'Este canal não possui subcanais'}
        >
          <div className="admin-nodes-title-cell">
            <span className="admin-nodes-node-title">{node.title}</span>
            <span className="admin-nodes-node-id">#{node.id}</span>
          </div>
          <p className="admin-nodes-content-preview">
            {node.content || 'Sem resposta definida'}
          </p>
        </button>

        <div className="admin-nodes-actions-cell">
          <button onClick={() => openCreateModal(node.id)} className="admin-nodes-edit-button" title="Criar filho" type="button">
            <Plus size={20} />
          </button>
          <button onClick={() => openEditModal(node)} className="admin-nodes-edit-button" title="Editar" type="button">
            <Pencil size={18} />
          </button>
          <button onClick={() => deleteNode(node.id)} className="admin-nodes-delete-button" title="Excluir" type="button">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {isExpanded && children.map((child) => renderNode(child, level + 1))}
    </div>
  );
};

  return (
    <AdminLayout setToken={setToken}>
      <div className="admin-nodes-header">
        <div>
          <h2 className="admin-nodes-title">Gestão de Canais</h2>
          <p className="admin-nodes-subtitle">Organize a árvore de atendimento do chatbot</p>
        </div>

        <button onClick={() => openCreateModal()} className="admin-nodes-create-button" type="button">
          <Plus size={20} />
          NOVO CANAL
        </button>
        
      </div>

      <div className="admin-nodes-search-wrapper">
        <Search className="admin-nodes-search-icon" size={18} />
        <input
          type="text"
          value={treeSearch}
          onChange={(event) => setTreeSearch(event.target.value)}
          placeholder="Buscar canal por título..."
          className="admin-nodes-search-input"
        />
      </div>

      <div className="admin-nodes-card">
        {loading ? (
          <div className="admin-nodes-skeleton-wrapper">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="admin-nodes-tree-wrapper">
            {rootNodes.filter((node) => visibleNodeIds.has(node.id)).length === 0 ? (
              <div className="admin-nodes-empty">Nenhum canal encontrado.</div>
            ) : (
              rootNodes
                .filter((node) => visibleNodeIds.has(node.id))
                .map((node) => renderNode(node))
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-nodes-modal-overlay">
          <div className="admin-nodes-drawer">
            <div className="admin-nodes-modal-header">
              <h3 className="admin-nodes-modal-title">
                {editingNode?.id ? 'Editar Canal' : 'Novo Canal'}
              </h3>

              <button onClick={closeModal} className="admin-nodes-close-button" type="button">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={saveNode} className="admin-nodes-form">
              <div className="admin-nodes-form-group">
                <label htmlFor="node-title">Título do Canal</label>
                <input
                  id="node-title"
                  type="text"
                  required
                  className="admin-nodes-form-input"
                  value={editingNode?.title || ''}
                  onChange={(event) => updateEditingNode({ title: event.target.value })}
                  placeholder="Ex: Calendário Acadêmico"
                />
              </div>

    
              {/*<div className="admin-nodes-form-group">
  <label>Pai (Subcanal de)</label>
  <div style={{ position: 'relative' }}>
    <button
      type="button"
      className="admin-nodes-form-input"
      onClick={() => setParentOpen(v => !v)}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {parentOptions.find(o => o.id === editingNode?.parentId)?.displayTitle ?? 'Nenhum (Nó Raiz)'}
      </span>
      <ChevronDown size={16} style={{ flexShrink: 0, marginLeft: 8, color: '#b20000', transform: parentOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
    </button>

    {parentOpen && (
      <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', border: '1px solid #b20000', borderRadius: 12, boxShadow: '0 4px 16px rgba(178,0,0,0.08)', zIndex: 100, overflow: 'hidden' }}>
        <div style={{ padding: 8, borderBottom: '2px solid #b20000', position: 'relative'}}>
          <Search size={14} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#b20000' }} />
          <input
            autoFocus
            type="text"
            value={parentQuery}
            onChange={e => setParentQuery(e.target.value)}
            placeholder="Buscar canal..."
            style={{ width: '100%', padding: '7px 10px 7px 30px', background: 'transparent', border: 'none', fontSize: 13, outline: 'none', color: '#111827' }}
          />
        </div>
        <div style={{ maxHeight: 440, overflowY: 'auto' }}>
          {[{ id: null, displayTitle: 'Nenhum (Nó Raiz)', level: 0 }, ...parentOptions]
            .filter(o => !parentQuery || o.displayTitle.toLowerCase().includes(parentQuery.toLowerCase()))
           .map(opt => (
  <div
    key={String(opt.id)}
    onClick={() => {
      updateEditingNode({ parentId: opt.id });
      setParentOpen(false);
      setParentQuery('');
    }}
    style={{
      padding: '10px 12px',
      paddingLeft: `${12 + ((opt.level ?? 0) * 18)}px`,
      fontSize: 13,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,

      borderLeft:
        opt.id === (editingNode?.parentId ?? null)
          ? '3px solid #b20000'
          : (opt.level ?? 0) > 0
          ? '1px solid #e5e7eb'
          : '3px solid transparent',

      background:
        opt.id === (editingNode?.parentId ?? null)
          ? 'rgba(178,0,0,0.04)'
          : undefined,

      transition: 'all .12s ease',

      color:
        opt.id === (editingNode?.parentId ?? null)
          ? '#b20000'
          : (opt.level ?? 0) === 0
          ? '#111827'
          : (opt.level ?? 0) === 1
          ? '#1f2937'
          : '#4b5563',

      fontWeight:
        opt.id === (editingNode?.parentId ?? null)
          ? 700
          : (opt.level ?? 0) === 0
          ? 700
          : (opt.level ?? 0) === 1
          ? 600
          : 400,
    }}
    onMouseEnter={e => {
      if (opt.id !== (editingNode?.parentId ?? null)) {
        e.currentTarget.style.background = '#fef2f2';
      }
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background =
        opt.id === (editingNode?.parentId ?? null)
          ? 'rgba(178,0,0,0.04)'
          : '';
    }}
  >
    {(opt.level ?? 0) > 0 && (
      <div
        style={{
          width: 10,
          height: 1,
          background: '#d1d5db',
          flexShrink: 0,
        }}
      />
    )}

    <span
      style={{
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {opt.title}
    </span>

    {opt.id != null && (
      <span
        style={{
          fontSize: 10,
          background:
            opt.id === (editingNode?.parentId ?? null)
              ? 'rgba(178,0,0,0.1)'
              : '#f3f4f6',

          color:
            opt.id === (editingNode?.parentId ?? null)
              ? '#b20000'
              : '#9ca3af',

          padding: '1px 5px',
          borderRadius: 4,
          fontFamily: 'monospace',
        }}
      >
        #{opt.id}
      </span>
    )}
  </div>
))}
        </div>
      </div>
           )}
  </div>
</div> {/* FECHA admin-nodes-form-group */}
<div className="admin-nodes-form-group">
                <label htmlFor="node-content">Conteúdo do Canal (Resposta)</label>
                <textarea
                  id="node-content"
                  className="admin-nodes-form-input admin-nodes-textarea"
                  value={editingNode?.content || ''}
                  onChange={(event) => updateEditingNode({ content: event.target.value })}
                  placeholder="Explique o que acontece ao clicar neste canal..."
                />
              </div>

<div className="admin-nodes-submit-wrapper">
  <button type="submit" className="admin-nodes-save-button">
    <Save size={20} />
    Salvar Canal
  </button>
</div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};  

export default AdminNodes;