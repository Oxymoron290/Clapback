import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuthContext } from './AuthContext';
import { Room } from 'matrix-js-sdk';

interface RoomContextType {
  rooms: Room[];
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string) => void;
  searchResults: { user_id: string; display_name?: string | undefined; avatar_url?: string | undefined; }[];
  fetchRooms: () => void;
  searchUsers: (term: string) => Promise<void>;
  startChat: (userId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { matrixClient } = useAuthContext();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchResults, setSearchResults] = useState<{ user_id: string; display_name?: string | undefined; avatar_url?: string | undefined; }[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

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
  
    try {
      await matrixClient.leave(roomId);
      console.log(`Left room: ${roomId}`);
  
      // Remove the room from the list
      setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== roomId));
    } catch (err) {
      console.error(`Failed to leave room ${roomId}:`, err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [matrixClient]);

  return (
    <RoomContext.Provider value={{ rooms, searchResults, selectedRoomId, setSelectedRoomId, fetchRooms, searchUsers, startChat, leaveRoom }}>
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
