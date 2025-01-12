import React, { useEffect, useRef } from 'react';
import { useRoomContext } from '../../context/RoomContext';
import MessageItem from './MessageItem';

const MessageList: React.FC = () => {
  const { selectedRoomId, roomMessages, loadRoomMessages } = useRoomContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = selectedRoomId ? roomMessages[selectedRoomId] || [] : [];

  useEffect(() => {
    if(selectedRoomId)
      loadRoomMessages(selectedRoomId);
  }, [selectedRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => (
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
