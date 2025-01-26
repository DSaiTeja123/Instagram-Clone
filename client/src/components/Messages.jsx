import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useFetchMessages from '@/hooks/useFetchMessages';
import useFetchNotification from '@/hooks/useFetchNotification';

const Messages = ({ selectedUser }) => {
  useFetchNotification();
  useFetchMessages();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container.scrollTop === 0 && !loading) {
      // If the user has scrolled to the top, load older messages
      setLoading(true);
      loadOlderMessages();
    }
  };

  // Function to load older messages
  const loadOlderMessages = () => {
    // Here, implement the logic to fetch older messages (e.g., through API or Redux action)
    setTimeout(() => {
      // Simulate adding older messages
      setLoading(false);
    }, 1000);
  };

  // Scroll to the bottom when new messages are received
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      className="overflow-y-auto flex-1 p-4"
      ref={messagesContainerRef}
      onScroll={handleScroll}
    >
      <div className="flex flex-col gap-3">
        {messages && messages.map((message) => {
          return (
            <div key={message._id} className={`flex ${ message.senderId === user?._id ? 'justify-end' : 'justify-start' }`} >
              <div className={`p-2 rounded-xl max-w-xs break-words ${ 
                message.senderId === user?._id
                ? 'rounded-tr-none bg-indigo-100 text-black'
                : 'rounded-tl-none bg-blue-400 text-white'
              }`} >
                {message.message}
              </div>
            </div>
          )
        })}
      </div>
      <div ref={messagesEndRef} />
      {loading && <div>Loading older messages...</div>}
    </div>
  )
}

export default Messages;