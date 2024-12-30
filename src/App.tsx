import React from 'react';
import AppLayout from './components/AppLayout';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import { ContactProvider } from './context/ContactContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ContactProvider>
        <ChatProvider>
          <AppLayout />
        </ChatProvider>
      </ContactProvider>
    </ThemeProvider>
  );
};

export default App;
