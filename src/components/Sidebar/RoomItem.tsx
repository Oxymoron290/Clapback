import React, { useState, useEffect, useRef } from 'react';
import { useRoomContext } from '../../context/RoomContext';

interface RoomItemProps {
  id: string;
  name: string;
  onClick: () => void;
}

const RoomItem: React.FC<RoomItemProps> = ({ id, name, onClick }) => {
  const { selectedRoomId, leaveRoom } = useRoomContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedRoomId === id;

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from triggering the room selection
    setMenuOpen((prev) => !prev);
  };

  const handleLeaveRoom = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from triggering the room selection
    leaveRoom(id);
    setMenuOpen(false); // Close the menu after leaving
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <div
      className={`p-2 cursor-pointer rounded-lg transition ${isSelected
          ? 'bg-blue-500 text-white'
          : 'hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white'
        }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <span>{name}</span>
        <button
          onClick={toggleMenu}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 m-1"
        >
          <i className="fas fa-ellipsis"></i>
        </button>
      </div>

      {menuOpen && (
        <div 
          ref={menuRef}
          className="absolute mt-2 w-40 bg-white dark:bg-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10"
        >
          <ul className="p-2">
            <li
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={handleLeaveRoom}
            >
              Leave Chat
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoomItem;
