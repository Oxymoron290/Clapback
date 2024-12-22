import React from 'react';
import { useChatContext } from '../../context/ChatContext';

interface ContactItemProps {
  id: number;
  name: string;
  onClick: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ id, name, onClick }) => {
  const { selectedChatId } = useChatContext();

  const isSelected = selectedChatId === id;

  return (
    <div
      className={`p-2 cursor-pointer rounded-lg transition ${
          isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
        {name}
    </div>
  );
};

export default ContactItem;