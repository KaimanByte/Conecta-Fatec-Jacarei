import api from '../utils/api';

export interface ChatNode {
  id: number;
  title: string;
  content?: string;
}

export interface ChatNodeDetails extends ChatNode {
  children?: ChatNode[];
}

export interface InquiryPayload {
  requesterName: string;
  requesterEmail: string;
  question: string;
  sessionId: string;
  attachment?: File | null;
}

export type SatisfactionFlag = 'ATENDEU' | 'NAO_ATENDEU';

export async function getChatNodes(parentId: number | null): Promise<ChatNode[]> {
  const url = parentId != null ? `/chat/nodes/${parentId}` : '/chat/nodes';
  const { data } = await api.get<ChatNode[]>(url);
  return data;
}

export async function getChatNode(nodeId: number): Promise<ChatNodeDetails> {
  const { data } = await api.get<ChatNodeDetails>(`/chat/node/${nodeId}`);
  return data;
}

export async function registerInteraction(sessionId: string, nodeId: number | null): Promise<void> {
  await api.post('/logs', { sessionId, nodeId });
}

export async function registerSatisfaction(
  sessionId: string,
  satisfaction: SatisfactionFlag,
): Promise<void> {
  await api.post(`/logs/${sessionId}/satisfaction`, { satisfaction });
}

export async function sendInquiry(payload: InquiryPayload): Promise<void> {
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
}
