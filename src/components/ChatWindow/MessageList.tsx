import React, { useEffect, useRef } from 'react';
import { useChatContext } from '../../context/ChatContext';
import MessageItem from './MessageItem';

const MessageList: React.FC = () => {
  const { chats, selectedChatId } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = selectedChatId ? chats[selectedChatId] || [] : [];

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
