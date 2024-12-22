import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import ChatWindow from './ChatWindow/ChatWindow';

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default AppLayout;
