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
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-gray-600 font-medium">Preencha para enviar sua dúvida à secretaria:</p>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Nome completo *</label>
        <input
          required value={name} onChange={e => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          placeholder="Seu nome"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">E-mail *</label>
        <input
          required type="email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          placeholder="seu@email.com"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Dúvida *</label>
        <textarea
          required value={question} onChange={e => setQuestion(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
          placeholder="Descreva sua dúvida..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Anexo (opcional, máx 5 MB)</label>
        <input
          type="file" onChange={e => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium hover:file:bg-indigo-100 cursor-pointer"
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button
          type="submit" disabled={loading}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
        >
          {loading ? 'Enviando...' : '📨 Enviar Dúvida'}
        </button>
        <button
          type="button" onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ─── Satisfação ───────────────────────────────────────────────────────────────
function SatisfactionPanel({ onRate }: { onRate: (flag: string) => void }) {
  return (
    <div className="text-center space-y-3 py-2">
      <p className="font-medium text-gray-700">O atendimento resolveu sua dúvida?</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onRate('ATENDEU')}
          className="flex flex-col items-center gap-1 p-4 rounded-xl border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all"
        >
          <span className="text-3xl">😊</span>
          <span className="text-sm font-medium text-green-700">Sim, resolveu!</span>
        </button>
        <button
          onClick={() => onRate('NAO_ATENDEU')}
          className="flex flex-col items-center gap-1 p-4 rounded-xl border-2 border-red-200 hover:border-red-400 hover:bg-red-50 transition-all"
        >
          <span className="text-3xl">😕</span>
          <span className="text-sm font-medium text-red-700">Não resolveu</span>
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, phase]);

  const addBotMessage = (text: string, html = false) =>
    setMessages(prev => [...prev, { type: 'bot', text, html }]);

  const fetchNodes = async (parentId: number | null, _parentTitle: string) => {
    setLoading(true);
    try {
      const url = parentId != null ? `/chat/nodes/${parentId}` : '/chat/nodes';
      const { data } = await api.get(url);
      setNodes(data);
      if (parentId === null) {
        setMessages([{ type: 'bot', text: 'Olá! 👋 Bem-vindo ao autoatendimento acadêmico da **Fatec Jacareí**.\n\nEscolha uma opção abaixo:' }]);
        setHistory([]);
      }
    } catch {
      addBotMessage('Erro ao conectar com o servidor. Tente novamente mais tarde.');
      toast.error('Conexão perdida com o servidor.');
    }
    setLoading(false);

    // Log da navegação
    try {
      await api.post('/logs', { sessionId, nodeId: parentId });
    } catch { /* silently fail */ }
  };

  const selectNode = async (node: ChatNode) => {
    setMessages(prev => [...prev, { type: 'user', text: node.title }]);
    setLoading(true);
    try {
      const { data } = await api.get(`/chat/node/${node.id}`);
      if (data.content) addBotMessage(data.content);

      if (data.children && data.children.length > 0) {
        setHistory(prev => [...prev, { nodeId: node.id, title: node.title }]);
        setNodes(data.children);
        addBotMessage('Selecione uma opção:');
      } else {
        // Nó folha — sem filhos
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

  return (
    <div className="bg-white rounded-2xl shadow-xl flex flex-col" style={{ height: '75vh' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm mr-2 flex-shrink-0 mt-0.5">
                🤖
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.type === 'user'
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm">🤖</div>
            <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-tl-sm flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Actions panel */}
      <div className="border-t border-gray-100 p-4 space-y-3">
        {phase === 'chat' && (
          <>
            {nodes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {nodes.map(node => (
                  <button
                    key={node.id}
                    onClick={() => selectNode(node)}
                    disabled={loading}
                    className="text-left bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 hover:border-indigo-400 text-indigo-800 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                  >
                    {node.title}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              {history.length > 0 && (
                <button
                  onClick={goBack}
                  disabled={loading}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-all"
                >
                  ← Voltar
                </button>
              )}
              {history.length > 0 && (
                <button
                  onClick={restart}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg transition-all"
                >
                  🏠 Início
                </button>
              )}
              <button
                onClick={() => setPhase('inquiry')}
                className="text-sm text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg transition-all ml-auto"
              >
                ✉️ Enviar dúvida
              </button>
            </div>
          </>
        )}

        {phase === 'satisfaction' && (
          <>
            <div className="flex gap-2 mb-2">
              <button onClick={restart} className="text-sm text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg">
                🏠 Início
              </button>
              <button onClick={goBack} className="text-sm text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg">
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
          <div className="text-center py-2">
            <button
              onClick={restart}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all"
            >
              🏠 Novo atendimento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
