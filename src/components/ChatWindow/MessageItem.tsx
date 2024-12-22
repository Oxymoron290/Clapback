import React from 'react';

interface MessageItemProps {
  text: string;
  isSentByUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ text, isSentByUser }) => {
  return (
    <div className={`p-2 mb-2 ${isSentByUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block p-2 rounded-lg ${isSentByUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-300 dark:bg-gray-700 dark:text-white'
          }`}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageItem;
