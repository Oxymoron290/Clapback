import React, { useState } from 'react';
import { useRoomContext } from '../context/RoomContext';
import { useModal } from '../context/ModalContext';

const UserSearch: React.FC = () => {
  const { searchUsers, searchResults, startChat } = useRoomContext();
  const { hideModal } = useModal();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      await searchUsers(searchTerm);
    }
  };

  const handleStartChat = async (userId: string) => {
    hideModal();
    await startChat(userId); 
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Search Users</h3>
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Search
        </button>
      </form>
      <ul className="divide-y divide-gray-300 dark:divide-gray-600">
        {searchResults.map((user) => (
          <li
            key={user.user_id}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => handleStartChat(user.user_id)}
          >
            {user.display_name || user.user_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
