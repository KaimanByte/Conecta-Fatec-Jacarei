import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { ChatMessage } from '../../types';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

function BotAvatar() {
  return (
    <div className="bot-avatar">
      <img src="/imagee.jpeg" alt="Atendente virtual" />
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="message-row bot message-row--loading">
      <BotAvatar />
      <div className="loading-dots" aria-label="Carregando resposta">
        <span className="dot dot--first" />
        <span className="dot dot--second" />
        <span className="dot dot--third" />
      </div>
    </div>
  );
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const safeHtml = useMemo(
    () => (message.html ? sanitizeHtml(message.text) : ''),
    [message.html, message.text],
  );

  return (
    <div className={`message-row ${message.type}`}>
      {message.type === 'bot' && <BotAvatar />}
      <div className={`message-bubble ${message.type}`}>
        {message.html ? (
          <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
        ) : (
          message.text
        )}
      </div>
    </div>
  );
}

export default function ChatMessageList({
  messages,
  loading,
}: {
  messages: ChatMessage[];
  loading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollMessagesToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, []);

  const scrollChatToActions = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const actionsPanel = document.querySelector('.actions-panel');

        if (actionsPanel) {
          actionsPanel.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    scrollMessagesToBottom();
  }, [messages, loading, scrollMessagesToBottom]);

  useEffect(() => {
    const actionsPanel = document.querySelector('.actions-panel');

    if (!actionsPanel) return;

    const observer = new MutationObserver(() => {
      scrollChatToActions();
    });

    observer.observe(actionsPanel, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [scrollChatToActions]);

  return (
    <div className="messages-container">
      {messages.map((message, index) => (
        <ChatMessageItem
          key={`${message.type}-${index}-${message.text.slice(0, 12)}`}
          message={message}
        />
      ))}

      {loading && <LoadingDots />}

      <div ref={bottomRef} />
    </div>
  );
}