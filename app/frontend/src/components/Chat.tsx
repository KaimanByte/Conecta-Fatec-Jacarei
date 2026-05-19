import { useEffect, useRef, useState } from 'react';
import './Chat.css';
import ChatMessageList from './chat/ChatMessageList';
import ChatOptions from './chat/ChatOptions';
import InquiryForm from './chat/InquiryForm';
import SatisfactionPanel from './chat/SatisfactionPanel';
import { useChatFlow } from '../hooks/useChatFlow';

const PANEL_CLOSE_TIME = 220;

const Chat = () => {
  const {
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
  } = useChatFlow();

  const [isPanelClosing, setIsPanelClosing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const runWithPanelAnimation = (callback: () => void) => {
    if (loading || isPanelClosing) return;

    setIsPanelClosing(true);

    timeoutRef.current = window.setTimeout(() => {
      callback();
      setIsPanelClosing(false);
    }, PANEL_CLOSE_TIME);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="chat-wrapper">
      <ChatMessageList messages={messages} loading={loading} />

      <div className={`actions-panel ${isPanelClosing ? 'actions-panel--closing' : ''}`}>
        <div className="actions-panel-content">
          {phase === 'chat' && (
            <>
              <ChatOptions
                nodes={nodes}
                loading={loading || isPanelClosing}
                onSelect={(node) => runWithPanelAnimation(() => selectNode(node))}
              />

              <div className="footer-nav">
                {history.length > 0 && (
                  <button
                    onClick={() => runWithPanelAnimation(goBack)}
                    disabled={loading || isPanelClosing}
                    className="btn-secondary"
                    type="button"
                  >
                    ← Voltar
                  </button>
                )}

                {history.length > 0 && (
                  <button
                    onClick={() => runWithPanelAnimation(restart)}
                    disabled={loading || isPanelClosing}
                    className="btn-secondary btn-secondary--borderless"
                    type="button"
                  >
                    Início
                  </button>
                )}

                <button
                  onClick={() => runWithPanelAnimation(() => setPhase('inquiry'))}
                  disabled={loading || isPanelClosing}
                  className="btn-link"
                  type="button"
                >
                  Enviar dúvida
                </button>
              </div>
            </>
          )}

          {phase === 'satisfaction' && (
            <>
              <div className="footer-nav footer-nav--spaced">
                <button
                  onClick={() => runWithPanelAnimation(restart)}
                  disabled={loading || isPanelClosing}
                  className="btn-secondary btn-secondary--borderless"
                  type="button"
                >
                  Início
                </button>

                <button
                  onClick={() => runWithPanelAnimation(goBack)}
                  disabled={loading || isPanelClosing}
                  className="btn-secondary btn-secondary--borderless"
                  type="button"
                >
                  ← Voltar
                </button>
              </div>

              <SatisfactionPanel
                onRate={(rate) => runWithPanelAnimation(() => sendSatisfaction(rate))}
              />
            </>
          )}

          {phase === 'inquiry' && (
            <InquiryForm
              sessionId={sessionId}
              onSent={markInquiryAsSent}
              onCancel={() => runWithPanelAnimation(() => setPhase('chat'))}
            />
          )}

          {phase === 'done' && (
            <div className="chat-done-actions">
              <button
                onClick={() => runWithPanelAnimation(restart)}
                disabled={loading || isPanelClosing}
                className="btn-submit btn-submit--auto"
                type="button"
              >
                Novo atendimento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;