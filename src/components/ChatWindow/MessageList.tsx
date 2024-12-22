import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import MessageItem from './MessageItem';

const MessageList: React.FC = () => {
  const { chats, selectedChatId } = useChatContext();

  if (!selectedChatId) {
    return <div className="flex-1 p-4">Select a contact to start chatting</div>;
  }

  const messages = chats[selectedChatId] || [];

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map(message => (
        <MessageItem
          key={message.id}
          text={message.text}
          isSentByUser={message.isSentByUser}
        />
      ))}
    </div>
  );
};

export default MessageList;
