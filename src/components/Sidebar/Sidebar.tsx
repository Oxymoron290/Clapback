import React from 'react';
import ContactList from './ContactList';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r shadow-md">
      <div className="p-4 text-xl font-bold border-b">Contacts</div>
      <ContactList />
    </div>
  );
};

export default Sidebar;
