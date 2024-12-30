import React, { createContext, useState, useContext } from 'react';

export interface Message {
  id: number;
  text: string;
  timestamp: Date;
  isSentByUser: boolean;
}

export interface ChatRecord {
  messages: Message[]; 
  peerConnection: RTCPeerConnection | null; 
  dataChannel: RTCDataChannel | null; 
  iceCandidates: RTCIceCandidate[];
  connectionState: 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';
}

interface ChatContextType {
  chats: Record<number, ChatRecord>;
  createConnection: (contactId: number) => RTCPeerConnection;
  addICECandidate: (peerConnection: RTCPeerConnection, candidateString: string) => Promise<void>;
  closeConnection: (contactId: number) => void;
  createOffer: (peerConnection: RTCPeerConnection) => Promise<string>;
  answerOffer: (peerConnection: RTCPeerConnection, remoteOffer: string) => Promise<string>;
  acceptAnswer: (peerConnection: RTCPeerConnection, remoteAnswer: string) => void;
  sendMessage: (contactId: number, message: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Record<number, ChatRecord>>({});

  const createConnection = (contactId: number): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.l.google.com:5349" },
        { urls: "stun:stun1.l.google.com:3478" },
        { urls: "stun:stun1.l.google.com:5349" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:5349" },
        { urls: "stun:stun3.l.google.com:3478" },
        { urls: "stun:stun3.l.google.com:5349" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:5349" },
      ],
    });

    // Monitor connection state
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log(`Connection state for contact ${contactId}:`, state);
      setChats((prevChats) => ({
        ...prevChats,
        [contactId]: {
          ...prevChats[contactId],
          connectionState: state,
        },
      }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate as RTCIceCandidate;
        // TODO: Signal ICE candidate to other peer (for now, copy manually)
        console.log(`ICE Candidate for contact ${contactId}: ${JSON.stringify(candidate)}`);
        setChats((prevChats) => ({
          ...prevChats,
          [contactId]: {
            ...prevChats[contactId],
            iceCandidates: [...prevChats[contactId].iceCandidates, candidate],
          },
        }));
      }
    };

    pc.ondatachannel = (event) => {
      const channel = event.channel;
      // channel.onmessage = (e) => {
      //   console.log(`Data channel message from contact ${contactId}:`, e.data);
      //   setChats((prevChats) => ({
      //     ...prevChats,
      //     [contactId]: {
      //       ...prevChats[contactId],
      //       messages: [
      //         ...prevChats[contactId].messages,
      //         { id: Date.now(), text: e.data, timestamp: new Date(), isSentByUser: false },
      //       ],
      //     },
      //   }));
      // };

      channel.onopen = () => {
        console.log('Data channel opened');
        setChats((prevChats) => ({
          ...prevChats,
          [contactId]: {
            ...prevChats[contactId],
            connectionState: 'connected',
          },
        }));
      };

      channel.onclose = () => {
        console.log('Data channel closed');
        setChats((prevChats) => ({
          ...prevChats,
          [contactId]: {
            ...prevChats[contactId],
            connectionState: 'disconnected',
          },
        }));
      };

      setChats((prevChats) => ({
        ...prevChats,
        [contactId]: {
          ...prevChats[contactId],
          dataChannel: channel,
        },
      }));
    };
    
    const dataChannel = pc.createDataChannel('chat'); // Create & Open data channel

    dataChannel.onmessage = (e) => {
      console.log(`Data channel message from contact ${contactId}:`, e.data);
      setChats((prevChats) => ({
        ...prevChats,
        [contactId]: {
          ...prevChats[contactId],
          messages: [
            ...prevChats[contactId].messages,
            { id: Date.now(), text: e.data, timestamp: new Date(), isSentByUser: false },
          ],
        },
      }));
    };
  
    setChats((prevChats) => ({
      ...prevChats,
      [contactId]: { messages: [], peerConnection: pc, dataChannel: dataChannel, connectionState: 'new', iceCandidates: [] },
    }));

    return pc;
  };

  const addICECandidate = async (peerConnection: RTCPeerConnection, candidateString: string) => {
    const candidates = JSON.parse(candidateString);

    if (Array.isArray(candidates)) {
      // Handle multiple ICE candidates
      for (const candidate of candidates) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } else {
      // Handle a single ICE candidate
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidates));
    }
  };

  const closeConnection = (contactId: number) => {
    const pc = chats[contactId].peerConnection;
    if (pc) {
      pc.close();
    }
  };

  // Initiate a connection with a contact (initiator)
  const createOffer = async (peerConnection: RTCPeerConnection): Promise<string> => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // TODO: Signal offer to other peer (for now, copy manually)
    return JSON.stringify(offer);
  };

  // Answer an offer from a contact (receiver)
  const answerOffer = async (peerConnection: RTCPeerConnection, remoteOffer: string): Promise<string> => {
    const offer = JSON.parse(remoteOffer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // TODO: Signal answer to other peer (for now, copy manually)
    return JSON.stringify(answer);
  };

  // Accept an answer from a contact (initiator)
  const acceptAnswer = async (peerConnection: RTCPeerConnection, remoteAnswer: string) => {
    const answer = JSON.parse(remoteAnswer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const sendMessage = (contactId: number, message: string) => {
    const chat = chats[contactId];
    if (chat?.dataChannel && chat.dataChannel.readyState === 'open') {
      chat.dataChannel.send(message);
      setChats((prevChats) => ({
        ...prevChats,
        [contactId]: {
          ...prevChats[contactId],
          messages: [
            ...prevChats[contactId].messages,
            { id: Date.now(), text: message, timestamp: new Date(), isSentByUser: true },
          ],
        },
      }));
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        createConnection,
        addICECandidate,
        closeConnection,
        createOffer,
        answerOffer,
        acceptAnswer,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};