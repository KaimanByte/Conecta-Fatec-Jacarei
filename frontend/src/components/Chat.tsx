import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { toast } from 'sonner';
interface ChatNode {
  id: number;
  title: string;
  content?: string;
}

interface Message {
  type: 'user' | 'bot';
  text: string;
  html?: boolean;
}

interface HistoryEntry {
  nodeId: number | null;
  title: string;
}

type ChatPhase = 'chat' | 'inquiry' | 'satisfaction' | 'done';

function generateSessionId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

// ─── Formulário de Dúvida ─────────────────────────────────────────────────────
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
      const fd = new FormData();
      fd.append('requesterName', name);
      fd.append('requesterEmail', email);
      fd.append('question', question);
      fd.append('sessionId', sessionId);
      if (file) fd.append('attachment', file);
      await api.post('/inquiries', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
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
          required value={name} onChange={e => setName(e.target.value)}
          className="input-field"
          placeholder="Seu nome"
        />
      </div>
      <div className="ask-form-group">
        <label className="ask-form-label">E-mail *</label>
        <input
          required type="email" value={email} onChange={e => setEmail(e.target.value)}
          className="input-field"
          placeholder="seu@email.com"
        />
      </div>
      <div className="ask-form-group">
        <label className="ask-form-label">Dúvida *</label>
        <textarea
          required value={question} onChange={e => setQuestion(e.target.value)}
          rows={3}
          className="input-field"
          style={{ resize: 'none' }}
          placeholder="Descreva sua dúvida..."
        />
      </div>
      <div className="ask-form-group">
        <label className="ask-form-label">Anexo (opcional, máx 5 MB)</label>
        <input
          type="file" onChange={e => setFile(e.target.files?.[0] ?? null)}
          className="file-input"
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="footer-nav" style={{ paddingTop: '0.25rem' }}>
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

// ─── Satisfação ───────────────────────────────────────────────────────────────
function SatisfactionPanel({ onRate }: { onRate: (flag: string) => void }) {
  return (
    <div className="satisfaction-container">
      <p style={{ fontWeight: 500, color: '#374151' }}>O atendimento resolveu sua dúvida?</p>
      <div className="satisfaction-options">
        <button onClick={() => onRate('ATENDEU')} className="rate-button yes">
          <span style={{ fontSize: '1.875rem' }}>😊</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#15803d' }}>Sim, resolveu!</span>
        </button>
        <button onClick={() => onRate('NAO_ATENDEU')} className="rate-button no">
          <span style={{ fontSize: '1.875rem' }}>😕</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#b91c1c' }}>Não resolveu</span>
        </button>
      </div>
    </div>
  );
}

// ─── Chat Principal ───────────────────────────────────────────────────────────
const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nodes, setNodes] = useState<ChatNode[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<ChatPhase>('chat');
  const [sessionId, setSessionId] = useState(generateSessionId());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNodes(null, 'Início');
  }, []);

  useEffect(() => {
  chatRef.current?.scrollIntoView({
    behavior: 'smooth',
    block: 'end'
  });
}, [messages, phase, nodes]);

  const addBotMessage = (text: string, html = false) =>
    setMessages(prev => [...prev, { type: 'bot', text, html }]);

  const fetchNodes = async (parentId: number | null, _parentTitle: string) => {
    setLoading(true);
    try {
      const url = parentId != null ? `/chat/nodes/${parentId}` : '/chat/nodes';
      const { data } = await api.get(url);
      setNodes(data);
      if (parentId === null) {
        setMessages([{ type: 'bot', text: 'Olá! 👋 Bem-vindo ao autoatendimento acadêmico da Fatec Jacareí.\n\nEscolha uma opção abaixo:' }]);
        setHistory([]);
      }
    } catch {
      addBotMessage('Erro ao conectar com o servidor. Tente novamente mais tarde.');
      toast.error('Conexão perdida com o servidor.');
    }
    setLoading(false);

    try {
      await api.post('/logs', { sessionId, nodeId: parentId });
    } catch { /* silently fail */ }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const selectNode = async (node: ChatNode) => {
    setMessages(prev => [...prev, { type: 'user', text: node.title }]);
    setLoading(true);
    setNodes([]);
    try {
      const { data } = await api.get(`/chat/node/${node.id}`);
      await sleep(1150);
      if (data.content) addBotMessage(data.content, true);

      if (data.children && data.children.length > 0) {
        setHistory(prev => [...prev, { nodeId: node.id, title: node.title }]);
        addBotMessage('Selecione uma opção:');
        await sleep(500)
        setNodes(data.children);
      } else {
        setNodes([]);
        setHistory(prev => [...prev, { nodeId: node.id, title: node.title }]);
        setTimeout(() => setPhase('satisfaction'), 800);
      }
    } catch {
      addBotMessage('Erro ao carregar informação. Tente novamente.');
      toast.error('Erro na comunicação com a API.');
    }
    setLoading(false);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    const parentEntry = newHistory[newHistory.length - 1];
    const parentId = parentEntry ? parentEntry.nodeId : null;
    const parentTitle = parentEntry ? parentEntry.title : 'Início';

    setMessages(prev => [...prev, { type: 'user', text: '← Voltar' }]);
    fetchNodes(parentId, parentTitle);
    setPhase('chat');
  };

  const restart = () => {
    setPhase('chat');
    setSessionId(generateSessionId());
    fetchNodes(null, 'Início');
  };

  const handleSatisfaction = async (flag: string) => {
    try {
      await api.post(`/logs/${sessionId}/satisfaction`, { satisfaction: flag });
    } catch { /* silently fail */ }
    addBotMessage(
      flag === 'ATENDEU'
        ? '😊 Ótimo! Fico feliz em ajudar. Até a próxima!'
        : '😕 Entendido. Você pode enviar sua dúvida para a secretaria.'
    );
    if (flag === 'NAO_ATENDEU') {
      setTimeout(() => setPhase('inquiry'), 600);
    } else {
      setPhase('done');
    }
  };

  const chatRef = useRef<HTMLDivElement>(null);

  return (
    <div className="chat-wrapper" ref={chatRef}>
      {/* Mensagens */}
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-row ${msg.type === 'user' ? 'user' : 'bot'}`}>
            {msg.type === 'bot' && (
              <div className="bot-avatar"><img src="imagee.jpeg"></img></div>
            )}
            <div className={`message-bubble ${msg.type === 'user' ? 'user' : 'bot'}`}>
              {msg.html ? (
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-row bot" style={{ alignItems: 'center', gap: '0.5rem' }}>
            <div className="bot-avatar"><img src="imagee.jpeg"></img></div>
            <div className="loading-dots">
              <span className="dot" style={{ animationDelay: '0ms' }} />
              <span className="dot" style={{ animationDelay: '300ms' }} />
              <span className="dot" style={{ animationDelay: '600ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Painel de Ações */}
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
                <button onClick={restart} className="btn-secondary" style={{ border: 'none' }}>
                  Início
                </button>
              )}
              <button onClick={() => setPhase('inquiry')} className="btn-link">
                Enviar dúvida
              </button>
            </div>
          </>
        )}

        {phase === 'satisfaction' && (
          <>
            <div className="footer-nav" style={{ marginBottom: '0.5rem' }}>
              <button onClick={restart} className="btn-secondary" style={{ border: 'none' }}>
                Início
              </button>
              <button onClick={goBack} className="btn-secondary" style={{ border: 'none' }}>
                ← Voltar
              </button>
            </div>
            <SatisfactionPanel onRate={handleSatisfaction} />
          </>
        )}

        {phase === 'inquiry' && (
          <InquiryForm
            sessionId={sessionId}
            onSent={() => {
              addBotMessage('✅ Dúvida enviada com sucesso! A secretaria responderá no seu e-mail em breve.');
              setPhase('done');
            }}
            onCancel={() => setPhase('chat')}
          />
        )}

        {phase === 'done' && (
          <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
            <button onClick={restart} className="btn-submit" style={{ padding: '0.5rem 1.5rem', width: 'auto' }}>
              Novo atendimento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;