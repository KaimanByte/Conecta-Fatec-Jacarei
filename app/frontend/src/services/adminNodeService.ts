import api from '../utils/api';
import type { ChatNode } from '../types';

export type NodeFormData = Pick<ChatNode, 'title' | 'content'> & {
  id?: number;
  parentId?: number | null;
};

export const adminNodeService = {
  async list(search = ''): Promise<ChatNode[]> {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    const query = params.toString();
    const { data } = await api.get<ChatNode[]>(`/admin/nodes${query ? `?${query}` : ''}`);
    return data;
  },

  async save(node: NodeFormData): Promise<void> {
    if (node.id) {
      await api.put(`/admin/nodes/${node.id}`, node);
      return;
    }

    await api.post('/admin/nodes', node);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/nodes/${id}`);
  },
};
