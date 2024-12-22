import React, { createContext, useState, useContext } from 'react';

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  isSentByUser: boolean;
}

interface ChatContextType {
  contacts: { id: number; name: string }[];
  chats: Record<number, Message[]>; // Maps contact IDs to message arrays
  selectedChatId: number | null;
  setSelectedChatId: (id: number) => void;
  addMessage: (contactId: number, message: Message) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Example data; replace with dynamic data later
  const [contacts] = useState([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  // Example data; replace with dynamic data later
  const [chats, setChats] = useState<Record<number, Message[]>>({
    1: [
      { id: 1, text: 'Hi Alice!', timestamp: new Date(2024, 12, 20, 17, 27), isSentByUser: true },
      { id: 2, text: 'Hello!', timestamp: new Date(2024, 12, 20, 17, 32), isSentByUser: false },
    ],
    2: [
      { id: 1, text: 'Hi Bob!', timestamp: new Date(2024, 12, 20, 17, 27), isSentByUser: true },
      { id: 2, text: 'Hello!', timestamp: new Date(2024, 12, 20, 17, 32), isSentByUser: false },
    ],
    3: [
      { id: 1, text: 'Hi Charlie!', timestamp: new Date(2024, 12, 20, 17, 27), isSentByUser: true },
      { id: 2, text: 'Hello!', timestamp: new Date(2024, 12, 20, 17, 32), isSentByUser: false },
    ],
  });

  const addMessage = (contactId: number, message: Message) => {
    setChats(prevChats => ({
      ...prevChats,
      [contactId]: [...(prevChats[contactId] || []), message],
    }));
  };

  return (
    <ChatContext.Provider value={{ contacts, chats, selectedChatId, setSelectedChatId, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};