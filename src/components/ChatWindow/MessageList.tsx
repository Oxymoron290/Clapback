import React, { useEffect, useRef } from 'react';
//import { useRoomContext } from '../../context/RoomContext';
//import { useChatContext } from '../../context/ChatContext';
import MessageItem from './MessageItem';

const MessageList: React.FC = () => {
  //const { selectedRoomId } = useRoomContext();
  //const { chats } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  //const messages = selectedRoomId ? chats[selectedRoomId]?.messages || [] : [];
  const messages: any[] = [];

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
