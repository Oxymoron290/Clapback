import React from 'react';
import { useRoomContext } from '../../context/RoomContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow: React.FC = () => {
  const { selectedRoomId } = useRoomContext();

  return (
    <div className="flex flex-col flex-1">
      <ChatHeader />
      {selectedRoomId && (
        <>
          <MessageList />
          <MessageInput />
        </>
      )}
      {!selectedRoomId && (
        <div className="flex-1 p-4">Select a contact to start chatting</div>
      )}
    </div>
  );
};

export default ChatWindow;
