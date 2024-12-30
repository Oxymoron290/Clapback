import React, { useEffect, useState } from 'react';
import { useContactContext } from '../../context/ContactContext';
import { ChatRecord, useChatContext } from '../../context/ChatContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatConnection from './ChatConnection';

const ChatWindow: React.FC = () => {
  const { selectedChatId } = useContactContext();
  const { chats } = useChatContext();
  const [chat, setChat] = useState<ChatRecord | null>(null);

  useEffect(() => {
    if (!selectedChatId || !chats[selectedChatId]) {
      setChat(null);
      return;
    }
    setChat(chats[selectedChatId]);
  }, [selectedChatId, chats]);

  return (
    <div className="flex flex-col flex-1">
      <ChatHeader />
      {selectedChatId && (
        <>
          <MessageList />
          {chat?.connectionState === 'connected' ? (
            <MessageInput />
          ) : (
            <ChatConnection />
          )}
        </>
      )}
      {!selectedChatId && (
        <div className="flex-1 p-4">Select a contact to start chatting</div>
      )}
    </div>
  );
};

export default ChatWindow;
