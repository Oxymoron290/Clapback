import React from 'react';
import AppLayout from './components/AppLayout';
import { ChatProvider } from './context/ChatContext';

const App: React.FC = () => {
  return (
    <ChatProvider>
      <AppLayout />
    </ChatProvider>
  );
};

export default App;
