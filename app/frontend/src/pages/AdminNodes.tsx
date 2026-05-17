import { CornerDownRight, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { Skeleton } from '../components/Skeleton';
import { useAdminNodes } from '../hooks/useAdminNodes';
import type { ChatNode } from '../types';
import './AdminNodes.css';

const AdminNodes = ({ setToken }: { setToken?: (value: string | null) => void }) => {
  const {
    nodes,
    loading,
    editingNode,
    setEditingNode,
    isModalOpen,
    search,
    setSearch,
    openCreateModal,
    openEditModal,
    closeModal,
    deleteNode,
    saveNode,
  } = useAdminNodes();

  const updateEditingNode = (changes: Partial<ChatNode>) => {
    setEditingNode({ ...editingNode, ...changes });
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
          Novo Canal
        </button>
      </div>

      <div className="admin-nodes-search-wrapper">
        <Search className="admin-nodes-search-icon" size={18} />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
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
          <div className="admin-nodes-table-wrapper">
            <table className="admin-nodes-table">
              <thead>
                <tr className="admin-nodes-table-head-row">
                  <th>Expandir</th>
                  <th>Título do Canal</th>
                  <th>Resumo do Conteúdo</th>
                  <th className="admin-nodes-actions-head">Ações</th>
                </tr>
              </thead>

              <tbody>
                {nodes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="admin-nodes-empty">Nenhum canal encontrado.</td>
                  </tr>
                ) : (
                  nodes.map((node) => (
                    <tr key={node.id} className="admin-nodes-table-row">
                      <td className="admin-nodes-expand-cell">
                        {node.parentId && <CornerDownRight className="admin-nodes-expand-icon" size={16} />}
                      </td>

                      <td className="admin-nodes-title-cell">
                        <span className="admin-nodes-node-title">{node.title}</span>
                        <span className="admin-nodes-node-id">#{node.id}</span>
                      </td>

                      <td className="admin-nodes-content-cell">
                        <p className="admin-nodes-content-preview">{node.content || 'Sem resposta definida'}</p>
                      </td>

                      <td className="admin-nodes-actions-cell">
                        <button onClick={() => openEditModal(node)} className="admin-nodes-edit-button" title="Editar" type="button">
                          <Pencil size={18} />
                        </button>

                        <button onClick={() => deleteNode(node.id)} className="admin-nodes-delete-button" title="Excluir" type="button">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
                  value={editingNode?.parentId || ''}
                  onChange={(event) =>
                    updateEditingNode({ parentId: event.target.value === '' ? null : Number(event.target.value) })
                  }
                >
                  <option value="">Nenhum (Nó Raiz)</option>
                  {nodes
                    .filter((node) => node.id !== editingNode?.id)
                    .map((node) => (
                      <option key={node.id} value={node.id}>{node.title}</option>
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
