import api from '../utils/api';
import type { Inquiry, InquiryFilter } from '../types';

export const inquiryService = {
  async list(filter: InquiryFilter, search = ''): Promise<Inquiry[]> {
    const params = new URLSearchParams();
    if (filter !== 'TODAS') params.append('status', filter);
    if (search.trim()) params.append('search', search.trim());

    const query = params.toString();
    const { data } = await api.get<Inquiry[]>(`/admin/inquiries${query ? `?${query}` : ''}`);
    return data;
  },

  async answer(id: number, answerText: string): Promise<void> {
    await api.put(`/admin/inquiries/${id}`, { answerText });
  },

  async downloadAttachment(id: number): Promise<Blob> {
    const response = await api.get(`/admin/inquiries/${id}/attachment`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
