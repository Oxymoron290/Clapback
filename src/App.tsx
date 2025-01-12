import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import { ContactProvider } from './context/ContactContext';
import AppLayout from './components/AppLayout';
import SignIn from './components/Authentication/SignIn';
import SignUp from './components/Authentication/SignUp';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowSignUp(false);
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <ContactProvider>
        <ChatProvider>
          <AppLayout />
        </ChatProvider>
      </ContactProvider>
    );
  }

  return showSignUp ? (
    <SignUp onSwitchToSignIn={() => setShowSignUp(false)} />
  ) : (
    <SignIn onSwitchToSignUp={() => setShowSignUp(true)} />
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
