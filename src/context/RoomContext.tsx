import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuthContext } from './AuthContext';
import { Room } from 'matrix-js-sdk';

interface RoomContextType {
  rooms: Room[];
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string) => void;
  roomMessages: Record<string, { id: string; text: string; isSentByUser: boolean }[]>;
  searchResults: { user_id: string; display_name?: string | undefined; avatar_url?: string | undefined; }[];
  fetchRooms: () => void;
  searchUsers: (term: string) => Promise<void>;
  startChat: (userId: string) => Promise<void>;
  loadRoomMessages: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, messageText: string) => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { matrixClient, sessionReady } = useAuthContext();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchResults, setSearchResults] = useState<{ user_id: string; display_name?: string | undefined; avatar_url?: string | undefined; }[]>([]);
  const [selectedRoomId, ssrid] = useState<string | null>(null);
  const [roomMessages, setRoomMessages] = useState<Record<string, { id: string; text: string; isSentByUser: boolean }[]>>({});

  const setSelectedRoomId = async (id: string) => {
    if (!matrixClient) return;
  
    const room = matrixClient.getRoom(id);
    if (!room) {
      console.error(`Room with ID ${id} not found.`);
      return;
    }
  
    if (room.getMyMembership() === 'invite') {
      try {
        console.log(`Joining room ${id}...`);
        await matrixClient.joinRoom(id);
        console.log(`Successfully joined room ${id}`);
      } catch (err) {
        console.error(`Failed to join room ${id}:`, err);
        return;
      }
    }

    setRoomMessages({});
    ssrid(id);
    loadRoomMessages(id);
  };

  // Fetch list of visible rooms
  const fetchRooms = () => {
    if (!matrixClient) return;

    const visibleRooms = matrixClient.getVisibleRooms();
    setRooms(visibleRooms);
  };

  // Search for users in the directory
  const searchUsers = async (term: string) => {
    console.log("searching users: ", term);
    if (!matrixClient) return;

    try {
      const result = await matrixClient.searchUserDirectory({ term });
      console.log("search results: ", result);
      setSearchResults(result.results || []);
    } catch (err) {
      console.error('Error searching user directory:', err);
    }
  };

  // Start a direct chat with a user
  const startChat = async (userId: string) => {
    if (!matrixClient) return;

    // Check if a direct chat already exists with the user
    const existingRoom = matrixClient.getVisibleRooms().find((room) =>
        room.getMyMembership() === 'join' && room.getDMInviter() === userId
    );

    if (existingRoom) {
        console.log('Direct chat already exists:', existingRoom.roomId);
        return;
    }
    
    try {
      const roomId = await matrixClient.createRoom({
        invite: [userId],
        is_direct: true,
      });
      console.log('Direct chat started with room ID:', roomId);
      fetchRooms();
      setSelectedRoomId(roomId.room_id);
    } catch (err) {
      console.error('Error starting chat:', err);
    }
  };

  const leaveRoom = async (roomId: string) => {
    if (!matrixClient) return;
    setRoomMessages({});
  
    try {
      await matrixClient.leave(roomId);
      console.log(`Left room: ${roomId}`);
  
      // Remove the room from the list
      setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== roomId));
    } catch (err) {
      console.error(`Failed to leave room ${roomId}:`, err);
    }
  };

  const sendMessage = async (roomId: string, messageText: string) => {
    if (!matrixClient) return;
  
    try {
      // @ts-ignore
      await matrixClient.sendEvent(roomId, 'm.room.message', {
        msgtype: 'm.text',
        body: messageText,
      });
      console.log(`Message sent to room ${roomId}: ${messageText}`);
    } catch (err) {
      console.error(`Failed to send message to room ${roomId}:`, err);
    }
  };

  const loadRoomMessages = async (roomId: string) => {
    if (!matrixClient) return;
    const roomData = await matrixClient?.roomInitialSync(roomId, 50);
    console.log(roomData);
    const historicalMessages = roomData?.messages?.chunk
      .filter((event) => event.type === 'm.room.message')
      .map((event) => ({
        id: event.event_id || '',
        text: event.content.body || '',
        isSentByUser: event.sender === matrixClient.getUserId(),
      }));
      
    // @ts-ignore
    setRoomMessages((prevMessages) => ({
      ...prevMessages,
      [roomId]: historicalMessages,
    }));
  };
  

  useEffect(() => {
    if (sessionReady) {
      setRoomMessages({});
      fetchRooms();
    }
  }, [sessionReady]);
  
  useEffect(() => {
    if (!matrixClient) return;

    const handleTimelineEvent = (event: any, room: Room) => {
      if (event.getType() === 'm.room.message') {
        const content = event.getContent();
        const message = {
          id: event.getId(),
          text: content.body,
          isSentByUser: event.getSender() === matrixClient.getUserId(),
        };

        setRoomMessages((prevMessages) => ({
          ...prevMessages,
          [room.roomId]: [...(prevMessages[room.roomId] || []), message],
        }));
      }
    };

    // @ts-ignore
    matrixClient.on('Room.timeline', handleTimelineEvent);

    return () => {
      // @ts-ignore
      matrixClient.removeListener('Room.timeline', handleTimelineEvent);
    };
  }, [matrixClient]);


  return (
    <RoomContext.Provider value={{
      rooms,
      searchResults,
      selectedRoomId,
      setSelectedRoomId,
      roomMessages,
      fetchRooms,
      searchUsers,
      startChat,
      loadRoomMessages,
      leaveRoom,
      sendMessage
    }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
};
