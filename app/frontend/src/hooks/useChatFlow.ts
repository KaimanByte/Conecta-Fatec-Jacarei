import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  ChatNode,
  SatisfactionFlag,
  getChatNode,
  getChatNodes,
  registerInteraction,
  registerSatisfaction,
} from '../services/chatService';

export interface Message {
  type: 'user' | 'bot';
  text: string;
  html?: boolean;
}

interface HistoryEntry {
  nodeId: number | null;
  title: string;
}

export type ChatPhase = 'chat' | 'inquiry' | 'satisfaction' | 'done';

function generateSessionId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useChatFlow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nodes, setNodes] = useState<ChatNode[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<ChatPhase>('chat');
  const [sessionId, setSessionId] = useState(generateSessionId());

  const addBotMessage = useCallback((text: string, html = false) => {
    setMessages(prev => [...prev, { type: 'bot', text, html }]);
  }, []);

  const loadNodes = useCallback(async (parentId: number | null, currentSessionId: string) => {
    setLoading(true);

    try {
      const data = await getChatNodes(parentId);
      setNodes(data);

      if (parentId === null) {
        setMessages([
          {
            type: 'bot',
            text: 'Olá! 👋 Bem-vindo ao autoatendimento acadêmico da Fatec Jacareí.\n\nEscolha uma opção abaixo:',
          },
        ]);
        setHistory([]);
      }
    } catch {
      addBotMessage('Erro ao conectar com o servidor. Tente novamente mais tarde.');
      toast.error('Conexão perdida com o servidor.');
    } finally {
      setLoading(false);
    }

    try {
      await registerInteraction(currentSessionId, parentId);
    } catch {
      // O registro de log não deve bloquear a navegação do usuário no chat.
    }
  }, [addBotMessage]);

  useEffect(() => {
    loadNodes(null, sessionId);
  }, []);

  const selectNode = useCallback(async (node: ChatNode) => {
    setMessages(prev => [...prev, { type: 'user', text: node.title }]);
    setLoading(true);
    setNodes([]);

    try {
      const data = await getChatNode(node.id);
      await sleep(1150);

      if (data.content) {
        addBotMessage(data.content, true);
      }

      if (data.children && data.children.length > 0) {
        setHistory(prev => [...prev, { nodeId: node.id, title: node.title }]);
        addBotMessage('Selecione uma opção:');
        await sleep(500);
        setNodes(data.children);
      } else {
        setNodes([]);
        setHistory(prev => [...prev, { nodeId: node.id, title: node.title }]);
        setTimeout(() => setPhase('satisfaction'), 800);
      }
    } catch {
      addBotMessage('Erro ao carregar informação. Tente novamente.');
      toast.error('Erro na comunicação com a API.');
    } finally {
      setLoading(false);
    }
  }, [addBotMessage]);

  const goBack = useCallback(() => {
    if (history.length === 0) return;

    const newHistory = history.slice(0, -1);
    const parentEntry = newHistory[newHistory.length - 1];
    const parentId = parentEntry ? parentEntry.nodeId : null;

    setHistory(newHistory);
    setMessages(prev => [...prev, { type: 'user', text: '← Voltar' }]);
    setPhase('chat');
    loadNodes(parentId, sessionId);
  }, [history, loadNodes, sessionId]);

  const restart = useCallback(() => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setHistory([]);
    setNodes([]);
    setPhase('chat');
    loadNodes(null, newSessionId);
  }, [loadNodes]);

  const openInquiry = useCallback(() => setPhase('inquiry'), []);
  const closeInquiry = useCallback(() => setPhase('chat'), []);

  const finishInquiry = useCallback(() => {
    addBotMessage('✅ Dúvida enviada com sucesso! A secretaria responderá no seu e-mail em breve.');
    setPhase('done');
  }, [addBotMessage]);

  const handleSatisfaction = useCallback(async (flag: SatisfactionFlag) => {
    try {
      await registerSatisfaction(sessionId, flag);
    } catch {
      // A avaliação não deve impedir a continuidade do atendimento.
    }

    addBotMessage(
      flag === 'ATENDEU'
        ? '😊 Ótimo! Fico feliz em ajudar. Até a próxima!'
        : '😕 Entendido. Você pode enviar sua dúvida para a secretaria.',
    );

    if (flag === 'NAO_ATENDEU') {
      setTimeout(() => setPhase('inquiry'), 600);
    } else {
      setPhase('done');
    }
  }, [addBotMessage, sessionId]);

  return {
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
  };
}
