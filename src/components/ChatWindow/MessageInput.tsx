import React, { useState } from 'react';
import { useRoomContext } from '../../context/RoomContext';
//import { useChatContext } from '../../context/ChatContext';

const MessageInput: React.FC = () => {
  const [messageText, setMessageText] = useState('');
  const { selectedRoomId } = useRoomContext();
  //const { sendMessage } = useChatContext();

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedRoomId && messageText.trim()) {
      //sendMessage(selectedRoomId, messageText);
      setMessageText('');
    }
  };

  return selectedRoomId && (
    <div className="p-4 border-t dark:border-gray-700">
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          placeholder="Type a message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
