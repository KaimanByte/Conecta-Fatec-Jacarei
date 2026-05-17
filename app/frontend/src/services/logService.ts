import api from '../utils/api';
import type { ChatNode, LogEntry, SatisfactionFilter } from '../types';

export const logService = {
  async list(filter: SatisfactionFilter): Promise<LogEntry[]> {
    const endpoint = filter === 'TODAS' ? '/admin/logs' : `/admin/logs?satisfaction=${filter}`;
    const { data } = await api.get<LogEntry[]>(endpoint);
    return data;
  },

  async listNodes(): Promise<ChatNode[]> {
    const { data } = await api.get<ChatNode[]>('/admin/nodes');
    return data;
  },
};
