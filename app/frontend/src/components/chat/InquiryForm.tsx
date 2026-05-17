import { useState } from 'react';
import { toast } from 'sonner';
import { chatService } from '../../services/chatService';

interface InquiryFormProps {
  sessionId: string;
  onSent: () => void;
  onCancel: () => void;
}

export default function InquiryForm({ sessionId, onSent, onCancel }: InquiryFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await chatService.sendInquiry({
        requesterName: name,
        requesterEmail: email,
        question,
        sessionId,
        attachment: file,
      });

      toast.success('Dúvida enviada com sucesso!');
      onSent();
    } catch {
      setError('Erro ao enviar. Tente novamente.');
      toast.error('Não foi possível enviar sua dúvida.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inquiry-form">
      <p className="ask-form-title">Preencha para enviar sua dúvida à secretaria:</p>

      <div className="ask-form-group">
        <label className="ask-form-label" htmlFor="inquiry-name">Nome completo *</label>
        <input
          id="inquiry-name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="input-field"
          placeholder="Seu nome"
        />
      </div>

      <div className="ask-form-group">
        <label className="ask-form-label" htmlFor="inquiry-email">E-mail *</label>
        <input
          id="inquiry-email"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-field"
          placeholder="seu@email.com"
        />
      </div>

      <div className="ask-form-group">
        <label className="ask-form-label" htmlFor="inquiry-question">Dúvida *</label>
        <textarea
          id="inquiry-question"
          required
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={3}
          className="input-field input-field--textarea"
          placeholder="Descreva sua dúvida..."
        />
      </div>

      <div className="ask-form-group">
        <label className="ask-form-label" htmlFor="inquiry-file">Anexo (opcional, máx 5 MB)</label>
        <input
          id="inquiry-file"
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="file-input"
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="footer-nav footer-nav--compact">
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Enviando...' : 'Enviar Dúvida'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
}
