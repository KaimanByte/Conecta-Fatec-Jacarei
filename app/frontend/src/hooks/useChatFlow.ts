import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { chatService } from '../services/chatService';
import type { ChatHistoryEntry, ChatMessage, ChatNode, ChatPhase, SatisfactionStatus } from '../types';

const WELCOME_MESSAGE = 'Olá! 👋 Bem-vindo ao autoatendimento acadêmico da Fatec Jacareí.\n\nEu sou a Fernanda, sua assistente virtual!\n\nEscolha uma opção abaixo para prosseguir:';
const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function generateSessionId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

export function useChatFlow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nodes, setNodes] = useState<ChatNode[]>([]);
  const [history, setHistory] = useState<ChatHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<ChatPhase>('chat');
  const [sessionId, setSessionId] = useState(generateSessionId);
  const initializedRef = useRef(false);

  const addBotMessage = useCallback((text: string, html = false) => {
    setMessages((currentMessages) => [...currentMessages, { type: 'bot', text, html }]);
  }, []);

  const loadNodes = useCallback(async (parentId: number | null) => {
    setLoading(true);

    try {
      const nextNodes = await chatService.listNodes(parentId);
      setNodes(nextNodes);

      if (parentId === null) {
        setMessages([{ type: 'bot', text: WELCOME_MESSAGE }]);
        setHistory([]);
      }
    } catch {
      addBotMessage('Erro ao conectar com o servidor. Tente novamente mais tarde.');
      toast.error('Conexão perdida com o servidor.');
    } finally {
      setLoading(false);
    }

    try {
      await chatService.registerNavigation(sessionId, parentId);
    } catch {
      // Registro de log não deve interromper o atendimento.
    }
  }, [addBotMessage, sessionId]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    loadNodes(null);
  }, [loadNodes]);

  const selectNode = async (node: ChatNode) => {
    setMessages((currentMessages) => [...currentMessages, { type: 'user', text: node.title }]);
    setLoading(true);
    setNodes([]);

    try {
      const selectedNode = await chatService.getNode(node.id);
      await delay(1150);

      if (selectedNode.content) addBotMessage(selectedNode.content, true);

      setHistory((currentHistory) => [...currentHistory, { nodeId: node.id, title: node.title }]);

      if (selectedNode.children?.length) {
        addBotMessage('Selecione uma opção:');
        await delay(300);
        setNodes(selectedNode.children);
      } else {
        setNodes([]);
        window.setTimeout(() => setPhase('satisfaction'), 600);
      }
    } catch {
      addBotMessage('Erro ao carregar informação. Tente novamente.');
      toast.error('Erro na comunicação com a API.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (history.length === 0) return;

    const nextHistory = history.slice(0, -1);
    const parentEntry = nextHistory[nextHistory.length - 1];
    const parentId = parentEntry ? parentEntry.nodeId : null;

    setHistory(nextHistory);
    setMessages((currentMessages) => [...currentMessages, { type: 'user', text: '← Voltar' }]);
    setPhase('chat');
    loadNodes(parentId);
  };

  const restart = () => {
    setPhase('chat');
    setSessionId(generateSessionId());
    loadNodes(null);
  };

  const sendSatisfaction = async (satisfaction: SatisfactionStatus) => {
    try {
      await chatService.registerSatisfaction(sessionId, satisfaction);
    } catch {
      // Falha no log não impede a continuação do fluxo.
    }

    addBotMessage(
      satisfaction === 'ATENDEU'
        ? '😊 Ótimo! Fico feliz em ajudar. Até a próxima!'
        : '😕 Entendido. Você pode enviar sua dúvida para a secretaria.',
    );

    if (satisfaction === 'NAO_ATENDEU') {
      window.setTimeout(() => setPhase('inquiry'), 600);
    } else {
      setPhase('done');
    }
  };

  const markInquiryAsSent = () => {
    addBotMessage('✅ Dúvida enviada com sucesso! A secretaria responderá no seu e-mail em breve.');
    setPhase('done');
  };

  return {
    messages,
    nodes,
    history,
    loading,
    phase,
    sessionId,
    setPhase,
    selectNode,
    goBack,
    restart,
    sendSatisfaction,
    markInquiryAsSent,
  };
}
