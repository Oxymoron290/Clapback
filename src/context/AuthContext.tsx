import React, { createContext, useState, useContext, useEffect } from 'react';
import { createClient, MatrixClient, RegisterRequest } from 'matrix-js-sdk';

interface AuthContextType {
  matrixClient: MatrixClient | null;
  isAuthenticated: boolean;
  sessionReady: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const MATRIX_BASE_URL = 'https://clapback.chat';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matrixClient, setMatrixClient] = useState<MatrixClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const login = async (username: string, password: string) => {
    const client = createClient({ baseUrl: MATRIX_BASE_URL });

    await client.loginWithPassword(username, password);
    await setLoggedIn(client);
  };

  const logout = () => {
    setMatrixClient(null);
    setIsAuthenticated(false);
    setSessionReady(false);
    localStorage.removeItem('matrix_access_token');
    localStorage.removeItem('matrix_user_id');
    localStorage.removeItem('matrix_registration_session');
    localStorage.removeItem('matrix_email_sid');
    matrixClient?.logout();
  };

  const setLoggedIn = async (client: MatrixClient) => {
    console.log("Setting logged in: ", client.getUserId());
    setMatrixClient(client);

    localStorage.setItem('matrix_access_token', client.getAccessToken() || '');
    localStorage.setItem('matrix_user_id', client.getUserId() || '');
    localStorage.removeItem('matrix_registration_session');
    localStorage.removeItem('matrix_email_sid');

    client.startClient().then(() => {
      setSessionReady(true);
    });
    setIsAuthenticated(true);
  }

  // Function to handle registration
  const register = async (username: string, email: string, password: string) => {
    const client = createClient({ baseUrl: MATRIX_BASE_URL });
    console.log("Registering user: ", username, email, password);
    const deviceName = 'monkeyBusiness'; // Replace with your device display name
    
    const clientSecret = '4w5sthgfb345'; // Replace with your client secret
    const sendAttempt = 1; // Replace with your desired send attempt count
    
    const verifyEmail = async (req: any, emailTokenSid: string) => {
      const creds/*: ThreepidCreds*/ = {
        client_secret: clientSecret, // Replace with your client secret
        // id_access_token: '', // Replace with the access token for the email identity
        // id_server: '', // Replace with the ID server URL
        sid: emailTokenSid, // Replace with the session ID from the error response
      }
      const auth/*: EmailIdentityDict*/ = {
        session: req.session,
        threepid_creds: creds,
        type: 'm.login.email.identity', //AuthType.Email
      }
      return client.registerRequest({...req, auth: auth})
    }

    const req: RegisterRequest = {
      inhibit_login: false,
      initial_device_display_name: deviceName,
      password: password,
      refresh_token: false,
      username: username,
    }

    const ongoingSession = localStorage.getItem('matrix_registration_session');
    if(ongoingSession) {
      const emailSid = localStorage.getItem('matrix_email_sid') || '';
      const response = verifyEmail({...req, session: ongoingSession}, emailSid);
      // {
      //   "user_id": "@oxy3:clapback.chat",
      //   "home_server": "clapback.chat",
      //   "access_token": "syt_b3h5Mw_SPcKaUKfQWuXbAeNlSCP_2yqz6m",
      //   "device_id": "NUJHFDSOWG"
      // }
      console.log(response);
      setLoggedIn(client);
      return;
    }

    await client.registerRequest(req)
      .then((response) => {
        // Handle successful registration (if no error occurs)
        console.log('Registration successful:', response);
      })
      .catch((error) => {
        if (error?.httpStatus === 401 && error?.data) {
          // Extract session and flows from the error response payload
          const { session, flows } = error.data;
          localStorage.setItem('matrix_registration_session', session);
          console.log('Session:', session);
          console.log('Flows:', flows);
          // TODO: check that flows[].stages[] includes 'm.login.email.identity'
          // I am currently assuming this is the only stage.

          // TODO: Prompt user to check mailbox.
          client.requestRegisterEmailToken(email, clientSecret, sendAttempt)
            .then((response) => {
              console.log('Email token sent successfully:', response);
              localStorage.setItem('matrix_email_sid', response.sid || '');
              verifyEmail({...req, session}, response.sid || '');
            })
            .catch((error) => {
              if (error?.httpStatus === 400 && error?.data && error?.data['errcode'] === 'M_THREEPID_IN_USE') {
                console.error('Email already in use:', error.data['error']);
              }
            });
          // Proceed with subsequent requests using session and flows
        } else {
          // Handle other errors (e.g., network issues, 500 errors)
          console.error('Unexpected error:', error);
        }
      });
    // try {
    //   const step1 = await client.register(
    //     username,
    //     password,
    //     client.getSessionId(),
    //     { type: 'm.login.dummy' }, // auth (use dummy auth for simplicity)
    //     { email: true } // bind email 3PID
    //   );

    //   console.log("Registration 1: ", step1);

    //   setMatrixClient(client);
    //   setIsAuthenticated(true);

    //   localStorage.setItem('matrix_access_token', client.getAccessToken() || '');
    //   localStorage.setItem('matrix_user_id', client.getUserId() || '');
    // } catch (err) {
    //   console.error('Error during registration:', err);
    //   throw new Error('Registration failed. Please check your details.');
    // }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('matrix_access_token');
    const userId = localStorage.getItem('matrix_user_id');

    if (accessToken && userId) {
      const client = createClient({
        baseUrl: MATRIX_BASE_URL,
        accessToken,
        userId,
      });
      // client.loginWithToken(accessToken).then(() => {
        setLoggedIn(client);
      // });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ matrixClient, isAuthenticated, sessionReady, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
