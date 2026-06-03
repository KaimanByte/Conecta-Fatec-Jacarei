import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { adminNodeService, type NodeFormData } from '../services/adminNodeService';
import type { ChatNode } from '../types';

export function useAdminNodes() {
  const [nodes, setNodes] = useState<ChatNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNode, setEditingNode] = useState<Partial<ChatNode> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const loadNodes = async () => {
    setLoading(true);

    try {
      const nodeList = await adminNodeService.list(search);
      setNodes(nodeList);
    } catch {
      toast.error('Erro ao carregar canais de atendimento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNodes();
  }, [search]);

  const openCreateModal = (id?: number | unknown) => {
    const parentId = typeof id === 'number' ? id : null;

    setEditingNode({ title: '', content: '', parentId });
    setIsModalOpen(true);
  };

  const openEditModal = (node: ChatNode) => {
    setEditingNode(node);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const deleteNode = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este canal e todos os seus subcanais?')) return;

    try {
      await adminNodeService.remove(id);
      toast.success('Canal excluído com sucesso!');
      loadNodes();
    } catch {
      toast.error('Erro ao excluir canal.');
    }
  };

  const saveNode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingNode) return;

    const nodeData: NodeFormData = {
      id: editingNode.id,
      title: editingNode.title ?? '',
      content: editingNode.content ?? '',
      parentId: editingNode.parentId ?? null,
    };

    try {
      await toast.promise(adminNodeService.save(nodeData), {
        loading: nodeData.id ? 'Atualizando canal...' : 'Criando novo canal...',
        success: nodeData.id ? 'Canal atualizado!' : 'Canal criado com sucesso!',
        error: 'Erro ao salvar canal.',
      });

      closeModal();
      loadNodes();
    } catch {
      // toast.promise já mostra o erro.
    }
  };

  return {
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
  };
}
