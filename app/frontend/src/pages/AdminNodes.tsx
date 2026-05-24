import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { Skeleton } from '../components/Skeleton';
import { useAdminNodes } from '../hooks/useAdminNodes';
import type { ChatNode } from '../types';
import './AdminNodes.css';

type ParentOption = ChatNode & {
  displayTitle: string;
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
            displayTitle: `${'— '.repeat(level)}${node.title}`,
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

  const renderNode = (node: ChatNode, level = 0) => {
    const children = (childrenByParentId.get(node.id) ?? []).filter((child) =>
      visibleNodeIds.has(child.id)
    );
    const hasChildren = children.length > 0;
    const isExpanded = normalizedSearch
      ? searchExpandedNodeIds.includes(node.id)
      : expandedNodeIds.includes(node.id);

    return (
      <div key={node.id} className="admin-nodes-tree-item">
        <div
          className="admin-nodes-tree-row"
          style={{ paddingLeft: `${16 + level * 28}px` }}
        >
          <button
            type="button"
            className="admin-nodes-tree-expand-button"
            onClick={() => hasChildren && toggleNode(node.id)}
            disabled={!hasChildren}
            title={hasChildren ? 'Expandir canal' : 'Sem subcanais'}
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
            onClick={() => hasChildren && toggleNode(node.id)}
            disabled={!hasChildren}
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
            <button
              onClick={() => openEditModal(node)}
              className="admin-nodes-edit-button"
              title="Editar"
              type="button"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={() => deleteNode(node.id)}
              className="admin-nodes-delete-button"
              title="Excluir"
              type="button"
            >
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

        <button onClick={openCreateModal} className="admin-nodes-create-button" type="button">
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

              <div className="admin-nodes-form-group">
                <label htmlFor="node-parent">Pai (Subcanal de)</label>
                <select
                  id="node-parent"
                  className="admin-nodes-form-input"
                  value={editingNode?.parentId ?? ''}
                  onChange={(event) =>
                    updateEditingNode({
                      parentId: event.target.value === '' ? null : Number(event.target.value),
                    })
                  }
                >
                  <option value="">Nenhum (Nó Raiz)</option>

                  {parentOptions.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.displayTitle}
                    </option>
                  ))}
                </select>
              </div>

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