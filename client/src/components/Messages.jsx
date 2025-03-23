import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useFetchMessages from '@/hooks/useFetchMessages';
import useFetchNotification from '@/hooks/useFetchNotification';

const Messages = ({ selectedUser }) => {
  useFetchNotification();
  useFetchMessages();

  const { messages } = useSelector((store) => store.chat);
  const { user, colorToggled } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container.scrollTop === 0 && !loading) {
      setLoading(true);
      loadOlderMessages();
    }
  };

  const loadOlderMessages = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      className="overflow-y-auto flex-1 p-4 transition-colors duration-500"
      ref={messagesContainerRef}
      onScroll={handleScroll}
    >
      <div className="flex flex-col gap-3">
        {messages?.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.senderId === user?._id
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`p-2 rounded-xl max-w-xs break-words transition-colors duration-500 ${
                message.senderId === user?._id
                  ? colorToggled
                    ? 'rounded-tr-none bg-gray-500 text-white'
                    : 'rounded-tr-none bg-indigo-100 text-black'
                  : colorToggled
                  ? 'rounded-tl-none bg-gray-700 text-white'
                  : 'rounded-tl-none bg-blue-400 text-white'
              }`}
            >
              {message.message}
            </div>
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />
      {loading && <div className="text-center mt-4">Loading older messages...</div>}
    </div>
  );
};

export default Messages;
