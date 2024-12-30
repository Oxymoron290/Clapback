import React, { useEffect, useRef } from 'react';
import { useContactContext } from '../../context/ContactContext';
import { useChatContext } from '../../context/ChatContext';
import MessageItem from './MessageItem';

const MessageList: React.FC = () => {
  const { selectedChatId } = useContactContext();
  const { chats } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = selectedChatId ? chats[selectedChatId]?.messages || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map(message => (
        <MessageItem
          key={message.id}
          text={message.text}
          isSentByUser={message.isSentByUser}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
