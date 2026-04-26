import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { Plus, Pencil, Trash2, Save, X, CornerDownRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '../components/Skeleton';
import React from 'react';

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
        error: 'Erro ao salvar canal.'
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout setToken={setToken}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Gestão de Canais</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Organize a árvore de atendimento do chatbot</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
        >
          <Plus size={20} />
          Novo Canal
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar canal por título..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 dark:text-white rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        {loading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Expandir</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Título do Canal</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Resumo do Conteúdo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {nodes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 italic">
                      Nenhum canal encontrado.
                    </td>
                  </tr>
                ) : (
                  nodes.map((node) => (
                    <tr key={node.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 w-20">
                        {node.parentId && <CornerDownRight size={16} className="text-gray-300 dark:text-gray-600 ml-4" />}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <span className="font-semibold text-gray-700 dark:text-gray-200 block truncate">{node.title}</span>
                        <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded font-mono">#{node.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 italic">
                          {node.content || 'Sem resposta definida'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(node)}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(node.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
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

      {/* Modal / SideDrawer for Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl animate-slide-in p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingNode?.id ? 'Editar Canal' : 'Novo Canal'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Título do Canal</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  value={editingNode?.title || ''}
                  onChange={(e) => setEditingNode({ ...editingNode, title: e.target.value })}
                  placeholder="Ex: Calendário Acadêmico"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Pai (Subcanal de)</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  value={editingNode?.parentId || ''}
                  onChange={(e) => setEditingNode({ ...editingNode, parentId: e.target.value === '' ? null : Number(e.target.value) })}
                >
                  <option value="">Nenhum (Nó Raiz)</option>
                  {nodes.filter(n => n.id !== editingNode?.id).map((n) => (
                    <option key={n.id} value={n.id}>{n.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Conteúdo do Canal (Resposta)</label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none min-h-[150px]"
                  value={editingNode?.content || ''}
                  onChange={(e) => setEditingNode({ ...editingNode, content: e.target.value })}
                  placeholder="Explique o que acontece ao clicar neste canal..."
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 transition-all active:scale-95"
                >
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
