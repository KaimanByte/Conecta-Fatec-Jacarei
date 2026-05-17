import './Chat.css';
import ChatMessageList from './chat/ChatMessageList';
import ChatOptions from './chat/ChatOptions';
import InquiryForm from './chat/InquiryForm';
import SatisfactionPanel from './chat/SatisfactionPanel';
import { useChatFlow } from '../hooks/useChatFlow';

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

  return (
    <div className="chat-wrapper">
      <ChatMessageList messages={messages} loading={loading} />

      <div className="actions-panel">
        {phase === 'chat' && (
          <>
            <ChatOptions nodes={nodes} loading={loading} onSelect={selectNode} />
            <div className="footer-nav">
              {history.length > 0 && (
                <button onClick={goBack} disabled={loading} className="btn-secondary" type="button">
                  ← Voltar
                </button>
              )}
              {history.length > 0 && (
                <button onClick={restart} className="btn-secondary btn-secondary--borderless" type="button">
                  Início
                </button>
              )}
              <button onClick={() => setPhase('inquiry')} className="btn-link" type="button">
                Enviar dúvida
              </button>
            </div>
          </>
        )}

        {phase === 'satisfaction' && (
          <>
            <div className="footer-nav footer-nav--spaced">
              <button onClick={restart} className="btn-secondary btn-secondary--borderless" type="button">
                Início
              </button>
              <button onClick={goBack} className="btn-secondary btn-secondary--borderless" type="button">
                ← Voltar
              </button>
            </div>
            <SatisfactionPanel onRate={sendSatisfaction} />
          </>
        )}

        {phase === 'inquiry' && (
          <InquiryForm
            sessionId={sessionId}
            onSent={markInquiryAsSent}
            onCancel={() => setPhase('chat')}
          />
        )}

        {phase === 'done' && (
          <div className="chat-done-actions">
            <button onClick={restart} className="btn-submit btn-submit--auto" type="button">
              Novo atendimento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
