import React from 'react';
import { useContactContext } from '../../context/ContactContext';
import ContactItem from './ContactItem';

const ContactList: React.FC = () => {
  const { contacts, setSelectedChatId } = useContactContext();

  const newChat = () => {
    alert('New chat!');
  };

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
      <div
        className={`p-2 cursor-pointer rounded-lg transition 'hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white bottom-0 fixed'`}
        onClick={newChat}
      >
        New Chat <i className="fas fa-plus ml-2"></i>
      </div>
    </div>
  );
};

export default ContactList;
