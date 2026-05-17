import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { inquiryService } from '../services/inquiryService';
import type { Inquiry, InquiryFilter } from '../types';

export function useAdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InquiryFilter>('TODAS');
  const [answerText, setAnswerText] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const loadInquiries = async () => {
    setLoading(true);

    try {
      const data = await inquiryService.list(filter, search);
      setInquiries(data);
    } catch {
      toast.error('Erro ao buscar lista de dúvidas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [filter, search]);

  const toggleExpanded = (id: number) => {
    setExpandedId((currentId) => (currentId === id ? null : id));
    setAnswerText('');
  };

  const downloadAttachment = async (id: number, filename: string) => {
    try {
      const blob = await inquiryService.downloadAttachment(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', filename || `anexo-${id}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Erro ao baixar anexo.');
    }
  };

  const answerInquiry = async (id: number) => {
    if (!answerText.trim()) {
      toast.error('A resposta não pode estar vazia.');
      return;
    }

    try {
      await inquiryService.answer(id, answerText.trim());
      toast.success('Dúvida respondida e resposta salva no sistema.');
      setAnswerText('');
      setExpandedId(null);
      loadInquiries();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.details?.[0]?.message ||
          error.response?.data?.error ||
          'Erro ao enviar resposta.';
        toast.error(message);
        return;
      }

      toast.error('Erro ao enviar resposta.');
    }
  };

  return {
    inquiries,
    loading,
    filter,
    setFilter,
    answerText,
    setAnswerText,
    expandedId,
    search,
    setSearch,
    toggleExpanded,
    downloadAttachment,
    answerInquiry,
  };
}
