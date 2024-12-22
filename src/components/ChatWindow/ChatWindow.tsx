import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow: React.FC = () => {
  const { selectedChatId } = useChatContext();
  return (
    <div className="flex flex-col flex-1">
      <ChatHeader />
      {selectedChatId && (
        <>
          <MessageList />
          <MessageInput />
        </>
      )}
      {!selectedChatId && (
        <div className="flex-1 p-4">Select a contact to start chatting</div>
      )}
    </div>
  );
};

export default ChatWindow;
