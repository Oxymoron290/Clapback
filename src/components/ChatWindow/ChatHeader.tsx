import React from 'react';
import { useChatContext } from '../../context/ChatContext';

const ChatHeader: React.FC = () => {
  const { contacts, selectedChatId } = useChatContext();

  const selectedContact = contacts.find(contact => contact.id === selectedChatId);

  return (
    <div className="p-4 bg-gray-200 border-b">
      {selectedContact ? (
        <h1 className="text-lg font-bold">
          Chat with {selectedContact.name}
        </h1>
      ) : (
        <h1 className="text-lg font-bold">No Chat Selected</h1>
      )}
    </div>
  );
};

export default ChatHeader;
