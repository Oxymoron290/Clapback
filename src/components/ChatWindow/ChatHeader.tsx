import React from 'react';
import { useRoomContext } from '../../context/RoomContext';
import { useThemeContext } from '../../context/ThemeContext';

const ChatHeader: React.FC = () => {
  const { rooms, selectedRoomId } = useRoomContext();
  const { darkMode, toggleDarkMode } = useThemeContext();
  const room = rooms.find((r) => r.roomId === selectedRoomId);

  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center">
        {room ? (
            <h1 className="text-lg font-bold dark:text-white">
                Chat with {room.name || room.roomId}
            </h1>
        ) : (
            <h1 className="text-lg font-bold dark:text-white">No Chat Selected</h1>
        )}
        <button
            onClick={toggleDarkMode}
            className="px-2 py-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-lg"
        >
          <i className={`${darkMode ? `fas` : `far`} fa-sun`}></i>
        </button>
    </div>
  );
};

export default ChatHeader;
