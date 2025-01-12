import React from 'react';
import { useRoomContext } from '../../context/RoomContext';
import RoomList from './RoomList';
import AccountControl from './AccountControl';

const Sidebar: React.FC = () => {
  const { fetchRooms } = useRoomContext();

  return (
    <div className="w-64 border-r bg-gray-200 dark:bg-gray-800 shadow-md dark:border-gray-700 flex flex-col h-screen">
      <div className="p-4 text-xl font-bold border-b dark:border-gray-700">
        Contacts
        <button
          onClick={fetchRooms}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 m-1"
        >
          <i className="fa fa-refresh"></i>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <RoomList />
      </div>
      <AccountControl />
    </div>
  );
};

export default Sidebar;
