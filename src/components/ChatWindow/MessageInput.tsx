import React, { useState } from 'react';
import { useChatContext } from '../../context/ChatContext';

const MessageInput: React.FC = () => {
  const [messageText, setMessageText] = useState('');
  const { selectedChatId, addMessage } = useChatContext();

  const handleSendMessage = () => {
    if (selectedChatId && messageText.trim()) {
      addMessage(selectedChatId, {
        id: Date.now(),
        text: messageText,
        timestamp: new Date(),
        isSentByUser: true,
      });
      setMessageText('');
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message"
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
