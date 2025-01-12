import React from 'react';
import ContactList from './ContactList';
import AccountControl from './AccountControl';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 border-r bg-gray-200 dark:bg-gray-800 shadow-md dark:border-gray-700 flex flex-col h-screen">
      <div className="p-4 text-xl font-bold border-b dark:border-gray-700">Contacts</div>
      <div className="flex-1 overflow-y-auto">
        <ContactList />
      </div>
      <AccountControl />
    </div>
  );
};

export default Sidebar;
