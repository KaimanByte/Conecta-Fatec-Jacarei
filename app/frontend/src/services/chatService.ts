import api from '../utils/api';
import type { ChatNode, SatisfactionStatus } from '../types';

export interface InquiryPayload {
  requesterName: string;
  requesterEmail: string;
  question: string;
  sessionId: string;
  attachment?: File | null;
}

export const chatService = {
  async listNodes(parentId: number | null = null): Promise<ChatNode[]> {
    const endpoint = parentId === null ? '/chat/nodes' : `/chat/nodes/${parentId}`;
    const { data } = await api.get<ChatNode[]>(endpoint);
    return data;
  },

  async getNode(nodeId: number): Promise<ChatNode> {
    const { data } = await api.get<ChatNode>(`/chat/node/${nodeId}`);
    return data;
  },

  async registerNavigation(sessionId: string, nodeId: number | null): Promise<void> {
    await api.post('/logs', { sessionId, nodeId });
  },

  async registerSatisfaction(sessionId: string, satisfaction: SatisfactionStatus): Promise<void> {
    await api.post(`/logs/${sessionId}/satisfaction`, { satisfaction });
  },

  async sendInquiry(payload: InquiryPayload): Promise<void> {
    const formData = new FormData();
    formData.append('requesterName', payload.requesterName);
    formData.append('requesterEmail', payload.requesterEmail);
    formData.append('question', payload.question);
    formData.append('sessionId', payload.sessionId);

    if (payload.attachment) {
      formData.append('attachment', payload.attachment);
    }

    await api.post('/inquiries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
