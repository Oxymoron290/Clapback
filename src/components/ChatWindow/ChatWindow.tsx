import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow: React.FC = () => {
  return (
    <div className="flex flex-col flex-1">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
