import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { Plus, Pencil, Trash2, Save, X, CornerDownRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '../components/Skeleton';
import React from 'react';
import './AdminNodes.css';

interface ChatNode {
  id: number;
  title: string;
  content: string;
  parentId: number | null;
}

const AdminNodes = ({ setToken }: { setToken?: (v: string | null) => void }) => {
  const [nodes, setNodes] = useState<ChatNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNode, setEditingNode] = useState<Partial<ChatNode> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNodes();
  }, [search]);

  const fetchNodes = async () => {
    try {
      const { data } = await api.get(`/admin/nodes${search ? `?search=${search}` : ''}`);
      setNodes(data);
    } catch (err) {
      toast.error('Erro ao carregar canais de atendimento.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingNode({ title: '', content: '', parentId: null });
    setIsModalOpen(true);
  };

  const handleEdit = (node: ChatNode) => {
    setEditingNode(node);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este canal e todos os seus subcanais?')) return;

    try {
      await api.delete(`/admin/nodes/${id}`);
      toast.success('Canal excluído com sucesso!');
      fetchNodes();
    } catch (err) {
      toast.error('Erro ao excluir canal.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNode) return;

    try {
      const promise = editingNode.id
        ? api.put(`/admin/nodes/${editingNode.id}`, editingNode)
        : api.post('/admin/nodes', editingNode);

      toast.promise(promise, {
        loading: editingNode.id ? 'Atualizando canal...' : 'Criando novo canal...',
        success: () => {
          setIsModalOpen(false);
          fetchNodes();
          return editingNode.id ? 'Canal atualizado!' : 'Canal criado com sucesso!';
        },
        error: 'Erro ao salvar canal.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout setToken={setToken}>
      <div className="admin-nodes-header">
        <div>
          <h2 className="admin-nodes-title">Gestão de Canais</h2>
          <p className="admin-nodes-subtitle">
            Organize a árvore de atendimento do chatbot
          </p>
        </div>

        <button onClick={handleCreate} className="admin-nodes-create-button">
          <Plus size={20} />
          Novo Canal
        </button>
      </div>

      <div className="admin-nodes-search-wrapper">
        <Search className="admin-nodes-search-icon" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
                    <td colSpan={4} className="admin-nodes-empty">
                      Nenhum canal encontrado.
                    </td>
                  </tr>
                ) : (
                  nodes.map((node) => (
                    <tr key={node.id} className="admin-nodes-table-row">
                      <td className="admin-nodes-expand-cell">
                        {node.parentId && (
                          <CornerDownRight className="admin-nodes-expand-icon" size={16} />
                        )}
                      </td>

                      <td className="admin-nodes-title-cell">
                        <span className="admin-nodes-node-title">{node.title}</span>
                        <span className="admin-nodes-node-id">#{node.id}</span>
                      </td>

                      <td className="admin-nodes-content-cell">
                        <p className="admin-nodes-content-preview">
                          {node.content || 'Sem resposta definida'}
                        </p>
                      </td>

                      <td className="admin-nodes-actions-cell">
                        <button
                          onClick={() => handleEdit(node)}
                          className="admin-nodes-edit-button"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(node.id)}
                          className="admin-nodes-delete-button"
                          title="Excluir"
                        >
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

              <button
                onClick={() => setIsModalOpen(false)}
                className="admin-nodes-close-button"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-nodes-form">
              <div className="admin-nodes-form-group">
                <label>Título do Canal</label>
                <input
                  type="text"
                  required
                  className="admin-nodes-form-input"
                  value={editingNode?.title || ''}
                  onChange={(e) =>
                    setEditingNode({ ...editingNode, title: e.target.value })
                  }
                  placeholder="Ex: Calendário Acadêmico"
                />
              </div>

              <div className="admin-nodes-form-group">
                <label>Pai (Subcanal de)</label>
                <select
                  className="admin-nodes-form-input"
                  value={editingNode?.parentId || ''}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      parentId: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                >
                  <option value="">Nenhum (Nó Raiz)</option>
                  {nodes
                    .filter((n) => n.id !== editingNode?.id)
                    .map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="admin-nodes-form-group">
                <label>Conteúdo do Canal (Resposta)</label>
                <textarea
                  className="admin-nodes-form-input admin-nodes-textarea"
                  value={editingNode?.content || ''}
                  onChange={(e) =>
                    setEditingNode({ ...editingNode, content: e.target.value })
                  }
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