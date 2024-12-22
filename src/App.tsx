import React from 'react';
import AppLayout from './components/AppLayout';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ChatProvider>
        <AppLayout />
      </ChatProvider>
    </ThemeProvider>
  );
};

export default App;
