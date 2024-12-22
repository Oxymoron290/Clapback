import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import ContactItem from './ContactItem';

const ContactList: React.FC = () => {
  const { contacts, setSelectedChatId } = useChatContext();

  return (
    <div className="p-2">
      {contacts.map(contact => (
        <ContactItem
          key={contact.id}
          id={contact.id}
          name={contact.name}
          onClick={() => setSelectedChatId(contact.id)}
        />
      ))}
    </div>
  );
};

export default ContactList;
