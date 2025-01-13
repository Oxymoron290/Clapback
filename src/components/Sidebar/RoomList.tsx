import React from 'react';
import { useRoomContext } from '../../context/RoomContext';
import { useModal } from '../../context/ModalContext';
import RoomItem from './RoomItem';
import UserSearch from '../UserSearch';

const RoomList: React.FC = () => {
  const { rooms, setSelectedRoomId } = useRoomContext();
  const { showModal } = useModal();

  const newChat = () => {
    showModal(<UserSearch />);
  };

  return (
    <div className="p-2">
      {rooms.map((room) => (
        <RoomItem
          key={room.roomId}
          id={room.roomId}
          name={room.name || room.roomId}
          onClick={() => setSelectedRoomId(room.roomId)}
        />
      ))}
      <div
        className={`p-2 cursor-pointer rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white`}
        onClick={newChat}
      >
        <div className="flex justify-between items-center">
          <span>New Chat</span>
          <button
            onClick={newChat}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 m-1"
          >
            <i className="fas fa-plus ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomList;
