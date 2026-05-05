import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { Mail, Send, CheckCircle2, Clock, FileText, ChevronDown, ChevronUp, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '../components/Skeleton';

interface Inquiry {
  id: number;
  requesterName: string;
  requesterEmail: string;
  question: string;
  answerText: string;
  status: 'ABERTA' | 'RESPONDIDA';
  createdAt: string;
  attachmentName?: string;
  attachmentMime?: string;
}

const AdminInquiries = ({ setToken }: { setToken?: (v: string | null) => void }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'TODAS' | 'ABERTA' | 'RESPONDIDA'>('TODAS');
  const [answerText, setAnswerText] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, [filter, search]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'TODAS') params.append('status', filter);
      if (search) params.append('search', search);

      const { data } = await api.get(`/admin/inquiries?${params.toString()}`);
      setInquiries(data);
    } catch (err) {
      toast.error('Erro ao buscar lista de dúvidas.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number, filename: string) => {
    try {
      const response = await api.get(`/admin/inquiries/${id}/attachment`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || `anexo-${id}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Erro ao baixar anexo.');
    }
  };

  const handleAnswer = async (id: number) => {
    if (!answerText.trim()) {
      toast.error('A resposta não pode estar vazia.');
      return;
    }
    try {
      await api.put(`/admin/inquiries/${id}`, { answerText });
      toast.success('Dúvida respondida e resposta salva no sistema.');
      setAnswerText('');
      setExpandedId(null);
      fetchInquiries();
    } catch (err: any) {
      const msg = err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'Erro ao enviar resposta.';
      toast.error(msg);
    }
  };

  return (
    <AdminLayout setToken={setToken}>
      {/* Page Header */}
      <div className="inq-page-header">
        <div>
          <h2 className="inq-page-title">Dúvidas</h2>
          <p className="inq-page-subtitle">Responda às solicitações enviadas pelos estudantes</p>
        </div>

        <div className="inq-filter-group">
          {(['TODAS', 'ABERTA', 'RESPONDIDA'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`inq-filter-btn ${filter === f ? 'inq-filter-btn--active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="inq-search-wrapper">
        <Search className="inq-search-icon" size={18} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou conteúdo da dúvida..."
          className="inq-search-input"
        />
      </div>

      {/* List */}
      <div className="inq-list">
        {loading ? (
          <div className="inq-skeleton-wrapper">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="inq-empty">
            <Mail className="inq-empty-icon" size={48} />
            <p className="inq-empty-text">Nenhuma dúvida encontrada para este filtro.</p>
          </div>
        ) : (
          inquiries.map(inq => (
            <div
              key={inq.id}
              className={`inq-card ${expandedId === inq.id ? 'inq-card--expanded' : ''}`}
            >
              {/* Card Header */}
              <div
                className="inq-card-header"
                onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
              >
                <div className="inq-card-left">
                  <div className={`inq-status-icon ${inq.status === 'ABERTA' ? 'inq-status-icon--open' : 'inq-status-icon--done'}`}>
                    {inq.status === 'ABERTA' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                  </div>
                  <div>
                    <h4 className="inq-requester-name">
                      {inq.requesterName}
                      <span className="inq-id-badge">#{inq.id}</span>
                    </h4>
                    <p className="inq-requester-email">{inq.requesterEmail}</p>
                  </div>
                </div>

                <div className="inq-card-preview">
                  <p className="inq-question-preview">"{inq.question}"</p>
                </div>

                <div className="inq-card-right">
                  <span className="inq-date">{new Date(inq.createdAt).toLocaleDateString()}</span>
                  {expandedId === inq.id
                    ? <ChevronUp size={20} className="inq-chevron" />
                    : <ChevronDown size={20} className="inq-chevron" />}
                </div>
              </div>

              {/* Expandable Content */}
              {expandedId === inq.id && (
                <div className="inq-card-body">
                  <div className="inq-question-box">
                    <p className="inq-question-label">Dúvida do Aluno:</p>
                    <p className="inq-question-text">{inq.question}</p>

                    {inq.attachmentName && (
                      <div className="inq-attachment">
                        <div className="inq-attachment-name">
                          <FileText size={16} />
                          <span>{inq.attachmentName}</span>
                        </div>
                        <button
                          onClick={() => handleDownload(inq.id, inq.attachmentName!)}
                          className="inq-download-btn"
                        >
                          <Download size={14} />
                          Baixar Anexo
                        </button>
                      </div>
                    )}
                  </div>

                  {inq.status === 'ABERTA' ? (
                    <div className="inq-answer-form">
                      <label className="inq-answer-label">Sua Resposta:</label>
                      <textarea
                        className="inq-answer-textarea"
                        placeholder="Digite aqui a orientação para o aluno..."
                        rows={4}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                      />
                      <button
                        onClick={() => handleAnswer(inq.id)}
                        className="inq-send-btn"
                      >
                        <Send size={18} />
                        Enviar Resposta Final
                      </button>
                    </div>
                  ) : (
                    <div className="inq-answered-box">
                      <p className="inq-answered-label">
                        Resposta Enviada em {new Date(inq.createdAt).toLocaleDateString()}:
                      </p>
                      <p className="inq-answered-text">{inq.answerText}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInquiries;