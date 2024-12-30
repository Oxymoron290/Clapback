// const {clipboard} = require('electron');
import React, { useEffect, useState } from 'react';
import { useContactContext } from '../../context/ContactContext';
import { useChatContext } from '../../context/ChatContext';

const ChatConnection: React.FC = () => {
  const { selectedChatId } = useContactContext();
  const { chats, createConnection, addICECandidate, createOffer, answerOffer, acceptAnswer, sendMessage } = useChatContext();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [initiator, setInitiator] = useState<boolean>(false);
  const [receiver, setReceiver] = useState<boolean>(false);
  const [localOffer, setLocalOffer] = useState<string | null>(null);
  const [remoteOffer, setRemoteOffer] = useState<string | null>(null);
  const [localAnswer, setLocalAnswer] = useState<string | null>(null);
  const [remoteAnswer, setRemoteAnswer] = useState<string | null>(null);

  const [remoteICE, setRemoteICE] = useState<string | null>(null);

  const [currentStatus, setCurrentStatus] = useState<string>('');

  useEffect(() => {
    if (!peerConnection || !selectedChatId) return;
    let chat = chats[selectedChatId];
    setCurrentStatus(`[${peerConnection.connectionState}]: ${peerConnection.iceConnectionState} - ${peerConnection.iceGatheringState}: ${peerConnection.signalingState} | ${chat?.dataChannel?.readyState}`);
  }, [peerConnection, localOffer, remoteOffer, localAnswer, remoteAnswer]);

  const handleRefresh = () => {
    if (!peerConnection || !selectedChatId) return;
    let chat = chats[selectedChatId];
    setCurrentStatus(`[${peerConnection.connectionState}]: ${peerConnection.iceConnectionState} - ${peerConnection.iceGatheringState}: ${peerConnection.signalingState} | ${chat?.dataChannel?.readyState}`);
  }

  const handleCopyLocalOffer = () => {
    if (!localOffer) return;
    navigator.clipboard.writeText(localOffer);
  };

  const handleCopyLocalAnswer = () => {
    if (!localAnswer) return;
    navigator.clipboard.writeText(localAnswer);
  };

  const handleCreateOffer = async () => {
    if (!selectedChatId) return;

    let peerConnection = chats[selectedChatId]?.peerConnection;
    if (!peerConnection) {
      peerConnection = createConnection(selectedChatId);
      setPeerConnection(peerConnection);
    }

    setInitiator(true);
    setLocalOffer(await createOffer(peerConnection));
  };

  const handleAnswerOffer = async () => {
    if (!selectedChatId) return;

    let peerConnection = chats[selectedChatId]?.peerConnection;
    if (!peerConnection) {
      peerConnection = createConnection(selectedChatId);
      setPeerConnection(peerConnection);
    }

    setReceiver(true);
  };

  const handleAcceptOffer = async () => {
    if (!peerConnection || !remoteOffer) return;
    setLocalAnswer(await answerOffer(peerConnection, remoteOffer));
  };

  const handleSetRemoteAnswer = async () => {
    if (!peerConnection || !remoteAnswer || !selectedChatId) return;
    await acceptAnswer(peerConnection, remoteAnswer);
    sendMessage(selectedChatId, 'Hello, world!');
  };

  const handleRemoteICE = async () => {
    if (!peerConnection || !remoteICE) return;
    addICECandidate(peerConnection, remoteICE);
  };

  return (
    <div className="p-4 border-t">
      <div className="flex flex-col space-y-4 max-w-96 ">

        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          onClick={handleRefresh}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
        {!(initiator || receiver) && (
          <>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={handleCreateOffer}
            >
              Create Offer
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={handleAnswerOffer}
            >
              Answer Offer
            </button>
          </>
        )}
        {initiator && (
          <>
            <div>
              <strong>Local Offer:</strong>
              <div className="flex items-center">
                <textarea
                  className="w-full p-2 border rounded-lg text-black overflow-auto"
                  readOnly
                  rows={4}
                  value={localOffer || ''}
                />
                <button
                  className="ml-2 px-2 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300"
                  onClick={handleCopyLocalOffer}
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            </div>

            <strong>Remote Answer:</strong>
            <textarea
              className="w-full p-2 border rounded-lg text-black overflow-auto"
              rows={4}
              placeholder="Paste remote answer here"
              value={remoteAnswer || ''}
              onChange={(e) => setRemoteAnswer(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              onClick={handleSetRemoteAnswer}
            >
              Set Remote Answer
            </button>
          </>
        )}
        {receiver && (
          <>
            {(!localAnswer) && (
              <>
                <strong>Remote Offer:</strong>
                <textarea
                  className="w-full p-2 border rounded-lg text-black overflow-auto"
                  rows={4}
                  placeholder="Paste remote offer here"
                  value={remoteOffer || ''}
                  onChange={(e) => setRemoteOffer(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  onClick={handleAcceptOffer}
                >
                  Accept Offer
                </button>
              </>
            )}
            {(localAnswer) && (
              <div>
                <strong>Local Answer:</strong>
                <div className="flex items-center">
                  <textarea
                    className="w-full p-2 border rounded-lg text-black overflow-auto"
                    readOnly
                    rows={4}
                    value={localAnswer || ''}
                  />
                  <button
                    className="ml-2 px-2 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300"
                    onClick={handleCopyLocalAnswer}
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        <div className="text-green-500">{currentStatus}</div>

        <div className="flex items-center">
          <div>
            <strong>Local ICE Candidates:</strong>
            <textarea
              className="w-full p-2 border rounded-lg text-black overflow-auto"
              readOnly
              rows={4}
              value={(selectedChatId) ? JSON.stringify(chats[selectedChatId]?.iceCandidates) : ''}
            />
          </div>

          <div>
            <strong>Remote ICE Candidates:</strong>
            <textarea
              className="w-full p-2 border rounded-lg text-black overflow-auto"
              rows={4}
              placeholder="Paste remote candidates here"
              value={remoteICE || ''}
              onChange={(e) => setRemoteICE(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={handleRemoteICE}
            >
              Submit Remote ICE Candidates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatConnection;
