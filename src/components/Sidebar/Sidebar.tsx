import React from 'react';
import ContactList from './ContactList';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 border-r bg-gray-200 dark:bg-gray-800 shadow-md dark:border-gray-700">
      <div className="p-4 text-xl font-bold border-b dark:border-gray-700">Contacts</div>
      <ContactList />
    </div>
  );
};

export default Sidebar;
