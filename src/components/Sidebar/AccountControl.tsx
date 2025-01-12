import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

const AccountControl: React.FC = () => {
  const { matrixClient, logout } = useAuthContext();

  // Get username and avatar URL
  const username = matrixClient?.getUserId()?.split(':')[0].substring(1) || 'Unknown User';
  const avatarUrl = matrixClient?.getUser(matrixClient.getUserId() || '')?.avatarUrl || '';

  return (
    <div className="p-4 border-t flex items-center justify-between">
      <div className="flex items-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
            <span className="text-sm text-white font-bold">{username[0].toUpperCase()}</span>
          </div>
        )}
        <div>
          <p className="text-sm font-medium">{username}</p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="text-red-500 text-sm font-medium hover:underline"
      >
        Logout
      </button>
    </div>
  );
};

export default AccountControl;
