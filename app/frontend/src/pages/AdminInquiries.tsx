import { CheckCircle2, ChevronDown, ChevronUp, Clock, Download, FileText, Mail, Search, Send } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { Skeleton } from '../components/Skeleton';
import { useAdminInquiries } from '../hooks/useAdminInquiries';
import type { InquiryFilter } from '../types';

const filters: InquiryFilter[] = ['TODAS', 'ABERTA', 'RESPONDIDA'];

const AdminInquiries = ({ setToken }: { setToken?: (value: string | null) => void }) => {
  const {
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
  } = useAdminInquiries();

  return (
    <AdminLayout setToken={setToken}>
      <div className="inq-page-header">
        <div>
          <h2 className="inq-page-title">Dúvidas</h2>
          <p className="inq-page-subtitle">Responda às solicitações enviadas pelos estudantes</p>
        </div>

        <div className="inq-filter-group">
          {filters.map((currentFilter) => (
            <button
              key={currentFilter}
              onClick={() => setFilter(currentFilter)}
              className={`inq-filter-btn ${filter === currentFilter ? 'inq-filter-btn--active' : ''}`}
              type="button"
            >
              {currentFilter}
            </button>
          ))}
        </div>
      </div>

      <div className="inq-search-wrapper">
        <Search className="inq-search-icon" size={18} />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome, e-mail ou conteúdo da dúvida..."
          className="inq-search-input"
        />
      </div>

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
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className={`inq-card ${expandedId === inquiry.id ? 'inq-card--expanded' : ''}`}>
              <button className="inq-card-header" onClick={() => toggleExpanded(inquiry.id)} type="button">
                <div className="inq-card-left">
                  <div className={`inq-status-icon ${inquiry.status === 'ABERTA' ? 'inq-status-icon--open' : 'inq-status-icon--done'}`}>
                    {inquiry.status === 'ABERTA' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                  </div>
                  <div>
                    <h4 className="inq-requester-name">
                      {inquiry.requesterName}
                      <span className="inq-id-badge">#{inquiry.id}</span>
                    </h4>
                    <p className="inq-requester-email">{inquiry.requesterEmail}</p>
                  </div>
                </div>

                <div className="inq-card-preview">
                  <p className="inq-question-preview">&quot;{inquiry.question}&quot;</p>
                </div>

                <div className="inq-card-right">
                  <span className="inq-date">{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                  {expandedId === inquiry.id
                    ? <ChevronUp size={20} className="inq-chevron" />
                    : <ChevronDown size={20} className="inq-chevron" />}
                </div>
              </button>

              {expandedId === inquiry.id && (
                <div className="inq-card-body">
                  <div className="inq-question-box">
                    <p className="inq-question-label">Dúvida do Aluno:</p>
                    <p className="inq-question-text">{inquiry.question}</p>

                    {inquiry.attachmentName && (
                      <div className="inq-attachment">
                        <div className="inq-attachment-name">
                          <FileText size={16} />
                          <span>{inquiry.attachmentName}</span>
                        </div>
                        <button
                          onClick={() => downloadAttachment(inquiry.id, inquiry.attachmentName || '')}
                          className="inq-download-btn"
                          type="button"
                        >
                          <Download size={14} />
                          Baixar Anexo
                        </button>
                      </div>
                    )}
                  </div>

                  {inquiry.status === 'ABERTA' ? (
                    <div className="inq-answer-form">
                      <label className="inq-answer-label" htmlFor={`answer-${inquiry.id}`}>Sua Resposta:</label>
                      <textarea
                        id={`answer-${inquiry.id}`}
                        className="inq-answer-textarea"
                        placeholder="Digite aqui a orientação para o aluno..."
                        rows={4}
                        value={answerText}
                        onChange={(event) => setAnswerText(event.target.value)}
                      />
                      <button onClick={() => answerInquiry(inquiry.id)} className="inq-send-btn" type="button">
                        <Send size={18} />
                        Enviar Resposta Final
                      </button>
                    </div>
                  ) : (
                    <div className="inq-answered-box">
                      <p className="inq-answered-label">
                        Resposta Enviada em {new Date(inquiry.createdAt).toLocaleDateString()}:
                      </p>
                      <p className="inq-answered-text">{inquiry.answerText}</p>
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
