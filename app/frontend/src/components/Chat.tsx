import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { sendInquiry, SatisfactionFlag } from '../services/chatService';
import { useChatFlow } from '../hooks/useChatFlow';
import './Chat.css';

function sanitizeHtml(html: string): string {
  const allowedTags = new Set(['A', 'B', 'BR', 'EM', 'I', 'LI', 'OL', 'P', 'SPAN', 'STRONG', 'U', 'UL']);
  const allowedAnchorProtocols = ['http:', 'https:', 'mailto:', 'tel:'];

  const template = document.createElement('template');
  template.innerHTML = html;

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      if (!allowedTags.has(element.tagName)) {
        element.replaceWith(...Array.from(element.childNodes));
        return;
      }

      Array.from(element.attributes).forEach(attribute => {
        const attributeName = attribute.name.toLowerCase();

        if (element.tagName === 'A' && ['href', 'target', 'rel', 'title'].includes(attributeName)) {
          if (attributeName === 'href') {
            const href = element.getAttribute('href') ?? '';
            const url = new URL(href, window.location.origin);
            const isSafeProtocol = allowedAnchorProtocols.includes(url.protocol) || href.startsWith('/');

            if (!isSafeProtocol) {
              element.removeAttribute('href');
            }
          }

          return;
        }

        element.removeAttribute(attribute.name);
      });

      if (element.tagName === 'A') {
        element.setAttribute('rel', 'noopener noreferrer');
      }
    }

    Array.from(node.childNodes).forEach(sanitizeNode);
  };

  Array.from(template.content.childNodes).forEach(sanitizeNode);
  return template.innerHTML;
}

function InquiryForm({ sessionId, onSent, onCancel }: { sessionId: string; onSent: () => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendInquiry({
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
        <label className="ask-form-label">Nome completo *</label>
        <input
          required
          value={name}
          onChange={e => setName(e.target.value)}
          className="input-field"
          placeholder="Seu nome"
        />
      </div>
      <div className="ask-form-group">
        <label className="ask-form-label">E-mail *</label>
        <input
          required
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input-field"
          placeholder="seu@email.com"
        />
      </div>
      <div className="ask-form-group">
        <label className="ask-form-label">Dúvida *</label>
        <textarea
          required
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={3}
          className="input-field textarea-field"
          placeholder="Descreva sua dúvida..."
        />
      </div>
      <div className="ask-form-group">
        <label className="ask-form-label">Anexo (opcional, máx 5 MB)</label>
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
          className="file-input"
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="footer-nav footer-nav-form">
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

function SatisfactionPanel({ onRate }: { onRate: (flag: SatisfactionFlag) => void }) {
  return (
    <div className="satisfaction-container">
      <p className="satisfaction-title">O atendimento resolveu sua dúvida?</p>
      <div className="satisfaction-options">
        <button onClick={() => onRate('ATENDEU')} className="rate-button yes">
          <span className="rate-icon">😊</span>
          <span className="rate-label yes">Sim, resolveu!</span>
        </button>
        <button onClick={() => onRate('NAO_ATENDEU')} className="rate-button no">
          <span className="rate-icon">😕</span>
          <span className="rate-label no">Não resolveu</span>
        </button>
      </div>
    </div>
  );
}

const Chat = () => {
  const {
    messages,
    nodes,
    history,
    loading,
    phase,
    sessionId,
    selectNode,
    goBack,
    restart,
    openInquiry,
    closeInquiry,
    finishInquiry,
    handleSatisfaction,
  } = useChatFlow();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, phase, nodes]);

  return (
    <div className="chat-wrapper" ref={chatRef}>
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-row ${msg.type === 'user' ? 'user' : 'bot'}`}>
            {msg.type === 'bot' && (
              <div className="bot-avatar">
                <img src="imagee.jpeg" alt="Assistente virtual" />
              </div>
            )}
            <div className={`message-bubble ${msg.type === 'user' ? 'user' : 'bot'}`}>
              {msg.html ? (
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(msg.text) }} />
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-row bot loading-row">
            <div className="bot-avatar">
              <img src="imagee.jpeg" alt="Assistente virtual" />
            </div>
            <div className="loading-dots" aria-label="Carregando resposta">
              <span className="dot dot-delay-0" />
              <span className="dot dot-delay-1" />
              <span className="dot dot-delay-2" />
            </div>
          </div>
        )}
      </div>

      <div className="actions-panel">
        {phase === 'chat' && (
          <>
            {nodes.length > 0 && (
              <div className="nodes-grid">
                {nodes.map(node => (
                  <button
                    key={node.id}
                    onClick={() => selectNode(node)}
                    disabled={loading}
                    className="node-button"
                  >
                    {node.title}
                  </button>
                ))}
              </div>
            )}
            <div className="footer-nav">
              {history.length > 0 && (
                <button onClick={goBack} disabled={loading} className="btn-secondary">
                  ← Voltar
                </button>
              )}
              {history.length > 0 && (
                <button onClick={restart} className="btn-secondary btn-borderless">
                  Início
                </button>
              )}
              <button onClick={openInquiry} className="btn-link">
                Enviar dúvida
              </button>
            </div>
          </>
        )}

        {phase === 'satisfaction' && (
          <>
            <div className="footer-nav footer-nav-spaced">
              <button onClick={restart} className="btn-secondary btn-borderless">
                Início
              </button>
              <button onClick={goBack} className="btn-secondary btn-borderless">
                ← Voltar
              </button>
            </div>
            <SatisfactionPanel onRate={handleSatisfaction} />
          </>
        )}

        {phase === 'inquiry' && (
          <InquiryForm
            sessionId={sessionId}
            onSent={finishInquiry}
            onCancel={closeInquiry}
          />
        )}

        {phase === 'done' && (
          <div className="new-service-container">
            <button onClick={restart} className="btn-submit btn-new-service">
              Novo atendimento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
