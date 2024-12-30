// context/ContactContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface Contact {
  id: number;
  name: string;
}

interface ContactContextType {
  contacts: Contact[];
  selectedChatId: number | null;
  setSelectedChatId: (id: number) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts] = useState<Contact[]>([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  return (
    <ContactContext.Provider value={{ contacts, selectedChatId, setSelectedChatId }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContactContext = (): ContactContextType => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContactContext must be used within a ContactProvider');
  }
  return context;
};
