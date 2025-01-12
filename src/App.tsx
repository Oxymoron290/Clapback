import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import { RoomProvider } from './context/RoomContext';
import { ModalProvider } from './context/ModalContext';
import Modal from './components/Modals/BasicModal';
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
      <AppLayout />
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
        <ChatProvider>
          <RoomProvider>
            <ModalProvider>
              <AppContent />
              <Modal />
            </ModalProvider>
          </RoomProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
