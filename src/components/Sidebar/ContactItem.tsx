import React from 'react';
import { useContactContext } from '../../context/ContactContext';

interface ContactItemProps {
  id: number;
  name: string;
  onClick: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ id, name, onClick }) => {
  const { selectedChatId } = useContactContext();

  const isSelected = selectedChatId === id;

  return (
    <div
      className={`p-2 cursor-pointer rounded-lg transition ${isSelected
          ? 'bg-blue-500 text-white'
          : 'hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white'
        }`}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export default ContactItem;
