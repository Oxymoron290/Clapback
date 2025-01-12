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
        className={`p-2 cursor-pointer rounded-lg transition 'hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white bottom-0 fixed'`}
        onClick={newChat}
      >
        New Chat <i className="fas fa-plus ml-2"></i>
      </div>
    </div>
  );
};

export default RoomList;
